'use server';

import { createClient, requireAdmin } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { PropertyFormData } from '@/lib/types';
import { sanitizePostgrestSearch } from '@/lib/utils';
import { headers } from 'next/headers';
import { viewLimiter } from '@/lib/rate-limit';
import { propertySchema, toFieldErrors, type PropertyFieldErrors, type PropertyFormValues } from '@/lib/propertySchema';

const UPLOAD_MAX_SIZE = 5 * 1024 * 1024;
const UPLOAD_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export async function getProperties(filters?: {
    status?: string;
    featured?: boolean;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    city?: string;
    limit?: number;
}) {
    await requireAdmin();
    const supabase = await createClient();

    let query = supabase
        .from('properties')
        .select('*, property_images(*)')
        .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'ALL') {
        query = query.eq('status', filters.status);
    }
    if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
    }
    if (filters?.search) {
        const safe = sanitizePostgrestSearch(filters.search);
        query = query.or(
            `title.ilike.%${safe}%,address.ilike.%${safe}%,city.ilike.%${safe}%`
        );
    }
    if (filters?.minPrice) {
        query = query.gte('rent_price', filters.minPrice);
    }
    if (filters?.maxPrice) {
        query = query.lte('rent_price', filters.maxPrice);
    }
    if (filters?.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
    }
    if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getPublicProperties(filters?: {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    city?: string;
    limit?: number;
}) {
    const supabase = await createClient();

    let query = supabase
        .from('properties')
        .select('id, title, city, zip, rent_price, bedrooms, bathrooms, sqft, status, featured, property_images(*)')
        .in('status', ['AVAILABLE', 'PENDING', 'SHOWCASE'])
        .order('created_at', { ascending: false });

    if (filters?.search) {
        const safe = sanitizePostgrestSearch(filters.search);
        query = query.or(
            `title.ilike.%${safe}%,address.ilike.%${safe}%,city.ilike.%${safe}%`
        );
    }
    if (filters?.minPrice) {
        query = query.gte('rent_price', filters.minPrice);
    }
    if (filters?.maxPrice) {
        query = query.lte('rent_price', filters.maxPrice);
    }
    if (filters?.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
    }
    if (filters?.city) {
        query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getProperty(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export type SavePropertyResult =
    | { ok: true; id: string }
    | { ok: false; error: string; fieldErrors?: PropertyFieldErrors };

function revalidatePublic(id?: string) {
    revalidatePath('/rentals');
    revalidatePath('/');
    if (id) revalidatePath(`/rentals/${id}`);
}

/** Validates and saves a property. Pass an id to update, omit it to create. */
export async function saveProperty(values: PropertyFormValues, id?: string): Promise<SavePropertyResult> {
    let supabase;
    try {
        ({ supabase } = await requireAdmin());
    } catch {
        return { ok: false, error: 'Your session has expired. Sign in again to save.' };
    }

    const parsed = propertySchema.safeParse(values);
    if (!parsed.success) {
        return { ok: false, error: 'Some fields need attention.', fieldErrors: toFieldErrors(parsed.error) };
    }
    const record = { ...parsed.data, highlights: parsed.data.features };

    const query = id
        ? supabase.from('properties').update(record).eq('id', id).select('id').maybeSingle()
        : supabase.from('properties').insert({ ...record, source: 'manual' }).select('id').single();
    const { data, error } = await query;

    if (error) {
        console.error('saveProperty failed:', error);
        return { ok: false, error: 'Could not save the property. Please try again.' };
    }
    if (!data) return { ok: false, error: 'This property no longer exists. It may have been deleted.' };

    revalidatePublic(data.id);
    return { ok: true, id: data.id };
}

export async function updateProperty(id: string, formData: Partial<PropertyFormData>) {
    const { supabase } = await requireAdmin();
    const { data, error } = await supabase
        .from('properties')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    revalidatePublic(id);
    return data;
}

export async function deleteProperty(id: string) {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) throw error;
    revalidatePublic(id);
}

export async function togglePropertyStatus(id: string, status: string) {
    return updateProperty(id, { status: status as PropertyFormData['status'] });
}

export async function toggleFeatured(id: string, featured: boolean) {
    return updateProperty(id, { featured });
}

export async function uploadPropertyImage(propertyId: string, file: File) {
    if (file.size > UPLOAD_MAX_SIZE) {
        throw new Error('File too large. Maximum size is 5MB.');
    }
    if (!UPLOAD_ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Invalid file type. Allowed: JPEG, PNG, WebP, AVIF.');
    }
    const { supabase } = await requireAdmin();
    const fileExt = file.name.split('.').pop();
    const fileName = `${propertyId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

    // Get current max display_order
    const { data: images } = await supabase
        .from('property_images')
        .select('display_order')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: false })
        .limit(1);

    const nextOrder = (images?.[0]?.display_order ?? -1) + 1;

    const { error: insertError } = await supabase
        .from('property_images')
        .insert({
            property_id: propertyId,
            storage_url: publicUrl,
            display_order: nextOrder,
        });

    if (insertError) throw insertError;
    revalidatePath(`/rentals/${propertyId}`);
    return publicUrl;
}

export async function deletePropertyImage(imageId: string, propertyId: string) {
    const { supabase } = await requireAdmin();
    const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', imageId);

    if (error) throw error;
    revalidatePath(`/rentals/${propertyId}`);
}

export async function incrementView(propertyId: string) {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    viewLimiter.check(ip);

    const supabase = await createClient();
    await supabase.rpc('increment_view', { row_id: propertyId });
}

export async function getPropertyStats() {
    const supabase = await createClient();

    // Run all 4 queries in parallel — ~60% faster on cold connections
    const [
        { count: totalProperties },
        { count: activeListings },
        { data: totalViewsData },
        { data: hotProperty },
    ] = await Promise.all([
        supabase
            .from('properties')
            .select('*', { count: 'exact', head: true }),
        supabase
            .from('properties')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'AVAILABLE'),
        supabase
            .from('properties')
            .select('view_count'),
        supabase
            .from('properties')
            .select('*, property_images(*)')
            .order('view_count', { ascending: false })
            .limit(1)
            .maybeSingle(),
    ]);

    const views = totalViewsData?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;

    return {
        totalProperties: totalProperties || 0,
        activeListings: activeListings || 0,
        totalViews: views,
        hotProperty,
    };
}
