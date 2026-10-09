import type { PropertyStatus } from '@/lib/types';

/**
 * Mock agent availability. Weekday index follows Date#getDay (0 = Sunday).
 * Shared by the booking UI and the server action, so both agree on what's bookable.
 */
const WEEKLY_SLOTS: Record<number, string[]> = {
    0: [],
    1: ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
    2: ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
    3: ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
    4: ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    5: ['10:00', '11:00', '13:00', '14:00', '15:00'],
    6: ['10:00', '11:00', '12:00'],
};

/** Bookings open from tomorrow up to this many days ahead. */
export const BOOKING_WINDOW_DAYS = 21;

/** Only listings still on the market can be viewed. */
export const BOOKABLE_STATUSES: PropertyStatus[] = ['AVAILABLE', 'PENDING', 'SHOWCASE'];

/** Local calendar date as YYYY-MM-DD. */
export function toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return toDateKey(date) === key ? date : null;
}

/** Every date in the booking window, closed days included (the UI shows them disabled). */
export function getBookingDates(today = new Date()): Date[] {
    return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i + 1);
        return d;
    });
}

export function getSlotsForDate(key: string): string[] {
    const date = fromDateKey(key);
    return date ? WEEKLY_SLOTS[date.getDay()] ?? [] : [];
}

/** Why a date can't be booked, or null if it can. */
export function getDateProblem(key: string, today = new Date()): string | null {
    const date = fromDateKey(key);
    if (!date) return 'Choose a valid date.';
    const first = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const last = new Date(today.getFullYear(), today.getMonth(), today.getDate() + BOOKING_WINDOW_DAYS);
    if (date < first) return 'Viewings can be booked from tomorrow onwards.';
    if (date > last) return `Viewings can be booked up to ${BOOKING_WINDOW_DAYS} days ahead.`;
    if (getSlotsForDate(key).length === 0) return 'Agents are not available on this day.';
    return null;
}

/** "14:00" → "2:00 PM" */
export function formatSlot(slot: string): string {
    const [h, m] = slot.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatViewingDate(key: string, style: 'long' | 'short' = 'long'): string {
    const date = fromDateKey(key);
    if (!date) return key;
    return date.toLocaleDateString('en-US', style === 'long'
        ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
        : { weekday: 'short', month: 'short', day: 'numeric' });
}
