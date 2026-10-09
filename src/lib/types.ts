// ============================================
// Fasana Homes — TypeScript Types
// ============================================

export type PropertyStatus = 'AVAILABLE' | 'PENDING' | 'RENTED' | 'SOLD' | 'SHOWCASE' | 'RENOVATION' | 'UNDER_MANAGEMENT' | 'UNLISTED';

export type LeadType = 'OWNER' | 'TENANT' | 'RENOVATION' | 'MAINTENANCE' | 'GENERAL' | 'ANALYSIS';

export type PropertyType = 'HOUSE' | 'APARTMENT' | 'VILLA' | 'TOWNHOUSE' | 'PENTHOUSE' | 'STUDIO' | 'PLOT' | 'COMMERCIAL';

export type ListingType = 'RENT' | 'SALE';

export type Furnishing = 'FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED';

export type ViewingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export type MaintenanceStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Property {
    id: string;
    title: string;
    address: string;
    city: string;
    zip: string;
    /** Listing price: monthly rent when listing_type is RENT, total price when SALE. */
    rent_price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    /** Parking spaces. */
    garage?: number;
    year_built?: number;
    status: PropertyStatus;
    description: string;
    featured: boolean;
    google_maps_url?: string;
    zillow_url?: string;
    highlights?: string[];
    view_count: number;
    click_count: number;
    created_at: string;
    updated_at: string;
    property_images?: PropertyImage[];
    source?: 'manual' | 'demo';
    property_type: PropertyType;
    listing_type: ListingType;
    furnishing: Furnishing;
    amenities: string[];
    features: string[];
    agent_name?: string;
    agent_phone?: string;
    agent_email?: string;
    agent_photo_url?: string;
}

export interface Viewing {
    id: string;
    property_id: string;
    viewing_date: string;
    time_slot: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
    status: ViewingStatus;
    created_at: string;
    property?: Property;
}

export interface PropertyImage {
    id: string;
    property_id: string;
    storage_url: string;
    display_order: number;
}

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: LeadType;
    property_id?: string;
    message: string;
    created_at: string;
    property?: Property;
}

export interface MaintenanceOrder {
    id: string;
    property_id: string;
    title: string;
    description: string;
    assignee_name: string;
    due_date: string;
    status: MaintenanceStatus;
    created_at: string;
    property?: Property;
}

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    role: 'admin';
}

// Form types
export interface PropertyFormData {
    title: string;
    address: string;
    city: string;
    zip: string;
    rent_price: number;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    garage?: number;
    year_built?: number;
    status: PropertyStatus;
    description: string;
    featured: boolean;
    google_maps_url?: string;
    zillow_url?: string;
    highlights?: string[];
}

export interface LeadFormData {
    name: string;
    email: string;
    phone: string;
    type: LeadType;
    helpType?: string;
    property_id?: string;
    message: string;
}

export interface MaintenanceFormData {
    property_id: string;
    title: string;
    description: string;
    assignee_name: string;
    due_date: string;
}
