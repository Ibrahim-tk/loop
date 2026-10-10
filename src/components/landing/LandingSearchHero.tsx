'use client';

import { useState } from 'react';
import { usePrefs } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass } from '@phosphor-icons/react';
import HeroVideo from '@/components/landing/HeroVideo';
import { DEFAULT_FILTERS, filtersToParams, PROPERTY_TYPE_LABELS } from '@/lib/properties';
import type { ListingType, PropertyType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const PRICE_STEPS: Record<ListingType, number[]> = {
    RENT: [75000, 150000, 250000, 400000, 650000],
    SALE: [20000000, 50000000, 100000000, 200000000, 350000000],
};

const fieldClass =
    'h-12 w-full rounded-[6px] border border-[var(--outline-default)] bg-white px-3 text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--on-surface-default)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--action-primary)]';

interface LandingSearchHeroProps {
    cities: string[];
    types: PropertyType[];
}

export default function LandingSearchHero({ cities, types }: LandingSearchHeroProps) {
    usePrefs(); // re-render when currency / area unit changes
    const router = useRouter();
    const [listing, setListing] = useState<ListingType>('RENT');
    const [city, setCity] = useState('');
    const [type, setType] = useState<PropertyType | ''>('');
    const [maxPrice, setMaxPrice] = useState('');
    const [beds, setBeds] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = filtersToParams({ ...DEFAULT_FILTERS, listing, city, type, maxPrice, beds });
        router.push(`/rentals?${params.toString()}`);
    };

    const switchListing = (next: ListingType) => {
        setListing(next);
        setMaxPrice(''); // rent and sale prices don't share a scale
    };

    return (
        <section className="relative w-full min-h-[512px] h-[68dvh] overflow-hidden">
            <HeroVideo />

            <div className="relative z-10 h-full px-5 sm:px-8 lg:px-16 pt-[80px]">
                <div className="mx-auto w-full max-w-[var(--content-max)] h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-white text-[length:var(--typeface-display-base)] font-normal leading-none tracking-[-0.8px] max-w-[900px]">
                    Find your next home
                </h1>

                <form onSubmit={onSubmit} className="mt-8 w-full max-w-[1040px] text-left bg-white rounded-[8px] p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                    <div role="radiogroup" aria-label="Buy or rent" className="inline-flex p-1 mb-4 rounded-[6px] bg-[var(--surface-variant)]">
                        {(['RENT', 'SALE'] as const).map((value) => (
                            <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={listing === value}
                                onClick={() => switchListing(value)}
                                className={cn(
                                    'h-10 px-6 rounded-[4px] text-[length:var(--typeface-paragraph-text-s)] font-medium transition-colors',
                                    listing === value ? 'bg-[var(--on-surface-primary)] text-white' : 'text-[color:var(--on-surface-default)] hover:bg-white',
                                )}
                            >
                                {value === 'RENT' ? 'Rent' : 'Buy'}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] gap-3">
                        <select aria-label="Area" value={city} onChange={(e) => setCity(e.target.value)} className={cn(fieldClass, 'col-span-2 lg:col-span-1')}>
                            <option value="">All areas</option>
                            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select aria-label="Property type" value={type} onChange={(e) => setType(e.target.value as PropertyType | '')} className={fieldClass}>
                            <option value="">Any type</option>
                            {types.map((t) => <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>)}
                        </select>
                        <select aria-label="Maximum price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={fieldClass}>
                            <option value="">Any price</option>
                            {PRICE_STEPS[listing].map((p) => (
                                <option key={p} value={p}>Up to {formatPrice(p)}{listing === 'RENT' ? '/mo' : ''}</option>
                            ))}
                        </select>
                        <select aria-label="Bedrooms" value={beds} onChange={(e) => setBeds(e.target.value)} className={cn(fieldClass, 'col-span-2 lg:col-span-1')}>
                            <option value="">Any beds</option>
                            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ beds</option>)}
                        </select>
                        <button
                            type="submit"
                            className="col-span-2 lg:col-span-1 h-12 px-8 inline-flex items-center justify-center gap-2 rounded-[6px] bg-[var(--on-surface-primary)] text-white text-[length:var(--typeface-paragraph-text-s)] font-medium hover:bg-[var(--foundation-blue-blue-7)] transition-colors"
                        >
                            <MagnifyingGlass size={18} weight="bold" />
                            Search
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </section>
    );
}
