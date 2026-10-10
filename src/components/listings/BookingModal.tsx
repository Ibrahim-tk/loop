'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, CalendarBlank, CaretLeft, CaretRight, Clock, Globe, MapPin, SpinnerGap, WarningCircle } from '@phosphor-icons/react';
import Modal from '@/components/ui/Modal';
import Icon3D from '@/components/ui/Icon3D';
import { createClient } from '@/lib/supabase/client';
import { requestViewing } from '@/lib/actions/viewings';
import { formatSlot, formatViewingDate, getDateProblem, getSlotsForDate, toDateKey } from '@/lib/viewings';
import { cn } from '@/lib/utils';
import type { Property } from '@/lib/types';

type Step = 'pick' | 'details' | 'done';
interface Details { name: string; email: string; phone: string; notes: string }
const EMPTY: Details = { name: '', email: '', phone: '', notes: '' };
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Monday-first grid of a month, padded with nulls. */
function monthGrid(year: number, month: number) {
    const first = new Date(year, month, 1);
    const lead = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    return [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(year, month, i + 1))] as (Date | null)[];
}

const inputClass =
    'w-full h-11 px-3 rounded-[8px] border border-[var(--outline-default)] bg-white outline-none focus:border-[var(--action-primary-hover)] aria-[invalid=true]:border-[var(--border-danger)]';

/**
 * Calendly-style viewing booking: event summary on the left, month calendar in the middle,
 * time slots on the right; then a details step. Slots come from the seeded weekly schedule
 * in lib/viewings and taken slots from the `get_booked_slots` RPC; requests save via requestViewing.
 */
