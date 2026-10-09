import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import LandingContactForm from '@/components/landing/LandingContactForm';
import { Users, Shield, TrendingUp, Handshake, Award, Building2 } from 'lucide-react';
import AnimatedBlock from '@/components/ui/AnimatedBlock';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Blue Pillar Management, our philosophy, and our commitment to protecting your property investments.',
};

export default function AboutPage() {
    return (
        <div className="flex flex-col w-full bg-[var(--surface-default)] pt-[100px] lg:pt-[var(--header-height)]">

            {/* 1. Hero Section — NEW FIGMA LAYOUT MATCH (SIDE-BY-SIDE) */}
            <section className="relative w-full min-h-[calc(100vh-100px)] lg:min-h-[calc(100vh-var(--header-height))] flex items-center bg-white overflow-hidden py-10 lg:py-0">
                <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                    
                    {/* ── Text Block (Left Side) ── */}
                    <div className="flex flex-col items-start text-left w-full lg:w-1/2">
                        <AnimatedBlock>
                            <h1
                                className="font-normal leading-[1.1] tracking-[-0.5px] text-[color:var(--on-surface-default)]"
                                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                            >
                                Blue Pillar<br className="hidden sm:block" /> Management
                            </h1>
                        </AnimatedBlock>

                        <AnimatedBlock delay={0.15} className="mt-5 max-w-[540px]">
                            <p className="font-light text-[length:var(--typeface-heading-subheading)] leading-7 text-[color:var(--on-surface-default)]">
                                Founded on two decades of real estate investment and 35 years of hands-on property management experience. We create homes where tenants want to stay — and deliver the exceptional service tenants deserve.
                            </p>
                        </AnimatedBlock>

                        <AnimatedBlock delay={0.3} className="mt-8">
                            <Link
                                href="#our-story"
                                className="inline-flex items-center justify-center px-7 py-4 rounded-[6px] bg-[var(--foundation-blue-blue-6)] text-white text-[length:var(--typeface-paragraph-text-s)] font-medium leading-normal hover:bg-[var(--foundation-blue-blue-7)] transition-colors"
                            >
                                Discover Our Story
                            </Link>
                        </AnimatedBlock>
                    </div>

                    {/* ── Image Grid Bento (Right Side) ── */}
                    <AnimatedBlock delay={0.45} className="w-full lg:w-1/2 mt-4 lg:mt-0">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 h-[auto] sm:h-[400px] lg:h-[500px]">
                            
                            {/* Large Main Image */}
                            <div className="relative w-full sm:w-2/3 h-[250px] sm:h-full overflow-hidden rounded-sm shadow-sm">
                                <Image
                                    src="/services-page/ser2.webp"
                                    alt="Stylish living room with sofa and coffee table"
                                    fill
                                    className="object-cover object-center"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                />
                            </div>

                            {/* Two Stacked Images */}
                            <div className="w-full sm:w-1/3 flex flex-row sm:flex-col gap-3 sm:gap-4 h-[140px] sm:h-full">
                                <div className="relative flex-1 overflow-hidden rounded-sm shadow-sm">
                                    <Image
                                        src="/services-page/ser7.webp"
                                        alt="Elegant living space with spiral staircase"
                                        fill
                                        className="object-cover object-center"
                                        sizes="(max-width: 1024px) 50vw, 16vw"
                                    />
                                </div>
                                <div className="relative flex-1 overflow-hidden rounded-sm shadow-sm">
                                    <Image
                                        src="/services-page/ser6.webp"
                                        alt="Bright modern kitchen with timber cabinets"
                                        fill
                                        className="object-cover object-center"
                                        sizes="(max-width: 1024px) 50vw, 16vw"
                                    />
                                </div>
                            </div>

                        </div>
                    </AnimatedBlock>
                </div>
            </section>

            {/* 2. Our Journey Section — STATIC */}
            <section id="our-story" className="w-full py-16 lg:py-28 bg-[var(--surface-variant)] flex items-center justify-center px-5 sm:px-8 lg:px-16">
                <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row bg-[var(--surface-default)] rounded-xl lg:rounded-[var(--radius-md)] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] lg:h-[640px]">
                    
                    {/* Image Side (Left) */}
                    <div className="w-full lg:w-1/2 h-[400px] sm:h-[500px] lg:h-full relative overflow-hidden shrink-0">
                        <Image
                            src="/about-us-page/journey.webp"
                            alt="Our Journey"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>

                    {/* Text Side (Right) */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-[72px] bg-[var(--surface-default)]">
                        <div className="w-full h-full flex flex-col justify-center items-start">
                            <h2 className="text-[length:var(--typeface-heading-h1)] text-[color:var(--on-surface-default)] font-normal tracking-[-0.24px] leading-tight lg:leading-none mb-6 lg:mb-8">
                                Our Journey
                            </h2>
                            <div className="text-[length:var(--typeface-heading-subheading)] text-[color:var(--on-surface-default)] font-light leading-relaxed lg:leading-[28px] flex flex-col gap-5 lg:gap-7">
                                <p>
                                    The owners of Blue Pillar Management began investing in real estate more than 20 years ago and have a combined 35 years of hands-on experience managing their own properties. Their mission has always been to provide exceptional service to their tenants and create homes where residents feel comfortable staying long term.
                                </p>
                                <p>
                                    Because of their prompt responses, attention to detail, and commitment to tenant care, their properties have an average tenant stay of approximately five years. Over time, friends and family began requesting their help with managing their own properties, which ultimately led to the formation of Blue Pillar Management in February 2026.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Our Core Values Section — STATIC */}
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
                                    description: "What started as helping friends and family manage their properties grew into the official launch of Blue Pillar Management.",
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

            {/* 4. Contact Form Section — STATIC */}
            <section className="bg-[var(--surface-variant)] w-full px-5 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-20 lg:min-h-0 border-t border-[var(--outline-default)] lg:border-none">
                <div className="max-w-[800px] mx-auto">
                    {/* Heading */}
                    <div className="flex flex-col gap-4 mb-8 text-center sm:text-left">
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
        </div>
    );
}
