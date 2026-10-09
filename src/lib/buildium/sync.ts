import {
    BuildiumAddress,
    BuildiumClient,
    BuildiumImage,
    BuildiumListing,
    BuildiumUnit,
} from '@/lib/buildium/client';
import { createAdminClient } from '@/lib/supabase/server';
import { PropertyStatus } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { XMLParser } from 'fast-xml-parser';

const DEFAULT_RENTALS_XML_FEED_URL =
    'https://quaestusllc.managebuilding.com/Resident/PublicPages/XMLRentals.ashx?listings=all';

export type SyncRunStats = {
    fetched: number;
    upserted: number;
    imagesReplaced: number;
    deleted: number;
    skipped: number;
};

type MappedProperty = {
    buildiumId: string;
    title: string;
    address: string;
    city: string;
    zip: string;
    rentPrice: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    status: PropertyStatus;
    description: string;
    images: string[];
};

type FeedMode = 'XML_FEED' | 'BUILDIUM_API';

type CustomRecordDates = {
    listDate?: Date;
    delistDate?: Date;
    availabilityDate?: Date;
};

function normalizeText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

function normalizeNumber(value: unknown): number {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
}

function asArray<T>(value: T | T[] | null | undefined): T[] {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function getNodeText(value: unknown): string {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value).trim();
    }
    if (value && typeof value === 'object') {
        const textNode = (value as { '#text'?: unknown })['#text'];
        if (typeof textNode === 'string' || typeof textNode === 'number' || typeof textNode === 'boolean') {
            return String(textNode).trim();
        }
    }
    return '';
}

function parseDateSafe(value: unknown): Date | undefined {
    const text = getNodeText(value);
    if (!text || text.startsWith('0001-01-01')) {
        return undefined;
    }
    const date = new Date(text);
    if (Number.isNaN(date.getTime())) {
        return undefined;
    }
    return date;
}

function getRoomCount(roomNodes: unknown, roomType: 'Bedroom' | 'Bathroom'): number {
    const room = asArray(roomNodes).find((entry) => {
        if (!entry || typeof entry !== 'object') {
            return false;
        }
        const type = getNodeText((entry as { RoomType?: unknown }).RoomType).toLowerCase();
        return type === roomType.toLowerCase();
    }) as { Count?: unknown } | undefined;

    return normalizeNumber(room?.Count);
}

function readRent(floorplan: Record<string, unknown>): number {
    const effective = floorplan.EffectiveRent as { Min?: unknown; Max?: unknown } | undefined;
    const market = floorplan.MarketRent as { Min?: unknown; Max?: unknown } | undefined;
    return normalizeNumber(
        effective?.Min ?? effective?.Max ?? market?.Min ?? market?.Max
    );
}

function readSqft(floorplan: Record<string, unknown>): number {
    const sqft = floorplan.SquareFeet as { Min?: unknown; Max?: unknown } | undefined;
    return normalizeNumber(sqft?.Min ?? sqft?.Max);
}

function readRank(fileNode: unknown): number {
    if (!fileNode || typeof fileNode !== 'object') {
        return Number.MAX_SAFE_INTEGER;
    }
    return normalizeNumber((fileNode as { Rank?: unknown }).Rank) || Number.MAX_SAFE_INTEGER;
}

function extractUnitIdFromUrl(urlValue: unknown): string {
    const text = getNodeText(urlValue);
    if (!text) {
        return '';
    }
    try {
        const url = new URL(text);
        return url.searchParams.get('unitid') || '';
    } catch {
        return '';
    }
}

function inferXmlStatus(dates?: CustomRecordDates): PropertyStatus {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dates?.listDate) {
        const listDate = new Date(dates.listDate.getFullYear(), dates.listDate.getMonth(), dates.listDate.getDate());
        if (listDate > today) {
            return 'PENDING';
        }
    }

    if (dates?.delistDate) {
        const delistDate = new Date(dates.delistDate.getFullYear(), dates.delistDate.getMonth(), dates.delistDate.getDate());
        if (delistDate < today) {
            return 'RENTED';
        }
    }

    return 'AVAILABLE';
}