export default function BookingModal({
    open,
    onOpenChange,
    property,
}: {
    open: boolean;
    onOpenChange: (o: boolean) => void;
    property: Pick<Property, 'id' | 'title' | 'address' | 'city' | 'property_images'>;
}) {
    const today = useMemo(() => new Date(), []);
    const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
    const [step, setStep] = useState<Step>('pick');
    const [date, setDate] = useState('');
    const [slot, setSlot] = useState('');
    const [booked, setBooked] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [details, setDetails] = useState<Details>(EMPTY);
    const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [reference, setReference] = useState('');

    const cover = [...(property.property_images ?? [])].sort((a, b) => a.display_order - b.display_order)[0]?.storage_url;
    const slots = date ? getSlotsForDate(date) : [];

    // Reset when reopened after a finished booking
    useEffect(() => {
        if (open && step === 'done') {
            setStep('pick'); setDate(''); setSlot(''); setDetails(EMPTY); setReference('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        if (!date) return;
        let cancelled = false;
        setLoadingSlots(true);
        createClient()
            .rpc('get_booked_slots', { p_property_id: property.id, p_date: date })
            .then(({ data }) => {
                if (cancelled) return;
                setBooked(((data as string[] | null) ?? []).map(String));
                setLoadingSlots(false);
            });
        return () => { cancelled = true; };
    }, [date, property.id]);

    const grid = monthGrid(view.y, view.m);
    const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const atCurrentMonth = view.y === today.getFullYear() && view.m === today.getMonth();
    const shiftMonth = (d: number) => setView(({ y, m }) => { const n = new Date(y, m + d, 1); return { y: n.getFullYear(), m: n.getMonth() }; });

    const validate = () => {
        const e: typeof errors = {};
        if (details.name.trim().length < 2) e.name = 'Enter your full name.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) e.email = 'Enter a valid email.';
        if (details.phone.trim() && !/^[+()\d\s-]{7,20}$/.test(details.phone.trim())) e.phone = 'Enter a valid phone number.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const submit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        setSubmitError('');
        const result = await requestViewing({ propertyId: property.id, date, slot, ...details });
        setSubmitting(false);
        if (result.ok) { setReference(result.reference); setStep('done'); return; }
        setSubmitError(result.error);
        if (result.slotTaken) { setBooked((b) => [...b, slot]); setSlot(''); setStep('pick'); }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange} size="xl" title="Book a viewing" className="[&>div:last-child]:p-0">
            {step === 'done' ? (
                <div className="blur-rise flex flex-col items-center text-center gap-3 px-6 py-14 border-t border-[var(--outline-default)]" role="status">
                    <Icon3D name="check" size={104} className="mb-2" />
                    <h3 className="text-[length:var(--typeface-heading-h4)]">You&apos;re scheduled</h3>
                    <p className="text-[color:var(--text-secondary)] max-w-[420px]">
                        {property.title} · {formatViewingDate(date)} at {formatSlot(slot)}. We&apos;ll confirm by email at {details.email}.
                    </p>
                    <p className="text-[length:var(--typeface-paragraph-text-s)]">Reference <span className="font-medium">#{reference}</span></p>
                    <button type="button" onClick={() => onOpenChange(false)} className="btn-primary mt-3">Done</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] border-t border-[var(--outline-default)] min-h-[520px]">
                    {/* Event summary */}
                    <aside className="flex flex-col gap-4 p-6 border-b md:border-b-0 md:border-r border-[var(--outline-default)]">
                        {step === 'details' && (
                            <button type="button" onClick={() => setStep('pick')} aria-label="Back to calendar"
                                className="self-start flex items-center justify-center size-10 rounded-full ring-1 ring-[var(--outline-default)] text-[color:var(--action-primary-hover)] hover:bg-[var(--bg-gray-block)]">
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        {cover && (
                            <div className="relative h-[120px] rounded-[10px] overflow-hidden">
                                <Image src={cover} alt="" fill sizes="280px" className="object-cover" />
                            </div>
                        )}
                        <div>
                            <p className="text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]">Fasana Homes</p>
                            <h4 className="text-[length:var(--typeface-heading-h5)] leading-7 mt-1">Property viewing</h4>
                        </div>
                        <ul className="flex flex-col gap-3 text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]">
                            <li className="flex items-center gap-2.5"><Clock size={18} /> 30 min</li>
                            <li className="flex items-start gap-2.5"><MapPin size={18} className="shrink-0 mt-0.5" /> {property.title}, {property.address}, {property.city}</li>
                            {step === 'details' && (
                                <li className="flex items-start gap-2.5 text-[color:var(--text-primary)] font-medium">
                                    <CalendarBlank size={18} className="shrink-0 mt-0.5" /> {formatSlot(slot)}, {formatViewingDate(date)}
                                </li>
                            )}
                            <li className="flex items-center gap-2.5"><Globe size={18} /> Pakistan Standard Time</li>
                        </ul>
                    </aside>

                    {step === 'pick' ? (
                        <div className={cn('grid grid-cols-1 gap-6 p-6', date && 'lg:grid-cols-[1fr_220px]')}>
                            {/* Calendar */}
                            <div>
                                <h4 className="text-[length:var(--typeface-heading-h6)] font-medium mb-4">Select a date &amp; time</h4>
                                {submitError && (
                                    <p role="alert" className="mb-3 flex items-start gap-2 p-3 rounded-[8px] bg-[var(--color-red-50)] text-[color:var(--text-danger)] text-[length:var(--typeface-paragraph-text-s)]">
                                        <WarningCircle size={18} className="shrink-0 mt-0.5" /> {submitError}
                                    </p>
                                )}
                                <div className="flex items-center justify-center gap-6 mb-3">
                                    <button type="button" onClick={() => shiftMonth(-1)} disabled={atCurrentMonth} aria-label="Previous month"
                                        className="flex items-center justify-center size-9 rounded-full text-[color:var(--action-primary-hover)] bg-[var(--color-green-50)] disabled:bg-transparent disabled:text-[color:var(--text-tertiary)]">
                                        <CaretLeft size={16} weight="bold" />
                                    </button>
                                    <span className="min-w-[140px] text-center">{monthLabel}</span>
                                    <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month"
                                        className="flex items-center justify-center size-9 rounded-full text-[color:var(--action-primary-hover)] bg-[var(--color-green-50)]">
                                        <CaretRight size={16} weight="bold" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center">
                                    {WEEKDAYS.map((w) => <span key={w} className="text-[11px] uppercase tracking-wide text-[color:var(--text-secondary)] py-2">{w}</span>)}
                                    {grid.map((d, i) => {
                                        if (!d) return <span key={`pad-${i}`} />;
                                        const key = toDateKey(d);
                                        const available = getDateProblem(key, today) === null;
                                        const isSel = key === date;
                                        return (
                                            <div key={key} className="flex items-center justify-center py-0.5">
                                                <button
                                                    type="button"
                                                    disabled={!available}
                                                    onClick={() => { setDate(key); setSlot(''); setSubmitError(''); }}
                                                    aria-pressed={isSel}
                                                    aria-label={`${formatViewingDate(key)}${available ? '' : ', unavailable'}`}
                                                    className={cn(
                                                        'size-11 rounded-full text-[length:var(--typeface-paragraph-text)] transition-colors',
                                                        isSel
                                                            ? 'bg-[var(--action-primary-hover)] text-white font-medium'
                                                            : available
                                                                ? 'bg-[var(--color-green-50)] text-[color:var(--action-primary-hover)] font-medium hover:bg-[var(--action-primary-hover)]/15'
                                                                : 'text-[color:var(--text-tertiary)] cursor-default',
                                                    )}
                                                >
                                                    {d.getDate()}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Times */}
                            {date && (
                                <div className="blur-rise flex flex-col gap-3">
                                    <p className="font-medium mt-1 lg:mt-10">{formatViewingDate(date, 'short')}</p>
                                    {loadingSlots ? (
                                        <div className="flex items-center gap-2 py-4 text-[color:var(--text-secondary)]"><SpinnerGap size={16} className="animate-spin" /> Checking…</div>
                                    ) : (
                                        <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
                                            {slots.map((s) => {
                                                const taken = booked.includes(s);
                                                const isSel = s === slot;
                                                return isSel ? (
                                                    <div key={s} className="grid grid-cols-2 gap-2">
                                                        <span className="flex items-center justify-center h-12 rounded-[8px] bg-[var(--color-gray-600)] text-white font-medium">{formatSlot(s)}</span>
                                                        <button type="button" onClick={() => setStep('details')} className="h-12 rounded-[8px] bg-[var(--action-primary-hover)] text-white font-medium hover:brightness-95">Next</button>
                                                    </div>
                                                ) : (
                                                    <button key={s} type="button" disabled={taken} onClick={() => setSlot(s)}
                                                        className={cn(
                                                            'h-12 rounded-[8px] ring-1 font-medium transition-colors',
                                                            taken
                                                                ? 'ring-transparent bg-[var(--bg-gray-block)] text-[color:var(--text-tertiary)] line-through cursor-not-allowed'
                                                                : 'ring-[var(--action-primary-hover)]/40 text-[color:var(--action-primary-hover)] hover:ring-2 hover:ring-[var(--action-primary-hover)]',
                                                        )}>
                                                        {formatSlot(s)}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Details */
                        <form noValidate onSubmit={submit} className="flex flex-col gap-4 p-6 max-w-[520px]">
                            <h4 className="text-[length:var(--typeface-heading-h6)] font-medium">Enter details</h4>
                            {submitError && (
                                <p role="alert" className="flex items-start gap-2 p-3 rounded-[8px] bg-[var(--color-red-50)] text-[color:var(--text-danger)] text-[length:var(--typeface-paragraph-text-s)]">
                                    <WarningCircle size={18} className="shrink-0 mt-0.5" /> {submitError}
                                </p>
                            )}
                            {([
                                ['name', 'Name', 'text', 'name', true],
                                ['email', 'Email', 'email', 'email', true],
                                ['phone', 'Phone number', 'tel', 'tel', false],
                            ] as const).map(([key, label, type, ac, req]) => (
                                <div key={key}>
                                    <label htmlFor={`bk-${key}`} className="block mb-1.5 text-[length:var(--typeface-paragraph-text-s)] font-medium">
                                        {label}{req && <span className="text-[color:var(--text-danger)]"> *</span>}
                                    </label>
                                    <input id={`bk-${key}`} type={type} autoComplete={ac} value={details[key]} aria-invalid={Boolean(errors[key])}
                                        onChange={(e) => { setDetails({ ...details, [key]: e.target.value }); setErrors({ ...errors, [key]: undefined }); }}
                                        className={inputClass} />
                                    {errors[key] && <p className="mt-1 text-[12px] text-[color:var(--text-danger)]">{errors[key]}</p>}
                                </div>
                            ))}
                            <div>
                                <label htmlFor="bk-notes" className="block mb-1.5 text-[length:var(--typeface-paragraph-text-s)] font-medium">Anything we should know?</label>
                                <textarea id="bk-notes" rows={3} maxLength={1000} value={details.notes} onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                                    className={cn(inputClass, 'h-auto py-2.5 resize-none')} />
                            </div>
                            <button type="submit" disabled={submitting} className="btn-primary self-start rounded-full px-6 disabled:opacity-50">
                                {submitting ? <><SpinnerGap size={16} className="animate-spin" /> Scheduling…</> : 'Schedule viewing'}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </Modal>
    );
}
