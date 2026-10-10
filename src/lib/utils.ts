import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { usePrefs, type AreaUnit, type Currency } from '@/lib/store';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

const trim = (n: number) => n.toFixed(2).replace(/\.?0+$/, '');

/** Indicative PKR per unit of foreign currency. */
export const PKR_RATES: Record<Exclude<Currency, 'PKR'>, number> = { USD: 280, AED: 76.3, GBP: 375, SAR: 74.7 };

/**
 * Prices are stored in PKR. PKR shows in local units (4.5 Crore, 35 Lakh, 85,000);
 * other currencies convert at PKR_RATES and show compact ($339K, AED 1.2M).
 * Defaults to the visitor's chosen currency.
 */
export function formatPrice(price: number, currency: Currency = usePrefs.getState().currency): string {
    if (currency === 'PKR') {
        if (price >= 1e7) return `PKR ${trim(price / 1e7)} Crore`;
        if (price >= 1e5) return `PKR ${trim(price / 1e5)} Lakh`;
        return `PKR ${Math.round(price).toLocaleString('en-PK')}`;
    }
    const value = price / PKR_RATES[currency];
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        notation: value >= 10000 ? 'compact' : 'standard',
        maximumFractionDigits: value >= 10000 ? 2 : 0,
    }).format(value);
}

export const SQFT_PER_MARLA = 225;
export const SQFT_PER_KANAL = 4500;

/** Area is stored in sq ft; shown in the visitor's chosen unit. */
export function formatAreaUnit(sqft: number, unit: AreaUnit = usePrefs.getState().areaUnit): string {
    if (unit === 'MARLA') return `${trim(sqft / SQFT_PER_MARLA)} Marla`;
    if (unit === 'KANAL') return `${trim(sqft / SQFT_PER_KANAL)} Kanal`;
    return `${Math.round(sqft).toLocaleString()} sq ft`;
}

export function formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        AVAILABLE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        RENTED: 'bg-red-500/20 text-red-400 border-red-500/30',
        SOLD: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        SHOWCASE: 'bg-accent-500/20 text-accent-400 border-accent-500/30',
        RENOVATION: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        UNDER_MANAGEMENT: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
        COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        IN_PROGRESS: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

export function getStatusColorLight(status: string): string {
    const colors: Record<string, string> = {
        AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
        RENTED: 'bg-red-50 text-red-700 border-red-200',
        SOLD: 'bg-purple-50 text-purple-700 border-purple-200',
        SHOWCASE: 'bg-blue-50 text-blue-700 border-blue-200',
        RENOVATION: 'bg-orange-50 text-orange-700 border-orange-200',
        UNDER_MANAGEMENT: 'bg-sky-50 text-sky-700 border-sky-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

export function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function sanitizePostgrestSearch(input: string): string {
    return input
        .replace(/\\/g, '\\\\')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_')
        .replace(/,/g, '')
        .replace(/\(/g, '')
        .replace(/\)/g, '');
}
