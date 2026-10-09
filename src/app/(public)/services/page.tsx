import type { Metadata } from 'next';
import Image from 'next/image';
import LandingContactForm from '@/components/landing/LandingContactForm';
import Link from 'next/link';
import ServicesTimeline from '@/components/services/ServicesTimeline';
import AnimatedBlock from '@/components/ui/AnimatedBlock';

export const metadata: Metadata = {
    title: 'Services',
    description: 'Comprehensive property management and renovation services by Fasana Homes.',
};

const services = [
    {
        title: 'Tenant Relations',
        image: '/landing-page/image2.webp',
        description:
            'Building positive tenant relationships while ensuring rigorous residential screening and compliance.',
        bullets: [
            'Comprehensive tenant screening & background checks',
            'Lease preparation & renewal management',
            '24/7 tenant communication & support',
        ],
    },
    {
        title: 'Maintenance Oversight',
        image: '/landing-page/image3.webp',
        description:
            'Proactive property care to preserve value and prevent costly emergency repairs.',
        bullets: [
            'Regular property inspections',
            'Preventative maintenance scheduling',
            '24/7 emergency repair coordination',
        ],
    },
    {
        title: 'Financial Reporting',
        image: '/landing-page/contact-interior.webp',
        description:
            'Transparent, detailed financial insights delivered directly to your portal.',
        bullets: [
            'Automated rent collection',
            'Monthly financial statements',
            'Year-end tax-ready financials',
        ],
    },
];

