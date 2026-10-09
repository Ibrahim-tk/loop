import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { BuildiumClient } from '@/lib/buildium/client';
import { PropertyStatus } from '@/lib/types';

// Allow route to run longer on Vercel (up to 5 mins if pro, otherwise limits apply)
export const maxDuration = 300; 

export async function POST(request: Request) {
    try {
        // 1. Authorization strictly guards this route
        const authHeader = request.headers.get('authorization');
        // Vercel Cron automatically injects Authorization: Bearer <CRON_SECRET> if set in Environment Variables
        const isAuthorized = authHeader === `Bearer ${process.env.CRON_SECRET}`;

        if (!isAuthorized) {
            // For local manual triggering without a script, 
            // you can pass ?secret=CRON_SECRET in the URL params as a fallback strategy during dev
            const url = new URL(request.url);
            if (url.searchParams.get('secret') !== process.env.CRON_SECRET) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const buildium = new BuildiumClient();
        const listings = await buildium.getAllListings();
        
        const supabase = createAdminClient();

        // Fetch currently tracked Buildium properties to compute diff
        const { data: existingBuildiumProps } = await supabase
            .from('properties')
            .select('id, buildium_id, status')
            .eq('source', 'buildium');

        const activeBuildiumIds = new Set<string>();
        let upsertedCount = 0;

        for (const listing of listings) {
            const buildiumId = String(listing.Id);
            activeBuildiumIds.add(buildiumId);

            // Determine listing status based on Buildium logic
            let propertyStatus: PropertyStatus = 'AVAILABLE';
            
            if (listing.Status === 'Inactive' || listing.Status === 'Rented') {
                propertyStatus = 'RENTED'; // Map to rented as specified by user requirements
            } else if (listing.Status === 'Unlisted') {
                propertyStatus = 'UNLISTED';
            }

            const propertyData = {
                title: listing.Address?.AddressLine1 || `Property ${buildiumId}`,
                address: listing.Address?.AddressLine1 || '',
                city: listing.Address?.City || '',
                zip: listing.Address?.Zip || '',
                rent_price: listing.Price || 0,
                bedrooms: listing.Bedrooms || 0,
                bathrooms: listing.Bathrooms || 0,
                sqft: listing.Area || 0,
                status: propertyStatus,
                description: listing.Description || '',
                buildium_id: buildiumId,
                source: 'buildium',
            };

            // Using onConflict to Upsert using the buildium_id UNIQUE constraint
            const { data: savedProperty, error: upsertError } = await supabase
                .from('properties')
                .upsert(propertyData, { onConflict: 'buildium_id' })
                .select('id')
                .single();

            if (upsertError) {
                console.error(`Error upserting property ${buildiumId}`, upsertError);
                continue;
            }

            // Sync images using the Buildium URL perfectly without duplicating or downloading files
            if (savedProperty && listing.Images && listing.Images.length > 0) {
                // Delete old images linked to this property
                await supabase.from('property_images').delete().eq('property_id', savedProperty.id);
                
                // Insert the new image array straight from the Buildium payload
                const imageInserts = listing.Images.map((img, idx) => ({
                    property_id: savedProperty.id,
                    storage_url: img.Url,
                    display_order: img.Position || idx,
                }));
                
                await supabase.from('property_images').insert(imageInserts);
            }
            upsertedCount++;
        }

        // Process Unlisted handling
        let unlistedCount = 0;
        if (existingBuildiumProps) {
            for (const existing of existingBuildiumProps) {
                // If it exists in our DB but vanished from Buildium response altogether, map it to UNLISTED
                if (existing.buildium_id && !activeBuildiumIds.has(existing.buildium_id)) {
                    if (existing.status !== 'UNLISTED') {
                        await supabase
                            .from('properties')
                            .update({ status: 'UNLISTED' })
                            .eq('id', existing.id);
                        unlistedCount++;
                    }
                }
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Synchronization complete. Updated ${upsertedCount} Buildium properties. Flagged ${unlistedCount} obsolete properties as UNLISTED.` 
        });

    } catch (err: any) {
        console.error('Buildium Sync Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}