'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon3D from '@/components/ui/Icon3D';
import { ArrowLeft, CalendarCheck, CheckCircle, Clock, LockSimple, SpinnerGap, WarningCircle } from '@phosphor-icons/react';
import { createClient } from '@/lib/supabase/client';
import { requestViewing } from '@/lib/actions/viewings';
import {
    BOOKABLE_STATUSES,
    formatSlot,
    formatViewingDate,
    getBookingDates,
    getSlotsForDate,
    toDateKey,
} from '@/lib/viewings';
import type { Property } from '@/lib/types';

type Step = 'date' | 'time' | 'details' | 'review' | 'done';
const STEPS: { key: Exclude<Step, 'done'>; label: string }[] = [
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'details', label: 'Details' },
    { key: 'review', label: 'Review' },
];

interface Details {
    name: string;
    email: string;
    phone: string;
    notes: string;
}
type DetailErrors = Partial<Record<keyof Details, string>>;

function validateDetails(d: Details): DetailErrors {
    const errors: DetailErrors = {};
    if (d.name.trim().length < 2) errors.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) errors.email = 'Enter a valid email address.';
    if (d.phone.trim() && !/^[+()\d\s-]{7,20}$/.test(d.phone.trim())) errors.phone = 'Enter a valid phone number, or leave it blank.';
    if (d.notes.length > 1000) errors.notes = 'Keep notes under 1,000 characters.';
    return errors;
}

const inputClass =
    'w-full p-3 border rounded-[6px] bg-white text-[length:var(--typeface-paragraph-text)] outline-none transition-colors focus:border-[var(--action-primary)] border-[var(--outline-default)] aria-[invalid=true]:border-[var(--border-danger)]';
const primaryBtn =
    'btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--action-primary)]';

