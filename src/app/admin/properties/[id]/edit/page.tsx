import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import PropertyForm from '@/components/admin/PropertyForm';
import type { PropertyFormValues } from '@/lib/propertySchema';
import type { Property, PropertyImage } from '@/lib/types';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

const str = (v: unknown) => (v === null || v === undefined ? '' : String(v));

function toFormValues(p: Property): PropertyFormValues {
    return {
        title: p.title,
        listing_type: p.listing_type,
        property_type: p.property_type,
        status: p.status,
        featured: p.featured,
        address: p.address,
        city: p.city,
        zip: str(p.zip),
        rent_price: str(p.rent_price),
        sqft: str(p.sqft),
        bedrooms: str(p.bedrooms),
        bathrooms: str(p.bathrooms),
        garage: str(p.garage ?? 0),
        year_built: str(p.year_built),
        furnishing: p.furnishing,
        description: p.description ?? '',
        amenities: p.amenities ?? [],
        features: p.features?.length ? p.features : p.highlights ?? [],
        agent_name: str(p.agent_name),
        agent_phone: str(p.agent_phone),
        agent_email: str(p.agent_email),
        agent_photo_url: str(p.agent_photo_url),
        google_maps_url: str(p.google_maps_url),
        zillow_url: str(p.zillow_url),
    };
}

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data } = await supabase.from('properties').select('*, property_images(*)').eq('id', id).maybeSingle();

    if (!data) {
        return (
            <div className="max-w-xl mx-auto text-center py-20 space-y-3">
                <h1 className="text-2xl font-bold">Property not found</h1>
                <p className="text-muted-foreground">It may have been deleted. Nothing was changed.</p>
                <Button asChild>
                    <Link href="/admin/properties">Back to properties</Link>
                </Button>
            </div>
        );
    }

    const property = data as Property;
    const images = [...(property.property_images ?? [])]
        .sort((a: PropertyImage, b: PropertyImage) => a.display_order - b.display_order)
        .map((img) => ({ id: img.id, url: img.storage_url }));

    return <PropertyForm mode="edit" propertyId={property.id} initialValues={toFormValues(property)} initialImages={images} />;
}
