'use client';

import { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { submitLead } from '@/lib/actions/leads';
import { INQUIRY_OPTIONS, getLeadTypeFromHelpType } from '@/lib/constants/inquiry-options';
import { PublicInput, PublicSelect, PublicTextarea } from '@/components/ui/public-inputs';
import toast from 'react-hot-toast';

/**
 * `propertyTitle` switches to the short property enquiry form: name, phone, email, message.
 * Without it, this is the general contact form with the "How can we help?" picker.
 */
export default function LandingContactForm({ propertyTitle }: { propertyTitle?: string } = {}) {
    const isPropertyEnquiry = Boolean(propertyTitle);
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
        
        if (!isPropertyEnquiry && !form.helpType) {
            toast.error('Please select how we can help you.');
            return;
        }

        setSubmitting(true);
        try {
            await submitLead({
                name: `${form.firstName} ${form.lastName}`.trim(),
                email: form.email,
                phone: form.phone,
                type: isPropertyEnquiry ? 'GENERAL' : getLeadTypeFromHelpType(form.helpType),
                helpType: isPropertyEnquiry ? 'Property enquiry' : form.helpType,
                message: isPropertyEnquiry ? `Re: ${propertyTitle}\n\n${form.message}` : form.message,
            });
            setSubmitted(true);
            toast.success('Message sent! We\'ll get back to you within 24 hours.');
        } catch {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col gap-6 items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
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
                    className="bg-[var(--on-surface-primary)] px-[22.5px] py-[15px] rounded-[6px] text-[length:var(--typeface-paragraph-text-s)] font-medium text-white leading-normal min-w-[80px] hover:bg-[var(--foundation-blue-blue-7)] transition-colors"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {isPropertyEnquiry ? (
                <div className="flex flex-col gap-2">
                    <label className="font-light text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-default)]">
                        Your name <span className="text-red-500">*</span>
                    </label>
                    <PublicInput
                        type="text"
                        required
                        autoComplete="name"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                </div>
            ) : (
            <>
            {/* First Name + Last Name Row */}
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-light text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-default)]">
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
                    <label className="font-light text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-default)]">
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

            {/* How can we help? */}
            <div className="flex flex-col gap-2">
                <label className="font-light text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-default)]">
                    How can we help? <span className="text-red-500">*</span>
                </label>
                <PublicSelect
                    value={form.helpType}
                    onChange={(e) => setForm({ ...form, helpType: e.target.value })}
                    options={INQUIRY_OPTIONS.map((opt) => ({ label: opt.label, value: opt.label }))}
                />
            </div>
            </>
            )}

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
                <label className="font-light text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-default)]">
                    Phone Number
                </label>
                <PublicInput
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
                <label className="font-light text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-default)]">
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
                <label className="font-light text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-default)]">
                    Message <span className="text-red-500">*</span>
                </label>
                <PublicTextarea
                    required
                    rows={isPropertyEnquiry ? 4 : 6}
                    placeholder="Type your message..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={isPropertyEnquiry ? 'min-h-[120px]' : 'min-h-[120px] sm:min-h-[180px]'}
                />
            </div>

            {/* Submit Button */}
            <div>
                <button
                    type="submit"
                    disabled={submitting}
                    className={isPropertyEnquiry ? 'btn-primary w-full disabled:opacity-50' : 'bg-[var(--on-surface-primary)] px-[22.5px] py-[15px] rounded-[6px] w-full sm:w-fit text-[length:var(--typeface-paragraph-text-s)] font-medium text-white leading-normal min-w-[80px] hover:bg-[var(--foundation-blue-blue-7)] transition-colors disabled:opacity-50'}
                >
                    {submitting ? 'Sending...' : isPropertyEnquiry ? 'Send message' : 'Submit'}
                </button>
            </div>
        </form>
    );
}