async function isReachableImageUrl(url: string, cache: Map<string, boolean>): Promise<boolean> {
    if (cache.has(url)) {
        return cache.get(url) || false;
    }

    try {
        const head = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        if (head.ok) {
            cache.set(url, true);
            return true;
        }

        // Some hosts reject HEAD even for valid assets. Fallback to GET.
        const get = await fetch(url, { method: 'GET', cache: 'no-store' });
        const ok = get.ok;
        cache.set(url, ok);
        return ok;
    } catch {
        cache.set(url, false);
        return false;
    }
}

async function filterReachableImages(urls: string[], cache: Map<string, boolean>, maxToKeep = 12): Promise<string[]> {
    const reachable: string[] = [];

    for (const url of urls) {
        if (await isReachableImageUrl(url, cache)) {
            reachable.push(url);
        }
        if (reachable.length >= maxToKeep) {
            break;
        }
    }

    return reachable;
}

function buildCustomRecordMap(customRecordsNode: unknown) {
    const byUnitId = new Map<string, CustomRecordDates>();

    for (const recordSet of asArray(customRecordsNode)) {
        if (!recordSet || typeof recordSet !== 'object') {
            continue;
        }

        const records = asArray((recordSet as { Record?: unknown }).Record);
        const values = new Map<string, unknown>();

        for (const rec of records) {
            if (!rec || typeof rec !== 'object') {
                continue;
            }
            const key = getNodeText((rec as { Name?: unknown }).Name);
            const value = (rec as { Value?: unknown }).Value;
            if (key) {
                values.set(key, value);
            }
        }

        const unitId = getNodeText(values.get('UnitIDValue'));
        if (!unitId) {
            continue;
        }

        byUnitId.set(unitId, {
            listDate: parseDateSafe(values.get('ListDate')),
            delistDate: parseDateSafe(values.get('DelistDate')),
            availabilityDate: parseDateSafe(values.get('AvailabilityDate')),
        });
    }

    return byUnitId;
}