export default function ServicesPage() {
    return (
        <>
            {/* ── Hero Section — FIGMA LAYOUT ───────────────────────────────── */}
            <section className="w-full bg-white pt-[var(--header-height)]">
                {/* Text Block */}
                <div className="flex flex-col items-center text-center px-5 sm:px-8 pt-16 pb-10 sm:pt-20 sm:pb-12">
                    <AnimatedBlock>
                        <h1
                            className="font-normal leading-[1.1] tracking-[-0.5px] text-[color:var(--on-surface-default)]"
                            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                        >
                            Property Management You<br className="hidden sm:block" /> Can Trust
                        </h1>
                    </AnimatedBlock>

                    <AnimatedBlock delay={0.15} className="mt-5 max-w-[620px]">
                        <p className="font-light text-[length:var(--typeface-heading-subheading)] leading-7 text-[color:var(--on-surface-default)]">
                            We handle the day-to-day tasks of running your rental property so you don&apos;t have to.
                            Experience stress-free ownership, reliable tenants, and proactive maintenance.
                        </p>
                    </AnimatedBlock>

                    <AnimatedBlock delay={0.3} className="mt-8">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-7 py-4 rounded-[6px] bg-[var(--foundation-blue-blue-6)] text-white text-[length:var(--typeface-paragraph-text-s)] font-medium leading-normal hover:bg-[var(--foundation-blue-blue-7)] transition-colors"
                        >
                            Discuss Your Property
                        </Link>
                    </AnimatedBlock>
                </div>

                {/* Image Mosaic
                    Layout (left → right):
                      col-1 : far-left partial tall (ser7)
                      col-2 : two stacked — top ser5, bottom ser4
                      col-3 : large center hero (ser2)
                      col-4 : two stacked — top ser6, bottom ser3
                      col-5 : far-right partial tall (ser1)
                */}
                <AnimatedBlock delay={0.45} className="w-full overflow-hidden">
                    {/*
                        Stepped pyramid heights (bottom-aligned via items-end):
                          col-1 & col-5 (outermost) : h-[54%]  — shortest
                          col-2 & col-4 (adjacent)  : h-[78%]  — medium
                          col-3 (center)             : h-[100%] — tallest

                        Mobile: row is 140vw wide, offset -20vw so side images bleed
                        off both edges for the "half-cut" effect. Col-1 & col-5 hidden.
                    */}
                    <div className="flex items-end gap-1.5 sm:gap-3 h-[380px] sm:h-[520px] lg:h-[620px] w-[140vw] -ml-[20vw] sm:w-full sm:ml-0">

                        {/* Col 1 — far-left partial — hidden on mobile */}
                        <div className="hidden sm:block relative flex-[0_0_9%] h-[54%] shrink-0 overflow-hidden rounded-sm">
                            <Image
                                src="/services-page/ser7.webp"
                                alt="Elegant living space with spiral staircase"
                                fill
                                className="object-cover object-center"
                                sizes="9vw"
                            />
                        </div>

                        {/* Col 2 — two stacked — 78% height */}
                        <div className="flex flex-col gap-1.5 sm:gap-3 flex-[0_0_27%] sm:flex-[0_0_17%] h-[78%] shrink-0">
                            <div className="relative flex-1 overflow-hidden rounded-sm">
                                <Image
                                    src="/services-page/ser5.webp"
                                    alt="Modern staircase with pendant lights"
                                    fill
                                    className="object-cover object-center"
                                    sizes="(max-width: 640px) 27vw, 17vw"
                                />
                            </div>
                            <div className="relative flex-1 overflow-hidden rounded-sm">
                                <Image
                                    src="/services-page/ser4.webp"
                                    alt="Minimalist hallway interior"
                                    fill
                                    className="object-cover object-center"
                                    sizes="(max-width: 640px) 27vw, 17vw"
                                />
                            </div>
                        </div>

                        {/* Col 3 — large center hero — 100% height */}
                        <div className="relative flex-1 h-full overflow-hidden rounded-sm">
                            <Image
                                src="/services-page/ser2.webp"
                                alt="Stylish living room with sofa and coffee table"
                                fill
                                className="object-cover object-center"
                                priority
                                sizes="(max-width: 640px) 60vw, 40vw"
                            />
                        </div>

                        {/* Col 4 — two stacked — 78% height */}
                        <div className="flex flex-col gap-1.5 sm:gap-3 flex-[0_0_27%] sm:flex-[0_0_17%] h-[78%] shrink-0">
                            <div className="relative flex-1 overflow-hidden rounded-sm">
                                <Image
                                    src="/services-page/ser6.webp"
                                    alt="Bright modern kitchen with timber cabinets"
                                    fill
                                    className="object-cover object-center"
                                    sizes="(max-width: 640px) 27vw, 17vw"
                                />
                            </div>
                            <div className="relative flex-1 overflow-hidden rounded-sm">
                                <Image
                                    src="/services-page/ser3.webp"
                                    alt="Stone wall outdoor seating area"
                                    fill
                                    className="object-cover object-center"
                                    sizes="(max-width: 640px) 27vw, 17vw"
                                />
                            </div>
                        </div>

                        {/* Col 5 — far-right partial — hidden on mobile */}
                        <div className="hidden sm:block relative flex-[0_0_9%] h-[54%] shrink-0 overflow-hidden rounded-sm">
                            <Image
                                src="/services-page/ser1.webp"
                                alt="Luxury dining room with high ceilings"
                                fill
                                className="object-cover object-center"
                                sizes="9vw"
                            />
                        </div>

                    </div>
                </AnimatedBlock>
            </section>

            {/* ── Services Section — STATIC ────────────────────────────────── */}
            <section id="services" className="bg-[var(--surface-default)] w-full px-5 sm:px-8 lg:px-16 py-16 sm:py-20 lg:py-24">
                <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-8 lg:gap-12">
                    {/* Left: Heading (Sticky) */}
                    <div className="flex flex-col gap-4 lg:w-1/2 shrink-0 lg:sticky lg:top-[calc(var(--header-height)+40px)] lg:self-start lg:pr-8">
                        <h2 className="text-[length:var(--typeface-heading-h2)] font-normal leading-tight text-[color:var(--on-surface-default)]">
                            Comprehensive Care for Your Assets
                        </h2>
                        <h2 className="font-light text-[length:var(--typeface-heading-subheading)] leading-6 text-[color:var(--on-surface-variant)] mt-2">
                            We handle the complexities of property ownership so you don&apos;t
                            have to. Our three-pillar approach ensures complete peace of mind.
                        </h2>
                        <div>
                            <Link
                                href="/rentals"
                                className="mt-4 self-start inline-flex items-center justify-center bg-[var(--foundation-blue-blue-6)] hover:bg-[var(--foundation-blue-blue-7)] px-[22.5px] py-[15px] rounded-[6px] text-[length:var(--typeface-paragraph-text-s)] font-medium text-[color:var(--on-surface-inverse)] leading-normal transition-colors"
                            >
                                View all rentals
                            </Link>
                        </div>
                    </div>

                    {/* Right: Timeline */}
                    <div className="lg:w-1/2 bg-[var(--surface-variant)] rounded-md p-6 sm:p-10 lg:p-12">
                        <ServicesTimeline services={services} />
                    </div>
                </div>
            </section>

            {/* ── Our Core Values Section — STATIC ───────────────────────────── */}
            <section className="w-full bg-[var(--surface-default)] dark:bg-transparent py-16 lg:py-28 px-5 sm:px-8 lg:px-16 flex justify-center border-t border-[var(--outline-default)] lg:border-none">
                <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 lg:gap-20">
                    
                    {/* Header */}
                    <div className="flex flex-col gap-4 lg:gap-6 max-w-3xl">
                        <h2 className="text-[length:var(--typeface-heading-h1)] text-[color:var(--on-surface-default)] font-normal tracking-[-0.24px] leading-tight lg:leading-none">
                            Our Core Values
                        </h2>
                        <p className="text-[length:var(--typeface-heading-subheading)] text-[color:var(--on-surface-default)] font-light leading-relaxed lg:leading-[28px]">
                            The foundation of trust, attention, and long-term relationships behind every property we manage.
                        </p>
                    </div>

                    {/* Values List */}
                    <div className="flex flex-col w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-0">
                            {[
                                {
                                    title: "Decades of Expertise",
                                    description: "Began investing in real estate more than 20 years ago with 35 combined years of hands-on property management experience.",
                                    image: "/about-us-page/prompt.webp"
                                },
                                {
                                    title: "Exceptional Tenant Service",
                                    description: "Our mission has always been to provide exceptional service and create homes where residents feel truly comfortable.",
                                    image: "/about-us-page/tenet-service.webp"
                                },
                                {
                                    title: "Long-Term Homes",
                                    description: "Our properties enjoy an average tenant stay of approximately five years thanks to genuine care and attention.",
                                    image: "/about-us-page/long-term-homes.webp"
                                },
                                {
                                    title: "Prompt & Detail-Oriented",
                                    description: "We pride ourselves on prompt responses and meticulous attention to every detail that matters.",
                                    image: "/about-us-page/detail-oriented.webp"
                                },
                                {
                                    title: "Community Roots",
                                    description: "What started as helping friends and family manage their properties grew into the official launch of Fasana Homes.",
                                    image: "/about-us-page/roots.webp"
                                },
                                {
                                    title: "Top-Class Service for All",
                                    description: "We are committed to delivering the highest level of property management to both landlords and tenants while serving our community.",
                                    image: "/about-us-page/handshake.webp"
                                }
                            ].reduce((result, value, index, array) => {
                                if (index % 2 === 0) {
                                    result.push(array.slice(index, index + 2));
                                }
                                return result;
                            }, [] as any[][]).map((row, rowIndex) => (
                                <div key={rowIndex} className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 border-t border-[var(--outline-default)] py-10 lg:py-12">
                                    {row.map((value: any, idx: number) => (
                                        <div key={idx} className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-start">
                                            <div className="relative w-full sm:w-[156px] aspect-video sm:aspect-square shrink-0 rounded-[var(--radius-sm)] overflow-hidden">
                                                <Image
                                                    src={value.image}
                                                    alt={value.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 100vw, 156px"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-3 lg:gap-4 max-w-[512px]">
                                                <h3 className="text-[length:var(--typeface-heading-h2)] font-normal text-[color:var(--on-surface-default)] leading-tight lg:leading-[36px]">
                                                    {value.title}
                                                </h3>
                                                <p className="text-[length:var(--typeface-heading-subheading)] text-[color:var(--on-surface-variant)] font-light leading-relaxed lg:leading-[28px]">
                                                    {value.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Contact Form Section — STATIC ────────────────────────────── */}
            <section className="bg-[var(--surface-variant)] w-full px-5 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-20">
                <div className="max-w-[800px] mx-auto">
                    {/* Heading */}
                    <div className="flex flex-col gap-4 mb-8">
                        <h2 className="text-[length:var(--typeface-heading-h2)] font-normal leading-9 text-[color:var(--on-surface-default)]">
                            Let&apos;s talk about your property
                        </h2>
                        <p className="font-light text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-variant)]">
                            Fill out the form below to get in touch with our team, or use the direct contact options below for immediate assistance.
                        </p>
                    </div>

                    {/* Form */}
                    <LandingContactForm />
                </div>
            </section>
        </>
    );
}
