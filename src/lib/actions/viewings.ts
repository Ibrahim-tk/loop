'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { createClient, requireAdmin } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { BOOKABLE_STATUSES, getDateProblem, getSlotsForDate } from '@/lib/viewings';

const viewingSchema = z.object({
    propertyId: z.string().uuid('Unknown property'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date'),
    slot: z.string().regex(/^\d{2}:\d{2}$/, 'Choose a time'),
    name: z.string().trim().min(2, 'Enter your full name').max(100),
    email: z.string().trim().email('Enter a valid email address').max(100),
    phone: z
        .string()
        .trim()
        .max(20)
        .refine((v) => v === '' || /^[+()\d\s-]{7,20}$/.test(v), 'Enter a valid phone number'),
    notes: z.string().trim().max(1000).optional().default(''),
});

export type ViewingRequestInput = z.input<typeof viewingSchema>;

export type ViewingRequestResult =
    | { ok: true; reference: string }
    | { ok: false; error: string; field?: keyof ViewingRequestInput; slotTaken?: boolean };

const viewingLimiter = rateLimit({ name: 'viewings', maxRequests: 10, windowMs: 60_000 });

const strip = (v: string) => v.replace(/[<>]/g, '');

export async function requestViewing(input: ViewingRequestInput): Promise<ViewingRequestResult> {
    const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    try {
        viewingLimiter.check(ip);
    } catch {
        return { ok: false, error: 'Too many requests. Please wait a minute and try again.' };
    }

    const parsed = viewingSchema.safeParse(input);
    if (!parsed.success) {
        const issue = parsed.error.issues[0];
        return { ok: false, error: issue.message, field: issue.path[0] as keyof ViewingRequestInput };
    }
    const v = parsed.data;

    const dateProblem = getDateProblem(v.date);
    if (dateProblem) return { ok: false, error: dateProblem, field: 'date' };
    if (!getSlotsForDate(v.date).includes(v.slot)) {
        return { ok: false, error: 'That time is not offered on this day.', field: 'slot' };
    }

    const supabase = await createClient();

    const { data: property } = await supabase.from('properties').select('id, status').eq('id', v.propertyId).maybeSingle();
    if (!property) return { ok: false, error: 'This property is no longer listed.' };
    if (!BOOKABLE_STATUSES.includes(property.status)) {
        return { ok: false, error: 'This property is no longer available for viewings.' };
    }

    // Visitors can insert but not read viewings, so generate the id here for the confirmation
    const id = crypto.randomUUID();
    const { error } = await supabase.from('viewings').insert({
        id,
        property_id: v.propertyId,
        viewing_date: v.date,
        time_slot: v.slot,
        name: strip(v.name),
        email: strip(v.email),
        phone: strip(v.phone),
        notes: strip(v.notes),
    });

    if (error) {
        if (error.code === '23505') {
            return { ok: false, error: 'Sorry, someone just booked that time. Please pick another slot.', field: 'slot', slotTaken: true };
        }
        console.error('Failed to create viewing:', error);
        return { ok: false, error: 'We couldn’t save your request. Please try again.' };
    }

    return { ok: true, reference: id.slice(0, 8).toUpperCase() };
}

const VIEWING_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;

/** Admin: confirm, cancel or complete a viewing. */
export async function updateViewingStatus(id: string, status: (typeof VIEWING_STATUSES)[number]): Promise<{ ok: boolean; error?: string }> {
    if (!VIEWING_STATUSES.includes(status)) return { ok: false, error: 'Unknown status' };
    let supabase;
    try {
        ({ supabase } = await requireAdmin());
    } catch {
        return { ok: false, error: 'Your session has expired. Sign in again.' };
    }

    const { data, error } = await supabase.from('viewings').update({ status }).eq('id', id).select('id').maybeSingle();
    if (error) {
        // Re-opening a cancelled viewing can clash with a newer booking for the same slot
        if (error.code === '23505') return { ok: false, error: 'That slot has since been booked by someone else.' };
        return { ok: false, error: 'Could not update the viewing.' };
    }
    if (!data) return { ok: false, error: 'This viewing no longer exists.' };
    return { ok: true };
}
