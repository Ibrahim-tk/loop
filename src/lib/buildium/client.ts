/**
 * Buildium API Client
 * Interacts with Buildium Open API for pulling listings/units.
 */

export interface BuildiumAddress {
    AddressLine1?: string;
    AddressLine2?: string;
    City?: string;
    State?: string;
    PostalCode?: string;
    Zip?: string;
}

export interface BuildiumImage {
    Url?: string;
    Uri?: string;
    Position?: number;
    SortOrder?: number;
}

export interface BuildiumListing {
    Id: number;
    UnitId?: number;
    PropertyId?: number;
    Name?: string;
    Title?: string;
    Status?: string;
    IsActive?: boolean;
    IsListed?: boolean;
    Price?: number;
    Rent?: number;
    Bedrooms?: number;
    Bathrooms?: number;
    Area?: number;
    SquareFootage?: number;
    Description?: string;
    Address?: BuildiumAddress;
    Images?: BuildiumImage[];
}

export interface BuildiumUnit {
    Id: number;
    PropertyId?: number;
    Name?: string;
    UnitNumber?: string;
    Status?: string;
    IsListed?: boolean;
    MarketRent?: number;
    Rent?: number;
    Bedrooms?: number;
    Bathrooms?: number;
    SquareFootage?: number;
    Description?: string;
    Address?: BuildiumAddress;
    Images?: BuildiumImage[];
}

interface BuildiumListResponse<T> {
    Data?: T[];
    data?: T[];
    Items?: T[];
    items?: T[];
}

function unwrapArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) {
        return value as T[];
    }
    if (value && typeof value === 'object') {
        const wrapped = value as BuildiumListResponse<T>;
        return wrapped.Data ?? wrapped.data ?? wrapped.Items ?? wrapped.items ?? [];
    }
    return [];
}

export class BuildiumClient {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly baseUrl = process.env.BUILDIUM_API_BASE_URL || 'https://api.buildium.com/v1';

    constructor() {
        this.clientId = process.env.BUILDIUM_CLIENT_ID || '';
        this.clientSecret = process.env.BUILDIUM_CLIENT_SECRET || '';

        if (!this.clientId || !this.clientSecret) {
            throw new Error('Missing Buildium credentials. Set BUILDIUM_CLIENT_ID and BUILDIUM_CLIENT_SECRET.');
        }
    }

    private getHeaders() {
        return {
            'Content-Type': 'application/json',
            'x-buildium-client-id': this.clientId,
            'x-buildium-client-secret': this.clientSecret,
        };
    }

    private async request<T>(path: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'GET',
            headers: this.getHeaders(),
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Buildium API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return (await response.json()) as T;
    }

    /**
     * Pulls active + inactive listings so the website can mirror AVAILABLE, RENTED, and UNLISTED states.
     */
    async getAllListings(limit = 100): Promise<BuildiumListing[]> {
        const all: BuildiumListing[] = [];
        let offset = 0;

        for (;;) {
            const payload = await this.request<BuildiumListing[] | BuildiumListResponse<BuildiumListing>>(
                `/listings?limit=${limit}&offset=${offset}&statuses=Active,Inactive`
            );
            const page = unwrapArray<BuildiumListing>(payload);
            all.push(...page);

            if (page.length < limit) {
                break;
            }
            offset += limit;
        }

        return all;
    }

    async getUnit(unitId: number): Promise<BuildiumUnit | null> {
        try {
            const payload = await this.request<BuildiumUnit | { Data?: BuildiumUnit }>(`/units/${unitId}`);
            if (payload && typeof payload === 'object' && 'Data' in payload) {
                return payload.Data ?? null;
            }
            return payload as BuildiumUnit;
        } catch {
            return null;
        }
    }

    async getUnitsByIds(unitIds: number[]): Promise<Map<number, BuildiumUnit>> {
        const uniqueIds = Array.from(new Set(unitIds)).filter((id) => Number.isFinite(id));
        const units = await Promise.all(uniqueIds.map((id) => this.getUnit(id)));

        const map = new Map<number, BuildiumUnit>();
        for (const unit of units) {
            if (unit?.Id) {
                map.set(unit.Id, unit);
            }
        }
        return map;
    }
}
