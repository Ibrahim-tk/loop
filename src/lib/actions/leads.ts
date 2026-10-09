'use server';

import { createClient } from '@/lib/supabase/server';
import { LeadFormData } from '@/lib/types';
import { buildLeadNotificationHtml } from '@/lib/email/lead-notification';
import { getInquiryOption } from '@/lib/constants/inquiry-options';
import { headers } from 'next/headers';
import { leadLimiter } from '@/lib/rate-limit';
import { z } from 'zod';

const leadSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().email("Valid email is required").max(100),
    phone: z.string().max(20).optional().default(''),
    type: z.string().min(1, "Type is required"),
    helpType: z.string().min(1, "Help topic is required").max(100),
    message: z.string().min(1, "Message is required").max(5000),
});

function sanitizeHtml(input: string | undefined): string {
    if (!input) return '';
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

export async function submitLead(formData: LeadFormData) {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    leadLimiter.check(ip);

    // 1. Zod Validation & Basic XSS Sanitization
    const validatedData = leadSchema.parse({
        name: sanitizeHtml(formData.name),
        email: sanitizeHtml(formData.email),
        phone: sanitizeHtml(formData.phone),
        type: sanitizeHtml(formData.type),
        helpType: sanitizeHtml(formData.helpType),
        message: sanitizeHtml(formData.message),
    });

    const supabase = await createClient();

    // Don't persist helpType to the database — it's only used for the email
    const { helpType, ...dbData } = validatedData;

    const { data, error } = await supabase
        .from('leads')
        .insert([dbData])
        .select()
        .single();

    if (error) throw error;

    // Try to send email notification (non-blocking)
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey && apiKey !== 'your_resend_api_key_here') {
            const { Resend } = await import('resend');
            const resend = new Resend(apiKey);

            const { count } = await supabase
                .from('leads')
                .select('*', { count: 'exact', head: true });
            
            const leadNumber = String(count || 1).padStart(5, '0');

            const option = getInquiryOption(helpType || '');
            const html = buildLeadNotificationHtml({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                helpType: helpType || '',
                message: formData.message,
            });

            const fromAddress = process.env.RESEND_FROM_EMAIL || '';
            const toAddresses = (process.env.RESEND_TO_EMAIL || '')
                .split(',')
                .map((addr) => addr.trim())
                .filter(Boolean);

            const { data: emailData, error: emailError } = await resend.emails.send({
                from: fromAddress,
                to: toAddresses,
                // UX-Optimized Subject Line (e.g. "#00015 Renovation Services - John Doe")
                subject: `[#${leadNumber}] ${option.label} - ${validatedData.name}`,
                html,
            });

            if (emailError) {
                console.error("Resend API returned an error:", emailError);
            } else {
                console.log("Email successfully sent:", emailData);
            }
        }
    } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
    }

    return data;
}

export async function getLeads(filters?: {
    type?: string;
    limit?: number;
}) {
    const supabase = await createClient();

    let query = supabase
        .from('leads')
        .select('*, property:properties(id, title, address)')
        .order('created_at', { ascending: false });

    if (filters?.type && filters.type !== 'ALL') {
        query = query.eq('type', filters.type);
    }
    if (filters?.limit) {
        query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getLeadStats() {
    const supabase = await createClient();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count: totalLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

    const { count: leadsThisMonth } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth);

    return {
        totalLeads: totalLeads || 0,
        leadsThisMonth: leadsThisMonth || 0,
    };
}

export async function deleteLead(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) throw error;
    return true;
}
