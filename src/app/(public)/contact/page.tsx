'use client';

import { useState } from 'react';
import Image from 'next/image';
import { EnvelopeSimple, Phone, ChatCircle, Check } from '@phosphor-icons/react';
import { submitLead } from '@/lib/actions/leads';
import { INQUIRY_OPTIONS, getLeadTypeFromHelpType } from '@/lib/constants/inquiry-options';
import { PublicInput, PublicSelect, PublicTextarea } from '@/components/ui/public-inputs';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        helpType: '',
        phone: '',
        email: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.helpType) {
            toast.error('Please select how we can help you.');
            return;
        }

        setSubmitting(true);
        try {
            await submitLead({
                name: `${form.firstName} ${form.lastName}`.trim(),
                email: form.email,
                phone: form.phone,
                type: getLeadTypeFromHelpType(form.helpType),
                helpType: form.helpType,
                message: form.message,
            });
            setSubmitted(true);
            toast.success('Message sent! We\'ll get back to you within 24 hours.');
        } catch {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="bg-[var(--surface-variant)] min-h-screen pt-[var(--header-height)]">
            <div>

                {/* ── Hero: Image + Form ─────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row">

                    {/* Left: Interior Image */}
                    <div className="relative hidden lg:block lg:w-1/2 shrink-0 lg:sticky lg:top-[var(--header-height)] lg:self-start lg:h-[calc(100dvh-var(--header-height))]">
                        <Image
                            src="/landing-page/contact-interior.webp"
                            alt="Modern interior"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 0px, 540px"
                            priority
                        />
                    </div>

                    {/* Right: Contact Form */}
                    <div className="flex-1 bg-[var(--surface-default)] p-6 sm:p-8 lg:p-12">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-6">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center border border-[var(--feedback-success)]" style={{ backgroundColor: 'color-mix(in srgb, var(--feedback-success) 10%, transparent)' }}>
                                    <Check size={32} weight="bold" className="text-[var(--feedback-success)]" />
                                </div>
                                <h3 className="text-[length:var(--typeface-heading-h3)] font-normal text-[color:var(--on-surface-default)]">
                                    Message Sent!
                                </h3>
                                <p className="font-light text-[length:var(--typeface-paragraph-text)] text-[color:var(--on-surface-variant)] text-center max-w-md">
                                    Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setForm({ firstName: '', lastName: '', helpType: '', phone: '', email: '', message: '' });
                                    }}
                                    className="bg-[var(--on-surface-primary)] px-[22.5px] py-[15px] rounded-[var(--radius-md)] text-[length:var(--typeface-paragraph-text-s)] font-medium text-[color:var(--on-surface-inverse)] leading-normal min-w-[80px] hover:bg-[var(--foundation-blue-blue-7)] transition-colors"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Heading */}
                                <h2 className="text-[length:var(--typeface-heading-h2)] font-normal text-[color:var(--on-surface-default)] leading-9 mb-3">
                                    Let&apos;s talk about your property
                                </h2>
                                <p className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-variant)] leading-6 mb-8 max-w-[520px]">
                                    Fill out the form below to get in touch with our team, or use the direct contact options below for immediate assistance.
                                </p>

                                {/* Form */}
                                <div className="flex flex-col gap-6">
                                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                                    {/* First Name + Last Name Row */}
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <div className="flex flex-col gap-2 flex-1">
                                            <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <PublicInput
                                                type="text"
                                                required
                                                value={form.firstName}
                                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 flex-1">
                                            <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <PublicInput
                                                type="text"
                                                required
                                                value={form.lastName}
                                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* How can we help? (Dropdown) */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                            How can we help? <span className="text-red-500">*</span>
                                        </label>
                                        <PublicSelect
                                            value={form.helpType}
                                            onChange={(e) => setForm({ ...form, helpType: e.target.value })}
                                            options={INQUIRY_OPTIONS.map((opt) => ({ label: opt.label, value: opt.label }))}
                                        />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                            Phone Number <span className="text-[color:var(--on-surface-variant)]">(optional)</span>
                                        </label>
                                        <PublicInput
                                            type="tel"
                                            placeholder="(555) 000-0000"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <PublicInput
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>

                                    {/* Message */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <PublicTextarea
                                            required
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            placeholder="Type your message..."
                                            className="h-[120px] sm:h-[180px] resize-y"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex items-center justify-center w-full sm:w-fit px-[22.5px] py-[15px] rounded-[6px] bg-[var(--on-surface-primary)] text-[color:var(--on-surface-inverse)] text-[length:var(--typeface-paragraph-text-s)] font-medium leading-normal min-w-[80px] hover:bg-[var(--foundation-blue-blue-7)] transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Sending...' : 'Submit'}
                                    </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
