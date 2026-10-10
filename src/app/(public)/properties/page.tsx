import { createPublicClient } from '@/lib/supabase/server';
import PropertiesClient from './PropertiesClient';
import { Property } from '@/lib/types';
import { PUBLIC_STATUSES } from '@/lib/properties';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Properties',
    description: 'Search homes for sale and rent. Filter by location, price, size, amenities and more.',
};

// Always fresh, so admin edits show up on the next page load
export const dynamic = 'force-dynamic';

export default async function PropertiesPage() {
    const supabase = createPublicClient();

    // The catalogue is small (tens of listings), so load it once and filter in the browser
    const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .in('status', PUBLIC_STATUSES)
        .order('display_order', { referencedTable: 'property_images', ascending: true });

    return (
        <Suspense fallback={null}>
            <PropertiesClient properties={(data as Property[]) || []} loadError={Boolean(error)} />
        </Suspense>
    );
}
