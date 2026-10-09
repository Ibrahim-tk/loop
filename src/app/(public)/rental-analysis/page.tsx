'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check } from '@phosphor-icons/react';
import { submitLead } from '@/lib/actions/leads';
import { PublicInput, PublicSelect } from '@/components/ui/public-inputs';
import toast from 'react-hot-toast';

import AnimatedBlock from '@/components/ui/AnimatedBlock';

const PROPERTY_TYPES = [
    'Single Family Home',
    'Multi-Family',
    'Condo / Townhouse',
    'Apartment',
    'Commercial',
];

const PROPERTY_CONDITIONS = [
    'Excellent',
    'Good',
    'Fair',
    'Needs Renovation',
];



export default function RentalAnalysisPage() {
    const [form, setForm] = useState({
        address: '',
        propertyType: '',
        propertyCondition: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const details = [
                `Property Address: ${form.address}`,
                `Property Type: ${form.propertyType}`,
                `Property Condition: ${form.propertyCondition}`,
            ].join('\n');

            await submitLead({
                name: `${form.firstName} ${form.lastName}`.trim(),
                email: form.email,
                phone: form.phone,
                type: 'ANALYSIS',
                helpType: 'Rental Analysis',
                message: `Rental Analysis Request\n\n${details}`,
            });
            setSubmitted(true);
            toast.success('Request submitted! We\'ll send your analysis within 24 hours.');
        } catch {
            toast.error('Failed to submit request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="bg-[var(--surface-variant)] min-h-screen pt-[var(--header-height)]">
            <div>

                {/* ── Hero: Image Left + Form Right ───────────── */}
                <div className="flex flex-col lg:flex-row">

                    {/* Left: Sticky Hero Image with Navy Overlay + Text */}
                    <div className="relative hidden lg:flex lg:flex-col lg:w-1/2 shrink-0 lg:sticky lg:top-[var(--header-height)] lg:self-start lg:h-[calc(100dvh-var(--header-height))] overflow-hidden items-start justify-between px-10 py-24">
                        {/* Background Image */}
                        <AnimatedBlock className="absolute inset-0 pointer-events-none" aria-hidden="true">
                            <div className="absolute inset-0 bg-[var(--action-primary)]" />
                            <Image
                                src="/landing-page/rental-analysis-hero.webp"
                                alt=""
                                fill
                                className="object-cover opacity-50"
                            />
                        </AnimatedBlock>

                        {/* Heading + Subtitle */}
                        <div className="relative flex flex-col gap-6 max-w-[471px]">
                            <AnimatedBlock as="h1" className="text-white text-[48px] font-normal leading-none tracking-[-0.24px]">
                                Discover your properties to earning potential.
                            </AnimatedBlock>
                            <AnimatedBlock as="p" delay={0.2} className="text-white font-light text-[length:var(--typeface-heading-subheading,20px)] leading-7">
                                Get a data-driven report on your rental properties&apos; value and maximize your returns.
                            </AnimatedBlock>
                        </div>

                        {/* Testimonial Blockquote */}
                        <AnimatedBlock delay={0.4} className="relative border-l-4 border-white pl-5 max-w-[512px]">
                            <div className="opacity-90">
                                <p className="text-white text-[length:var(--typeface-heading-h5,18px)] font-normal leading-normal">
                                    &ldquo;Fasana Homes&apos;s analysis was spot on. I increased my rental
                                    income by 15% within the first month.&rdquo;
                                </p>
                            </div>
                            <div className="opacity-75 mt-2">
                                <p className="text-white text-[14px] font-normal leading-5">
                                    — Sarah T., Property Owner
                                </p>
                            </div>
                        </AnimatedBlock>
                    </div>

                    {/* Right: Form Section */}
                    <div className="flex-1 bg-white p-6 sm:p-8 lg:p-12">
                        {submitted ? (
                            /* ── Success State ───────────────────────── */
                            <div className="flex flex-col items-center justify-center py-12 gap-6">
                                <div className="w-16 h-16 rounded-full bg-[rgba(21,128,61,0.1)] flex items-center justify-center">
                                    <Check size={32} weight="bold" className="text-[var(--feedback-success)]" />
                                </div>
                                <h3 className="text-[length:var(--typeface-heading-h3)] font-normal text-[color:var(--on-surface-default)]">
                                    Request Submitted!
                                </h3>
                                <p className="font-light text-[length:var(--typeface-paragraph-text)] text-[color:var(--on-surface-variant)] text-center max-w-md">
                                    Thank you! Our team will prepare your rental analysis and send it to your email within 24 hours.
                                </p>
                                <button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setForm({ address: '', propertyType: '', propertyCondition: '', firstName: '', lastName: '', email: '', phone: '' });
                                    }}
                                    className="bg-[var(--on-surface-primary)] px-[22.5px] py-[15px] rounded-[6px] text-[14px] font-medium text-white leading-normal min-w-[80px] hover:bg-[var(--foundation-blue-blue-7)] transition-colors"
                                >
                                    Submit Another Property
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Section Title */}
                                <div className="flex flex-col gap-6 mb-8">
                                    <h2 className="text-[length:var(--typeface-heading-h2)] font-normal text-[color:var(--on-surface-default)] leading-9">
                                        Let&apos;s talk about your property
                                    </h2>
                                    <p className="font-light text-[length:var(--typeface-heading-subheading,20px)] leading-7 text-[color:var(--on-surface-default)]">
                                        Fill out the form below to get in touch with our team, or use the direct contact options below for immediate assistance.
                                    </p>
                                </div>

                                {/* Form */}
                                <div className="flex flex-col gap-6">
                                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                        {/* Property Address */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                            Property Address
                                        </label>
                                        <PublicInput
                                            type="text"
                                            required
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        />
                                    </div>

                                    {/* Property Type */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                            Property type
                                        </label>
                                        <PublicSelect
                                            required
                                            value={form.propertyType}
                                            onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                                            options={PROPERTY_TYPES.map((type) => ({ label: type, value: type }))}
                                            placeholder="Select property type"
                                        />
                                    </div>

                                    {/* Property Condition */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                            Property condition
                                        </label>
                                        <PublicSelect
                                            required
                                            value={form.propertyCondition}
                                            onChange={(e) => setForm({ ...form, propertyCondition: e.target.value })}
                                            options={PROPERTY_CONDITIONS.map((condition) => ({ label: condition, value: condition }))}
                                            placeholder="Select condition"
                                        />
                                    </div>

                                    {/* First Name + Last Name */}
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <div className="flex flex-col gap-2 flex-1">
                                            <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                                First Name
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
                                                Last Name
                                            </label>
                                            <PublicInput
                                                type="text"
                                                value={form.lastName}
                                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                            Email
                                        </label>
                                        <PublicInput
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>

                                    {/* Phone (optional) */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                            Phone (optional)
                                        </label>
                                        <PublicInput
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex items-center justify-center w-full sm:w-fit px-[22.5px] py-[15px] rounded-[6px] bg-[var(--on-surface-primary)] text-white text-[14px] font-medium leading-normal min-w-[80px] hover:bg-[var(--foundation-blue-blue-7)] transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Submitting...' : 'Submit'}
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
