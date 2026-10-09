'use client';

import imageCompression from 'browser-image-compression';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ImageItem } from '@/components/admin/ImageUploader';

export interface ImageSyncResult {
    saved: number;
    failed: number;
    bucketMissing: boolean;
}

/**
 * Makes the property's images match `images` (in order):
 * deletes removed rows, uploads new files (compressed to WebP), stores pasted links,
 * and rewrites display_order.
 */
export async function syncPropertyImages(
    supabase: SupabaseClient,
    propertyId: string,
    images: ImageItem[],
    deletedIds: string[],
    onProgress?: (message: string) => void
): Promise<ImageSyncResult> {
    const result: ImageSyncResult = { saved: 0, failed: 0, bucketMissing: false };

    if (deletedIds.length) {
        onProgress?.('Removing images…');
        const { error } = await supabase.from('property_images').delete().in('id', deletedIds);
        if (error) result.failed += deletedIds.length;
    }

    for (let i = 0; i < images.length; i++) {
        const img = images[i];

        // Existing row: just keep the order in sync
        if (img.id) {
            await supabase.from('property_images').update({ display_order: i }).eq('id', img.id);
            continue;
        }

        let url = img.url;

        if (img.file) {
            if (result.bucketMissing) {
                result.failed++;
                continue;
            }
            onProgress?.(`Uploading image ${i + 1} of ${images.length}…`);
            let file: File = img.file;
            try {
                file = (await imageCompression(img.file, {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: 'image/webp',
                    initialQuality: 0.9,
                    alwaysKeepResolution: true,
                })) as File;
            } catch {
                // Fall back to the original file
            }

            const path = `${propertyId}/${Date.now()}-${i}.webp`;
            const { error: uploadError } = await supabase.storage
                .from('property-images')
                .upload(path, file, { cacheControl: '3600', upsert: false, contentType: 'image/webp' });

            if (uploadError) {
                result.failed++;
                if (uploadError.message.includes('Bucket not found')) result.bucketMissing = true;
                continue;
            }
            url = supabase.storage.from('property-images').getPublicUrl(path).data.publicUrl;
        }

        const { error: insertError } = await supabase
            .from('property_images')
            .insert({ property_id: propertyId, storage_url: url, display_order: i });
        if (insertError) result.failed++;
        else result.saved++;
    }

    return result;
}
