import type { Furnishing, ListingType, Property, PropertyStatus, PropertyType } from '@/lib/types';
import { formatAreaUnit, formatPrice } from '@/lib/utils';

/* ─────────────────────────────────────────────
   Labels
   ───────────────────────────────────────────── */

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
    HOUSE: 'House',
    APARTMENT: 'Apartment',
    VILLA: 'Villa',
    TOWNHOUSE: 'Townhouse',
    PENTHOUSE: 'Penthouse',
    STUDIO: 'Studio',
    PLOT: 'Plot',
    COMMERCIAL: 'Commercial',
};

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
    SALE: 'For sale',
    RENT: 'For rent',
};

export const FURNISHING_LABELS: Record<Furnishing, string> = {
    FURNISHED: 'Furnished',
    SEMI_FURNISHED: 'Semi-furnished',
    UNFURNISHED: 'Unfurnished',
};

/**
 * Statuses that are still on the market and may appear on the public site.
 * Sold, rented and unlisted properties are never shown publicly — the only status
 * a visitor sees is the listing type ("For sale" / "For rent").
 */
export const PUBLIC_STATUSES = ['AVAILABLE', 'PENDING', 'SHOWCASE'] as const satisfies readonly PropertyStatus[];

export const AMENITY_OPTIONS = [
    'Pool', 'Gym', 'Garden', 'Garage', 'Balcony', 'Fireplace', 'Security', 'Concierge',
    'Elevator', 'Laundry', 'Pet Friendly', 'Smart Home', 'Solar Panels', 'Home Office',
    'Home Theater', 'Rooftop Terrace', 'Spa', 'Servant Quarter', 'Backup Generator',
];

/* ─────────────────────────────────────────────
   Display helpers
   ───────────────────────────────────────────── */

/** "PKR 3.5 Lakh /month" for rentals, "PKR 9.5 Crore" for sales. */
export function formatListingPrice(property: Pick<Property, 'rent_price' | 'listing_type'>) {
    return {
        amount: formatPrice(property.rent_price || 0),
        suffix: property.listing_type === 'RENT' ? '/month' : '',
    };
}

/** Public status label — always "For sale" or "For rent". */
export function getListingBadge(property: Pick<Property, 'listing_type'>) {
    return LISTING_TYPE_LABELS[property.listing_type];
}

export function formatArea(sqft: number) {
    return formatAreaUnit(sqft || 0);
}

/* ─────────────────────────────────────────────
   Filters
   ───────────────────────────────────────────── */

export const SORT_OPTIONS = {
    featured: 'Featured',
    newest: 'Newest',
    'price-asc': 'Price: Low → High',
    'price-desc': 'Price: High → Low',
    'area-desc': 'Largest area',
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;

export interface PropertyFilters {
    q: string;
    listing: ListingType | '';
    city: string;
    type: PropertyType | '';
    minPrice: string;
    maxPrice: string;
    beds: string;
    baths: string;
    minArea: string;
    furnishing: Furnishing | '';
    amenities: string[];
    sort: SortKey;
}

export const DEFAULT_FILTERS: PropertyFilters = {
    q: '',
    listing: '',
    city: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    minArea: '',
    furnishing: '',
    amenities: [],
    sort: 'featured',
};

const toNumber = (value: string) => {
    const n = Number(value);
    return value !== '' && Number.isFinite(n) ? n : null;
};

export function filtersFromParams(params: URLSearchParams): PropertyFilters {
    const sort = params.get('sort') as SortKey | null;
    return {
        q: params.get('q') ?? '',
        listing: (params.get('listing') as ListingType) ?? '',
        city: params.get('city') ?? '',
        type: (params.get('type') as PropertyType) ?? '',
        minPrice: params.get('minPrice') ?? '',
        maxPrice: params.get('maxPrice') ?? '',
        beds: params.get('beds') ?? '',
        baths: params.get('baths') ?? '',
        minArea: params.get('minArea') ?? '',
        furnishing: (params.get('furnishing') as Furnishing) ?? '',
        amenities: params.get('amenities')?.split(',').filter(Boolean) ?? [],
        sort: sort && sort in SORT_OPTIONS ? sort : 'featured',
    };
}

export function filtersToParams(filters: PropertyFilters): URLSearchParams {
    const params = new URLSearchParams();
    (Object.keys(filters) as (keyof PropertyFilters)[]).forEach((key) => {
        const value = filters[key];
        if (key === 'sort' && value === DEFAULT_FILTERS.sort) return;
        if (Array.isArray(value)) {
            if (value.length) params.set(key, value.join(','));
        } else if (value) {
            params.set(key, value);
        }
    });
    return params;
}

export function applyFilters(properties: Property[], f: PropertyFilters): Property[] {
    const q = f.q.trim().toLowerCase();
    const minPrice = toNumber(f.minPrice);
    const maxPrice = toNumber(f.maxPrice);
    const beds = toNumber(f.beds);
    const baths = toNumber(f.baths);
    const minArea = toNumber(f.minArea);

    const result = properties.filter((p) => {
        if (q && ![p.title, p.address, p.city, p.zip].some((v) => v?.toLowerCase().includes(q))) return false;
        if (f.listing && p.listing_type !== f.listing) return false;
        if (f.city && p.city !== f.city) return false;
        if (f.type && p.property_type !== f.type) return false;
        if (minPrice !== null && p.rent_price < minPrice) return false;
        if (maxPrice !== null && p.rent_price > maxPrice) return false;
        if (beds !== null && p.bedrooms < beds) return false;
        if (baths !== null && p.bathrooms < baths) return false;
        if (minArea !== null && p.sqft < minArea) return false;
        if (f.furnishing && p.furnishing !== f.furnishing) return false;
        if (f.amenities.length && !f.amenities.every((a) => p.amenities?.includes(a))) return false;
        return true;
    });

    return sortProperties(result, f.sort);
}

export function sortProperties(properties: Property[], sort: SortKey): Property[] {
    const sorted = [...properties];
    const newest = (a: Property, b: Property) => +new Date(b.created_at) - +new Date(a.created_at);
    switch (sort) {
        case 'newest': return sorted.sort(newest);
        case 'price-asc': return sorted.sort((a, b) => a.rent_price - b.rent_price);
        case 'price-desc': return sorted.sort((a, b) => b.rent_price - a.rent_price);
        case 'area-desc': return sorted.sort((a, b) => b.sqft - a.sqft);
        default: return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || newest(a, b));
    }
}

