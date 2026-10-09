import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Property } from '@/lib/types';
import PropertyDetailClient from './PropertyDetailClient';
import type { Metadata } from 'next';

// Always fresh, so admin edits and deletions show up immediately
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string }>;
}

const getPropertyById = cache(async (id: string) => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('id', id)
        .single();

    if (error) return null;
    return data as Property;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) return { title: 'Property Not Found' };

    return {
        title: `${property.title} | ${property.city}`,
        description:
            property.description ||
            `${property.title} in ${property.city} — $${property.rent_price?.toLocaleString()}${property.listing_type === 'RENT' ? '/month' : ''}. Professionally managed by Blue Pillar Management.`,
    };
}

export default async function PropertyDetailPage({ params }: Props) {
    const { id } = await params;

    const [property, { data: similar }] = await Promise.all([
        getPropertyById(id),
        createPublicClient()
            .from('properties')
            .select('*, property_images(*)')
            .neq('id', id)
            .in('status', ['AVAILABLE', 'PENDING'])
            .limit(5),
    ]);

    if (!property) notFound();

    return (
        <PropertyDetailClient
            property={property as Property}
            similarProperties={(similar as Property[]) || []}
        />
    );
}