async function getXmlFeedMappedProperties(feedUrl: string): Promise<MappedProperty[]> {
    const response = await fetch(feedUrl, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`XML feed request failed: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        parseAttributeValue: true,
        trimValues: true,
    });

    const parsed = parser.parse(xmlText) as {
        PhysicalProperty?: {
            Property?: unknown;
            CustomRecords?: unknown;
        };
    };

    const root = parsed.PhysicalProperty;
    if (!root) {
        return [];
    }

    const customRecordsByUnitId = buildCustomRecordMap(root.CustomRecords);
    const mapped: MappedProperty[] = [];
    const imageUrlReachabilityCache = new Map<string, boolean>();

    for (const property of asArray(root.Property)) {
        if (!property || typeof property !== 'object') {
            continue;
        }

        const prop = property as Record<string, unknown>;
        const propertyId = getNodeText((prop.Identification as { IDValue?: unknown } | undefined)?.IDValue);
        const propertyInfo = (prop.PropertyID as Record<string, unknown> | undefined) ?? {};
        const addressInfo = (propertyInfo.Address as Record<string, unknown> | undefined) ?? {};
        const address = getNodeText(addressInfo.Address);
        const city = getNodeText(addressInfo.City);
        const zip = getNodeText(addressInfo.PostalCode);
        const marketingName = getNodeText(propertyInfo.MarketingName);
        const longDescription = getNodeText((prop.Information as Record<string, unknown> | undefined)?.LongDescription);

        for (const floorplanNode of asArray(prop.Floorplan)) {
            if (!floorplanNode || typeof floorplanNode !== 'object') {
                continue;
            }

            const floorplan = floorplanNode as Record<string, unknown>;
            const listingId = getNodeText((floorplan.Identification as { IDValue?: unknown } | undefined)?.IDValue);
            const unitId = extractUnitIdFromUrl(floorplan.FloorplanAvailabilityURL);
            const buildiumId = listingId || `${propertyId}-${unitId || mapped.length + 1}`;

            const files = asArray(floorplan.File)
                .sort((a, b) => readRank(a) - readRank(b));

            const rawImages = files
                .map((file) => getNodeText((file as { Src?: unknown }).Src))
                .filter(Boolean);
            const images = await filterReachableImages(rawImages, imageUrlReachabilityCache);

            const title = getNodeText(floorplan.Name) || marketingName || `${address}, ${city}`.trim() || `Listing ${buildiumId}`;
            const status = inferXmlStatus(customRecordsByUnitId.get(unitId));

            mapped.push({
                buildiumId,
                title,
                address: address || 'Address unavailable',
                city: city || 'Unknown',
                zip: zip || '00000',
                rentPrice: readRent(floorplan),
                bedrooms: getRoomCount(floorplan.Room, 'Bedroom'),
                bathrooms: getRoomCount(floorplan.Room, 'Bathroom'),
                sqft: readSqft(floorplan),
                status,
                description: longDescription || `Managed by Blue Pillar Management (XML listing ${buildiumId}).`,
                images,
            });
        }
    }

    return mapped;
}

function pickAddress(buildiumAddress?: BuildiumAddress): {
    line1: string;
    city: string;
    zip: string;
} {
    if (!buildiumAddress) {
        return { line1: '', city: '', zip: '' };
    }

    return {
        line1: normalizeText(buildiumAddress.AddressLine1),
        city: normalizeText(buildiumAddress.City),
        zip: normalizeText(buildiumAddress.PostalCode) || normalizeText(buildiumAddress.Zip),
    };
}

function getListingImages(listing?: BuildiumListing, unit?: BuildiumUnit): string[] {
    const allImages: BuildiumImage[] = [
        ...(listing?.Images ?? []),
        ...(unit?.Images ?? []),
    ];

    return allImages
        .sort((a, b) => {
            const aOrder = a.Position ?? a.SortOrder ?? Number.MAX_SAFE_INTEGER;
            const bOrder = b.Position ?? b.SortOrder ?? Number.MAX_SAFE_INTEGER;
            return aOrder - bOrder;
        })
        .map((img) => normalizeText(img.Url) || normalizeText(img.Uri))
        .filter(Boolean);
}

function mapBuildiumStatusToPropertyStatus(listing: BuildiumListing, unit?: BuildiumUnit): PropertyStatus {
    const listingStatus = normalizeText(listing.Status).toUpperCase();
    const unitStatus = normalizeText(unit?.Status).toUpperCase();

    const isUnlisted = listing.IsListed === false || unit?.IsListed === false;
    if (isUnlisted) {
        return 'UNLISTED';
    }

    const composite = `${listingStatus} ${unitStatus}`;
    if (composite.includes('RENTED') || composite.includes('LEASED') || composite.includes('OCCUPIED')) {
        return 'RENTED';
    }
    if (composite.includes('PENDING') || composite.includes('APPLIC')) {
        return 'PENDING';
    }
    if (composite.includes('INACTIVE')) {
        return 'UNLISTED';
    }

    return 'AVAILABLE';
}

function mapBuildiumListingToProperty(listing: BuildiumListing, unit?: BuildiumUnit): MappedProperty | null {
    const address = pickAddress(listing.Address ?? unit?.Address);
    const buildiumId = String(listing.Id);

    if (!buildiumId) {
        return null;
    }

    const title =
        normalizeText(listing.Title) ||
        normalizeText(listing.Name) ||
        normalizeText(unit?.Name) ||
        [address.line1, address.city].filter(Boolean).join(', ') ||
        `Buildium Listing ${buildiumId}`;

    const description =
        normalizeText(listing.Description) ||
        normalizeText(unit?.Description) ||
        `Managed by Blue Pillar Management (Buildium listing ${buildiumId}).`;

    return {
        buildiumId,
        title,
        address: address.line1 || 'Address unavailable',
        city: address.city || 'Unknown',
        zip: address.zip || '00000',
        rentPrice: normalizeNumber(listing.Price ?? listing.Rent ?? unit?.MarketRent ?? unit?.Rent),
        bedrooms: normalizeNumber(listing.Bedrooms ?? unit?.Bedrooms),
        bathrooms: normalizeNumber(listing.Bathrooms ?? unit?.Bathrooms),
        sqft: normalizeNumber(listing.Area ?? listing.SquareFootage ?? unit?.SquareFootage),
        status: mapBuildiumStatusToPropertyStatus(listing, unit),
        description,
        images: getListingImages(listing, unit),
    };
}

export async function runBuildiumSync() {
    const supabase = createAdminClient();
    const stats: SyncRunStats = {
        fetched: 0,
        upserted: 0,
        imagesReplaced: 0,
        deleted: 0,
        skipped: 0,
    };
    let mode: FeedMode = 'BUILDIUM_API';
    let mapped: MappedProperty[] = [];

    const xmlFeedUrl = process.env.BUILDIUM_XML_FEED_URL || DEFAULT_RENTALS_XML_FEED_URL;

    try {
        mapped = await getXmlFeedMappedProperties(xmlFeedUrl);
        mode = 'XML_FEED';
    } catch {
        const buildiumClient = new BuildiumClient();
        const listings = await buildiumClient.getAllListings();
        const unitIds = listings
            .map((listing) => listing.UnitId)
            .filter((id): id is number => typeof id === 'number' && Number.isFinite(id));
        const unitsById = await buildiumClient.getUnitsByIds(unitIds);

        mapped = listings
            .map((listing) => mapBuildiumListingToProperty(listing, listing.UnitId ? unitsById.get(listing.UnitId) : undefined))
            .filter((item): item is MappedProperty => Boolean(item));
    }

    stats.fetched = mapped.length;

    const syncedBuildiumIds = new Set<string>();

    for (const item of mapped) {
        syncedBuildiumIds.add(item.buildiumId);

        const { data: upsertedProperty, error: upsertError } = await supabase
            .from('properties')
            .upsert(
                {
                    buildium_id: item.buildiumId,
                    source: 'buildium',
                    title: item.title,
                    address: item.address,
                    city: item.city,
                    zip: item.zip,
                    rent_price: item.rentPrice,
                    bedrooms: item.bedrooms,
                    bathrooms: item.bathrooms,
                    sqft: item.sqft,
                    status: item.status,
                    description: item.description,
                    featured: false,
                },
                { onConflict: 'buildium_id' }
            )
            .select('id')
            .single();

        if (upsertError || !upsertedProperty) {
            stats.skipped += 1;
            continue;
        }

        stats.upserted += 1;

        await supabase
            .from('property_images')
            .delete()
            .eq('property_id', upsertedProperty.id);

        if (item.images.length > 0) {
            const imageRows = item.images.map((url, idx) => ({
                property_id: upsertedProperty.id,
                storage_url: url,
                display_order: idx,
            }));

            const { error: imageInsertError } = await supabase
                .from('property_images')
                .insert(imageRows);

            if (!imageInsertError) {
                stats.imagesReplaced += imageRows.length;
            }
        }
    }

    const { data: existingBuildiumRows, error: fetchExistingError } = await supabase
        .from('properties')
        .select('id, buildium_id')
        .eq('source', 'buildium');

    if (!fetchExistingError && existingBuildiumRows) {
        const staleIds = existingBuildiumRows
            .filter((row) => row.buildium_id && !syncedBuildiumIds.has(String(row.buildium_id)))
            .map((row) => row.id);

        if (staleIds.length > 0) {
            await supabase
                .from('properties')
                .delete()
                .in('id', staleIds);
            stats.deleted += staleIds.length;
        }
    }

    revalidatePath('/rentals');
    revalidatePath('/');

    return {
        ok: true,
        mode,
        syncedAt: new Date().toISOString(),
        stats,
    };
}