export interface FilterChip {
    key: keyof PropertyFilters;
    label: string;
    /** Set for amenity chips so only that amenity is removed. */
    value?: string;
}

/** Human-readable chips for every active filter (sort excluded). */
export function getActiveFilterChips(f: PropertyFilters): FilterChip[] {
    const chips: FilterChip[] = [];
    if (f.q) chips.push({ key: 'q', label: `“${f.q}”` });
    if (f.listing) chips.push({ key: 'listing', label: LISTING_TYPE_LABELS[f.listing] });
    if (f.city) chips.push({ key: 'city', label: f.city });
    if (f.type) chips.push({ key: 'type', label: PROPERTY_TYPE_LABELS[f.type] });
    if (f.minPrice) chips.push({ key: 'minPrice', label: `Min ${formatPrice(Number(f.minPrice))}` });
    if (f.maxPrice) chips.push({ key: 'maxPrice', label: `Max ${formatPrice(Number(f.maxPrice))}` });
    if (f.beds) chips.push({ key: 'beds', label: `${f.beds}+ beds` });
    if (f.baths) chips.push({ key: 'baths', label: `${f.baths}+ baths` });
    if (f.minArea) chips.push({ key: 'minArea', label: `${Number(f.minArea).toLocaleString()}+ sq ft` });
    if (f.furnishing) chips.push({ key: 'furnishing', label: FURNISHING_LABELS[f.furnishing] });
    f.amenities.forEach((a) => chips.push({ key: 'amenities', label: a, value: a }));
    return chips;
}

/*
 * Simple status the admin works with. Maps onto (status, listing_type) so the
 * database keeps its detailed enum: live listings are AVAILABLE, drafts UNLISTED.
 */
export type SimpleStatus = 'FOR_SALE' | 'FOR_RENT' | 'SOLD' | 'RENTED' | 'DRAFT';

export const SIMPLE_STATUS_LABELS: Record<SimpleStatus, string> = {
    FOR_SALE: 'For sale',
    FOR_RENT: 'For rent',
    SOLD: 'Sold',
    RENTED: 'Rented',
    DRAFT: 'Draft',
};

/** Live statuses appear on the public site; the rest are kept on record only. */
export const LIVE_SIMPLE_STATUSES: SimpleStatus[] = ['FOR_SALE', 'FOR_RENT'];

export function toSimpleStatus(p: { status: string; listing_type: string }): SimpleStatus {
    if (p.status === 'SOLD') return 'SOLD';
    if (p.status === 'RENTED') return 'RENTED';
    if ((PUBLIC_STATUSES as readonly string[]).includes(p.status)) return p.listing_type === 'RENT' ? 'FOR_RENT' : 'FOR_SALE';
    return 'DRAFT';
}

/** Database fields for a simple status. Drafts keep whatever listing type they had. */
export function fromSimpleStatus(s: SimpleStatus, currentType: string): { status: PropertyStatus; listing_type: ListingType } {
    switch (s) {
        case 'FOR_SALE': return { status: 'AVAILABLE', listing_type: 'SALE' };
        case 'FOR_RENT': return { status: 'AVAILABLE', listing_type: 'RENT' };
        case 'SOLD': return { status: 'SOLD', listing_type: 'SALE' };
        case 'RENTED': return { status: 'RENTED', listing_type: 'RENT' };
        case 'DRAFT': return { status: 'UNLISTED', listing_type: currentType === 'RENT' ? 'RENT' : 'SALE' };
    }
}
