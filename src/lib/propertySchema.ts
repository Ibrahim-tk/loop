import { z } from 'zod';

/** Hosts next/image is configured for (see next.config.mjs). Image URLs must use one of these. */
export const ALLOWED_IMAGE_HOSTS = ['images.unsplash.com', '.supabase.co', '.amazonaws.com'];

export const isAllowedImageUrl = (value: string) => {
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && ALLOWED_IMAGE_HOSTS.some((h) => (h.startsWith('.') ? url.hostname.endsWith(h) : url.hostname === h));
    } catch {
        return false;
    }
};

const currentYear = new Date().getFullYear();

const int = (label: string, min: number, max: number) =>
    z.coerce
        .number({ invalid_type_error: `${label} must be a number` })
        .int(`${label} must be a whole number`)
        .min(min, `${label} can't be less than ${min}`)
        .max(max, `${label} can't be more than ${max.toLocaleString()}`);

const optionalUrl = z
    .string()
    .trim()
    .max(2000)
    .refine((v) => v === '' || /^https?:\/\/\S+$/.test(v), 'Enter a full URL starting with https://')
    .transform((v) => v || null);

/**
 * Admin property form. Inputs arrive as strings from the form;
 * the parsed output is ready to write to the `properties` table.
 */
export const propertySchema = z.object({
    title: z.string().trim().min(3, 'Title needs at least 3 characters').max(120, 'Keep the title under 120 characters'),
    listing_type: z.enum(['RENT', 'SALE'], { errorMap: () => ({ message: 'Choose rent or sale' }) }),
    property_type: z.enum(['HOUSE', 'APARTMENT', 'VILLA', 'TOWNHOUSE', 'PENTHOUSE', 'STUDIO', 'PLOT', 'COMMERCIAL'], {
        errorMap: () => ({ message: 'Choose a property type' }),
    }),
    status: z.enum(['AVAILABLE', 'PENDING', 'RENTED', 'SOLD', 'SHOWCASE', 'RENOVATION', 'UNDER_MANAGEMENT', 'UNLISTED'], {
        errorMap: () => ({ message: 'Choose a status' }),
    }),
    featured: z.boolean(),

    address: z.string().trim().min(3, 'Address is required').max(200),
    city: z.string().trim().min(2, 'City is required').max(80),
    zip: z.string().trim().max(12, 'Zip code is too long'),

    rent_price: z.coerce
        .number({ invalid_type_error: 'Price must be a number' })
        .positive('Price must be more than 0')
        .max(999_999_999, 'Price is too high'),
    sqft: int('Area', 1, 1_000_000),
    bedrooms: int('Bedrooms', 0, 50),
    bathrooms: int('Bathrooms', 0, 50),
    garage: int('Parking', 0, 50),
    year_built: z
        .string()
        .trim()
        .transform((v, ctx) => {
            if (v === '') return null;
            const n = Number(v);
            if (!Number.isInteger(n) || n < 1800 || n > currentYear + 3) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Year built must be between 1800 and ${currentYear + 3}` });
                return z.NEVER;
            }
            return n;
        }),
    furnishing: z.enum(['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'], { errorMap: () => ({ message: 'Choose a furnishing option' }) }),

    description: z.string().trim().min(20, 'Write at least 20 characters so buyers know what makes it special').max(5000),
    amenities: z.array(z.string().trim().min(1).max(40)).max(30),
    features: z.array(z.string().trim().min(1).max(80)).max(20),

    /** Admin toggle; not stored. When off, the agent fields are cleared on save. */
    has_agent: z.boolean(),
    agent_name: z.string().trim().max(100),
    agent_phone: z
        .string()
        .trim()
        .max(25)
        .refine((v) => v === '' || /^[+()\d\s.-]{7,25}$/.test(v), 'Enter a valid phone number'),
    agent_email: z
        .string()
        .trim()
        .max(100)
        .refine((v) => v === '' || z.string().email().safeParse(v).success, 'Enter a valid email address'),
    agent_photo_url: z
        .string()
        .trim()
        .refine((v) => v === '' || isAllowedImageUrl(v), 'Use an https image link from Unsplash or your Supabase storage'),

    google_maps_url: optionalUrl,
    zillow_url: optionalUrl,
}).superRefine((v, ctx) => {
    if (!v.has_agent) return;
    const required: [keyof typeof v, string][] = [
        ['agent_name', 'Agent name is required'],
        ['agent_phone', 'Agent phone is required'],
        ['agent_email', 'Agent email is required'],
    ];
    for (const [key, message] of required) {
        if (!v[key]) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message });
    }
});

/** Raw form state: every input is a string; parsing turns it into a PropertyRecord. */
export type PropertyFormValues = {
    [K in keyof z.input<typeof propertySchema>]: z.input<typeof propertySchema>[K] extends boolean
        ? boolean
        : z.input<typeof propertySchema>[K] extends string[]
            ? string[]
            : string;
};
export type PropertyRecord = z.output<typeof propertySchema>;
export type PropertyFieldErrors = Partial<Record<keyof PropertyFormValues, string>>;

export const EMPTY_PROPERTY_FORM: PropertyFormValues = {
    title: '',
    listing_type: 'SALE',
    property_type: 'HOUSE',
    status: 'AVAILABLE',
    featured: false,
    address: '',
    city: '',
    zip: '',
    rent_price: '',
    sqft: '',
    bedrooms: '',
    bathrooms: '',
    garage: '0',
    year_built: '',
    furnishing: 'UNFURNISHED',
    description: '',
    amenities: [],
    features: [],
    has_agent: false,
    agent_name: '',
    agent_phone: '',
    agent_email: '',
    agent_photo_url: '',
    google_maps_url: '',
    zillow_url: '',
};

/** First message per field, for showing under inputs. */
export function toFieldErrors(error: z.ZodError): PropertyFieldErrors {
    const out: PropertyFieldErrors = {};
    for (const issue of error.issues) {
        const key = issue.path[0] as keyof PropertyFormValues;
        if (key && !out[key]) out[key] = issue.message;
    }
    return out;
}
