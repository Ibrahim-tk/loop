'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { Property } from '@/lib/types';
import PropertyCard from '@/components/listings/PropertyCard';

interface LandingPropertiesProps {
    initialProperties: Property[];
}

export default function LandingProperties({ initialProperties }: LandingPropertiesProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 440;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    if (!initialProperties || initialProperties.length === 0) {
        return null;
    }

    return (
        <section className="bg-[var(--surface-variant)] w-full py-12 sm:py-16 lg:py-20">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 px-5 sm:px-8 lg:px-10 mb-10 lg:mb-12 items-start sm:items-end justify-between">
                <div className="flex flex-col gap-3 max-w-[637px]">
                    <h2 className="text-[length:var(--typeface-heading-h1)] font-normal leading-none tracking-[-0.24px] text-[color:var(--on-surface-default)]">
                        Find Your Next Home
                    </h2>
                    <p className="font-light text-[length:var(--typeface-heading-subheading)] leading-7 text-[color:var(--on-surface-default)]">
                        Browse our carefully managed, high-quality rental properties.
                    </p>
                </div>
                <div className="flex gap-6 items-center shrink-0">
                    <Link
                        href="/properties"
                        className="bg-[var(--on-surface-primary)] flex items-center justify-center px-[22.5px] py-[15px] rounded-[6px] text-[length:var(--typeface-paragraph-text-s)] font-medium text-white leading-normal min-w-[80px] hover:bg-[var(--foundation-blue-blue-7)] transition-colors"
                    >
                        View all
                    </Link>
                    <div className="flex gap-3 items-center">
                        <button
                            onClick={() => scroll('left')}
                            className="bg-white border border-[var(--outline-default)] rounded-[4px] flex items-center justify-center size-12 hover:bg-gray-50 transition-colors"
                            aria-label="Scroll left"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="bg-white border border-[var(--outline-default)] rounded-[4px] flex items-center justify-center size-12 hover:bg-gray-50 transition-colors"
                            aria-label="Scroll right"
                        >
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Horizontally scrollable property cards */}
            <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-5 pl-5 sm:pl-8 lg:pl-10 pr-5 sm:pr-8 lg:pr-10 w-max pb-8">
                    {initialProperties.map((property, index) => {
                        const popularLimit = initialProperties.length <= 5 ? 2 : 3;
                        return (
                            <div
                                key={property.id}
                                className="w-[85vw] sm:w-[390px] lg:w-[424px] shrink-0 transition-transform duration-300 hover:-translate-y-0.5 rounded-[8px]"
                            >
                                <PropertyCard property={property} viewMode="grid" isPopular={index < popularLimit} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