export default function ViewingBooking({ property }: { property: Pick<Property, 'id' | 'title' | 'status' | 'address' | 'city'> }) {
    const [step, setStep] = useState<Step>('date');
    const [date, setDate] = useState('');
    const [slot, setSlot] = useState('');
    const [booked, setBooked] = useState<string[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState(false);
    const [details, setDetails] = useState<Details>({ name: '', email: '', phone: '', notes: '' });
    const [errors, setErrors] = useState<DetailErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [reference, setReference] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    const dates = useMemo(() => getBookingDates(), []);
    const bookable = BOOKABLE_STATUSES.includes(property.status);
    const slots = date ? getSlotsForDate(date) : [];
    const freeCount = slots.filter((s) => !booked.includes(s)).length;

    // Load taken slots whenever the date changes
    useEffect(() => {
        if (!date) return;
        let cancelled = false;
        setSlotsLoading(true);
        setSlotsError(false);
        createClient()
            .rpc('get_booked_slots', { p_property_id: property.id, p_date: date })
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error) setSlotsError(true);
                setBooked(((data as string[] | null) ?? []).map(String));
                setSlotsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [date, property.id, reloadKey]);

    const chooseDate = (key: string) => {
        setDate(key);
        setSlot('');
        setSubmitError('');
        setStep('time');
    };

    const goToReview = () => {
        const found = validateDetails(details);
        setErrors(found);
        if (Object.keys(found).length === 0) setStep('review');
    };

    const submit = async () => {
        setSubmitting(true);
        setSubmitError('');
        const result = await requestViewing({ propertyId: property.id, date, slot, ...details });
        setSubmitting(false);
        if (result.ok) {
            setReference(result.reference);
            setStep('done');
            return;
        }
        setSubmitError(result.error);
        if (result.slotTaken) {
            setBooked((b) => [...b, slot]);
            setSlot('');
            setReloadKey((k) => k + 1);
            setStep('time');
        } else if (result.field === 'date') {
            setStep('date');
        } else if (result.field && result.field in details) {
            setErrors({ [result.field]: result.error });
            setStep('details');
        }
    };

    const reset = () => {
        setStep('date');
        setDate('');
        setSlot('');
        setReference('');
        setSubmitError('');
        setDetails({ name: '', email: '', phone: '', notes: '' });
    };

    const stepIndex = STEPS.findIndex((s) => s.key === step);

    if (!bookable) {
        return (
            <div className="flex items-start gap-3 p-4 rounded-[var(--radius-md)] bg-[var(--bg-gray-block)]">
                <LockSimple size={22} className="shrink-0 text-[color:var(--text-secondary)]" />
                <div>
                    <p className="font-medium">Viewings are closed</p>
                    <p className="text-[color:var(--text-secondary)] text-[length:var(--typeface-paragraph-text-s)] mt-1">
                        This property has been {property.status === 'SOLD' ? 'sold' : property.status === 'RENTED' ? 'rented' : 'taken off the market'}.
                        Browse similar listings below.
                    </p>
                </div>
            </div>
        );
    }

    if (step === 'done') {
        return (
            <div className="blur-rise flex flex-col items-center text-center gap-3 py-4" role="status">
                <Icon3D name="check" size={88} className="mb-1" />
                <h4 className="font-display text-[length:var(--typeface-heading-h4)]">Viewing requested</h4>
                <p className="text-[color:var(--text-secondary)]">
                    {formatViewingDate(date)} at {formatSlot(slot)}
                </p>
                <p className="text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]">
                    Reference <span className="font-medium text-[color:var(--text-primary)]">#{reference}</span>. The agent will confirm by email at{' '}
                    {details.email}.
                </p>
                <button type="button" onClick={reset} className="mt-2 text-[length:var(--typeface-paragraph-text-s)] font-medium underline">
                    Book another time
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Progress */}
            <ol className="grid grid-cols-4 gap-2" aria-label="Booking progress">
                {STEPS.map((s, i) => (
                    <li key={s.key} aria-current={i === stepIndex ? 'step' : undefined} className="flex flex-col gap-1.5">
                        <span className={`h-1 rounded-full ${i <= stepIndex ? 'bg-[var(--action-primary)]' : 'bg-[var(--outline-default)]'}`} />
                        <span className={`text-[12px] ${i === stepIndex ? 'text-[color:var(--text-primary)] font-medium' : 'text-[color:var(--text-secondary)]'}`}>
                            {i + 1}. {s.label}
                        </span>
                    </li>
                ))}
            </ol>

            {stepIndex > 0 && (
                <button type="button" onClick={() => setStep(STEPS[stepIndex - 1].key)}
                    className="self-start inline-flex items-center gap-1.5 text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
                    <ArrowLeft size={14} /> Back
                </button>
            )}

            {submitError && (
                <div role="alert" className="flex items-start gap-2 p-3 rounded-[6px] bg-[var(--color-red-50)] text-[color:var(--text-danger)] text-[length:var(--typeface-paragraph-text-s)]">
                    <WarningCircle size={18} className="shrink-0 mt-0.5" />
                    {submitError}
                </div>
            )}

            {/* 1. Date */}
            {step === 'date' && (
                <fieldset>
                    <legend className="mb-3 font-medium">Choose a day</legend>
                    <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-4 xl:grid-cols-7 gap-2">
                        {dates.map((d) => {
                            const key = toDateKey(d);
                            const closed = getSlotsForDate(key).length === 0;
                            const selected = key === date;
                            return (
                                <button key={key} type="button" disabled={closed} onClick={() => chooseDate(key)}
                                    aria-pressed={selected}
                                    aria-label={`${formatViewingDate(key)}${closed ? ', no viewings' : ''}`}
                                    className={`flex flex-col items-center py-2 rounded-[6px] border transition-colors ${
                                        selected
                                            ? 'bg-[var(--action-primary)] border-[var(--action-primary)] text-[color:var(--text-inverse)]'
                                            : closed
                                                ? 'border-transparent bg-[var(--bg-gray-block)] text-[color:var(--text-tertiary)] line-through cursor-not-allowed'
                                                : 'border-[var(--outline-default)] bg-white hover:border-[var(--action-border-hover)]'
                                    }`}>
                                    <span className="text-[11px] uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                    <span className="text-[18px] leading-6 font-medium">{d.getDate()}</span>
                                    <span className="text-[11px]">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                                </button>
                            );
                        })}
                    </div>
                    <p className="mt-3 text-[12px] text-[color:var(--text-secondary)]">Agents don&apos;t host viewings on Sundays.</p>
                </fieldset>
            )}

            {/* 2. Time */}
            {step === 'time' && (
                <fieldset>
                    <legend className="mb-1 font-medium">Choose a time</legend>
                    <p className="mb-3 text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]">{formatViewingDate(date)}</p>
                    {slotsLoading ? (
                        <div className="flex items-center gap-2 py-6 text-[color:var(--text-secondary)]" aria-busy="true">
                            <SpinnerGap size={18} className="animate-spin" /> Checking availability…
                        </div>
                    ) : (
                        <>
                            {slotsError && (
                                <p className="mb-3 text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-warning)]">
                                    Couldn&apos;t check live availability. You can still request a time and the agent will confirm.
                                </p>
                            )}
                            {freeCount === 0 ? (
                                <div className="py-4">
                                    <p className="font-medium">Fully booked</p>
                                    <p className="text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)] mt-1">Every slot on this day is taken. Try another day.</p>
                                    <button type="button" onClick={() => setStep('date')} className="mt-3 text-[length:var(--typeface-paragraph-text-s)] font-medium underline">Choose another day</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {slots.map((s) => {
                                        const taken = booked.includes(s);
                                        const selected = s === slot;
                                        return (
                                            <button key={s} type="button" disabled={taken} onClick={() => setSlot(s)} aria-pressed={selected}
                                                aria-label={`${formatSlot(s)}${taken ? ', already booked' : ''}`}
                                                className={`h-11 rounded-[6px] border text-[length:var(--typeface-paragraph-text-s)] transition-colors ${
                                                    selected
                                                        ? 'bg-[var(--action-primary)] border-[var(--action-primary)] text-[color:var(--text-inverse)]'
                                                        : taken
                                                            ? 'border-transparent bg-[var(--bg-gray-block)] text-[color:var(--text-tertiary)] line-through cursor-not-allowed'
                                                            : 'border-[var(--outline-default)] bg-white hover:border-[var(--action-border-hover)]'
                                                }`}>
                                                {formatSlot(s)}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            <button type="button" disabled={!slot} onClick={() => setStep('details')} className={`${primaryBtn} w-full mt-4`}>
                                Continue
                            </button>
                        </>
                    )}
                </fieldset>
            )}

            {/* 3. Details */}
            {step === 'details' && (
                <form noValidate onSubmit={(e) => { e.preventDefault(); goToReview(); }} className="flex flex-col gap-4">
                    {([
                        ['name', 'Full name', 'text', 'name', true],
                        ['email', 'Email', 'email', 'email', true],
                        ['phone', 'Phone (optional)', 'tel', 'tel', false],
                    ] as const).map(([key, label, type, autoComplete, required]) => (
                        <div key={key}>
                            <label htmlFor={`v-${key}`} className="block mb-1.5 text-[length:var(--typeface-paragraph-text-s)] font-medium">
                                {label}{required && <span className="text-[color:var(--text-danger)]"> *</span>}
                            </label>
                            <input id={`v-${key}`} type={type} autoComplete={autoComplete} value={details[key]}
                                aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `v-${key}-err` : undefined}
                                onChange={(e) => {
                                    setDetails({ ...details, [key]: e.target.value });
                                    if (errors[key]) setErrors({ ...errors, [key]: undefined });
                                }}
                                className={inputClass} />
                            {errors[key] && <p id={`v-${key}-err`} className="mt-1 text-[12px] text-[color:var(--text-danger)]">{errors[key]}</p>}
                        </div>
                    ))}
                    <div>
                        <label htmlFor="v-notes" className="block mb-1.5 text-[length:var(--typeface-paragraph-text-s)] font-medium">Anything the agent should know?</label>
                        <textarea id="v-notes" rows={3} value={details.notes} maxLength={1000}
                            onChange={(e) => setDetails({ ...details, notes: e.target.value })} className={`${inputClass} resize-none`} />
                    </div>
                    <button type="submit" className={primaryBtn}>Review request</button>
                </form>
            )}

            {/* 4. Review */}
            {step === 'review' && (
                <div className="flex flex-col gap-4">
                    <dl className="flex flex-col gap-3 p-4 rounded-[6px] bg-[var(--bg-gray-block)] text-[length:var(--typeface-paragraph-text-s)]">
                        <div className="flex items-start gap-2"><CalendarCheck size={18} className="shrink-0" /><div><dt className="sr-only">Date</dt><dd>{formatViewingDate(date)}</dd></div></div>
                        <div className="flex items-start gap-2"><Clock size={18} className="shrink-0" /><div><dt className="sr-only">Time</dt><dd>{formatSlot(slot)} · about 30 minutes</dd></div></div>
                        <div className="pt-3 border-t border-[var(--outline-default)]">
                            <dt className="text-[color:var(--text-secondary)]">Property</dt>
                            <dd>{property.title}, {property.address}, {property.city}</dd>
                        </div>
                        <div>
                            <dt className="text-[color:var(--text-secondary)]">Contact</dt>
                            <dd>{details.name} · {details.email}{details.phone && ` · ${details.phone}`}</dd>
                        </div>
                        {details.notes && (
                            <div>
                                <dt className="text-[color:var(--text-secondary)]">Notes</dt>
                                <dd className="whitespace-pre-wrap break-words">{details.notes}</dd>
                            </div>
                        )}
                    </dl>
                    <button type="button" onClick={submit} disabled={submitting} className={primaryBtn}>
                        {submitting ? (<><SpinnerGap size={18} className="animate-spin" /> Sending…</>) : 'Confirm viewing request'}
                    </button>
                </div>
            )}
        </div>
    );
}
