'use client';

import { useState } from 'react';
import Icon3D from '@/components/ui/Icon3D';
import { SpinnerGap, WarningCircle } from '@phosphor-icons/react';
import HeroVideo from '@/components/landing/HeroVideo';
import { submitLead } from '@/lib/actions/leads';
import { INQUIRY_OPTIONS, getLeadTypeFromHelpType } from '@/lib/constants/inquiry-options';
import Dropdown from '@/components/ui/Dropdown';

// Mirrors the inquiry form on the property detail page (ViewingBooking details step)
interface Details {
    name: string;
    email: string;
    phone: string;
    helpType: string;
    message: string;
}
type DetailErrors = Partial<Record<keyof Details, string>>;

const EMPTY: Details = { name: '', email: '', phone: '', helpType: '', message: '' };

function validateDetails(d: Details): DetailErrors {
    const errors: DetailErrors = {};
    if (d.name.trim().length < 2) errors.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) errors.email = 'Enter a valid email address.';
    if (d.phone.trim() && !/^[+()\d\s-]{7,20}$/.test(d.phone.trim())) errors.phone = 'Enter a valid phone number, or leave it blank.';
    if (!d.helpType) errors.helpType = 'Choose what you need help with.';
    if (d.message.trim().length < 2) errors.message = 'Write a short message.';
    else if (d.message.length > 1000) errors.message = 'Keep your message under 1,000 characters.';
    return errors;
}

const inputClass =
    'w-full p-3 border rounded-[6px] bg-white text-[length:var(--typeface-paragraph-text)] outline-none transition-colors focus:border-[var(--action-primary)] border-[var(--outline-default)] aria-[invalid=true]:border-[var(--border-danger)]';
const labelClass = 'block mb-1.5 text-[length:var(--typeface-paragraph-text-s)] font-medium';
const primaryBtn =
    'btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--action-primary)]';

export default function ContactPage() {
    const [details, setDetails] = useState<Details>(EMPTY);
    const [errors, setErrors] = useState<DetailErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [done, setDone] = useState(false);

    const update = (key: keyof Details, value: string) => {
        setDetails({ ...details, [key]: value });
        if (errors[key]) setErrors({ ...errors, [key]: undefined });
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const found = validateDetails(details);
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        setSubmitting(true);
        setSubmitError('');
        try {
            await submitLead({
                name: details.name.trim(),
                email: details.email.trim(),
                phone: details.phone.trim(),
                type: getLeadTypeFromHelpType(details.helpType),
                helpType: details.helpType,
                message: details.message.trim(),
            });
            setDone(true);
        } catch {
            setSubmitError('Couldn’t send your message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const field = (key: 'name' | 'email' | 'phone', label: string, type: string, autoComplete: string, required: boolean) => (
        <div>
            <label htmlFor={`c-${key}`} className={labelClass}>
                {label}{required && <span className="text-[color:var(--text-danger)]"> *</span>}
            </label>
            <input id={`c-${key}`} type={type} autoComplete={autoComplete} value={details[key]}
                aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `c-${key}-err` : undefined}
                onChange={(e) => update(key, e.target.value)} className={inputClass} />
            {errors[key] && <p id={`c-${key}-err`} className="mt-1 text-[12px] text-[color:var(--text-danger)]">{errors[key]}</p>}
        </div>
    );

    return (
        <section className="relative min-h-[100dvh] flex justify-end">
            <HeroVideo />

            {/* Form panel: full height, right half on desktop, full width on mobile */}
            <div className="relative z-10 w-full lg:w-1/2 min-h-[100dvh] bg-[var(--surface-default)] flex flex-col justify-center px-5 sm:px-10 lg:px-16 pt-[calc(var(--header-height)+48px)] pb-12">
                <div className="w-full max-w-[520px] mx-auto flex flex-col gap-4">
                {done ? (
                    <div className="blur-rise flex flex-col items-center text-center gap-3 py-4" role="status">
                        <Icon3D name="check" size={88} className="mb-1" />
                        <h4 className="font-display text-[length:var(--typeface-heading-h4)]">Message sent</h4>
                        <p className="text-[color:var(--text-secondary)]">
                            Thanks, {details.name.split(' ')[0]}. We&apos;ll reply to {details.email} within 24 hours.
                        </p>
                        <button type="button" onClick={() => { setDetails(EMPTY); setDone(false); }}
                            className="mt-2 text-[length:var(--typeface-paragraph-text-s)] font-medium underline">
                            Send another message
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-[length:var(--typeface-heading-h3)] leading-tight">Contact us</h1>
                        <p className="text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]">
                            Questions about a property, renting, selling or management? Send us a message and we&apos;ll reply within 24 hours.
                        </p>

                        {submitError && (
                            <div role="alert" className="flex items-start gap-2 p-3 rounded-[6px] bg-[var(--color-red-50)] text-[color:var(--text-danger)] text-[length:var(--typeface-paragraph-text-s)]">
                                <WarningCircle size={18} className="shrink-0 mt-0.5" />
                                {submitError}
                            </div>
                        )}

                        <form noValidate onSubmit={submit} className="flex flex-col gap-4">
                            {field('name', 'Full name', 'text', 'name', true)}
                            {field('email', 'Email', 'email', 'email', true)}
                            {field('phone', 'Phone (optional)', 'tel', 'tel', false)}
                            <div>
                                <label htmlFor="c-helpType" className={labelClass}>
                                    How can we help?<span className="text-[color:var(--text-danger)]"> *</span>
                                </label>
                                <Dropdown id="c-helpType" value={details.helpType}
                                    aria-invalid={Boolean(errors.helpType)} aria-describedby={errors.helpType ? 'c-helpType-err' : undefined}
                                    onChange={(e) => update('helpType', e.target.value)} className={inputClass}>
                                    <option value="" disabled>Choose a topic</option>
                                    {INQUIRY_OPTIONS.map((o) => <option key={o.label} value={o.label}>{o.label}</option>)}
                                </Dropdown>
                                {errors.helpType && <p id="c-helpType-err" className="mt-1 text-[12px] text-[color:var(--text-danger)]">{errors.helpType}</p>}
                            </div>
                            <div>
                                <label htmlFor="c-message" className={labelClass}>
                                    Message<span className="text-[color:var(--text-danger)]"> *</span>
                                </label>
                                <textarea id="c-message" rows={4} value={details.message} maxLength={1000}
                                    aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'c-message-err' : undefined}
                                    onChange={(e) => update('message', e.target.value)} className={`${inputClass} resize-none`} />
                                {errors.message && <p id="c-message-err" className="mt-1 text-[12px] text-[color:var(--text-danger)]">{errors.message}</p>}
                            </div>
                            <button type="submit" disabled={submitting} className={primaryBtn}>
                                {submitting ? (<><SpinnerGap size={18} className="animate-spin" /> Sending…</>) : 'Send message'}
                            </button>
                        </form>
                    </>
                )}
                </div>
            </div>
        </section>
    );
}
