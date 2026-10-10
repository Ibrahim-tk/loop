'use client';

import { useState } from 'react';
import { usePrefs } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { CaretDown, MagnifyingGlass } from '@phosphor-icons/react';
import HeroVideo from '@/components/landing/HeroVideo';
import { DEFAULT_FILTERS, filtersToParams, PROPERTY_TYPE_LABELS } from '@/lib/properties';
import type { ListingType, PropertyType } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

const PRICE_STEPS: Record<ListingType, number[]> = {
    RENT: [75000, 150000, 250000, 400000, 650000],
    SALE: [20000000, 50000000, 100000000, 200000000, 350000000],
};

const TABS: { value: ListingType | ''; label: string }[] = [
    { value: '', label: 'All' },
    { value: 'SALE', label: 'Buy' },
    { value: 'RENT', label: 'Rent' },
];

// Underlined select with a custom caret, like a form line in a printed brochure
const selectClass =
    'peer h-10 w-full appearance-none bg-transparent pr-7 border-0 border-b border-dashed border-[var(--outline-default)] text-[length:var(--typeface-paragraph-text)] text-[color:var(--on-surface-default)] cursor-pointer transition-colors hover:border-[var(--on-surface-variant)] focus:outline-none focus:border-solid focus:border-[var(--action-primary)] disabled:cursor-not-allowed disabled:text-[color:var(--text-tertiary)]';

function Field({ label, id, className, children }: { label: string; id: string; className?: string; children: React.ReactNode }) {
    return (
        <div className={cn('flex flex-col gap-1 min-w-0', className)}>
            <label htmlFor={id} className="text-[length:var(--typeface-paragraph-text)] text-[color:var(--on-surface-default)]">
                {label}
            </label>
            <div className="relative">
                {children}
                <CaretDown size={16} aria-hidden="true"
                    className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[color:var(--on-surface-variant)]" />
            </div>
        </div>
    );
}

interface LandingSearchHeroProps {
    cities: string[];
    types: PropertyType[];
}

export default function LandingSearchHero({ cities, types }: LandingSearchHeroProps) {
    usePrefs(); // re-render when currency / area unit changes
    const router = useRouter();
    const [listing, setListing] = useState<ListingType | ''>('');
    const [city, setCity] = useState('');
    const [type, setType] = useState<PropertyType | ''>('');
    const [maxPrice, setMaxPrice] = useState('');
    const [beds, setBeds] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = filtersToParams({ ...DEFAULT_FILTERS, listing, city, type, maxPrice, beds });
        router.push(`/properties?${params.toString()}`);
    };

    const switchListing = (next: ListingType | '') => {
        setListing(next);
        setMaxPrice(''); // rent and sale prices don't share a scale
    };

    return (
        <section className="relative w-full min-h-[600px] h-[100dvh] overflow-hidden">
            <HeroVideo />

            <div className="relative z-10 h-full px-5 sm:px-8 lg:px-16 pt-[80px]">
                <div className="mx-auto w-full max-w-[var(--content-max)] h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-white text-[length:var(--typeface-display-base)] font-normal leading-none tracking-[-0.8px] max-w-[900px]">
                    Find your next home
                </h1>
                <p className="mt-4 max-w-[520px] text-white/85 text-[length:var(--typeface-paragraph-text)] leading-[1.5]">
                    Homes for rent and sale across Punjab and beyond, every listing checked by our team. Book a free viewing in minutes.
                </p>

                <form onSubmit={onSubmit} className="mt-8 w-full max-w-[1040px] text-left">
                    {/* Bookmark tabs: active is solid green, the rest are frosted glass */}
                    <div role="radiogroup" aria-label="Buy or rent" className="flex items-end gap-1.5 pl-4">
                        {TABS.map((tab) => {
                            const active = listing === tab.value;
                            return (
                                <button
                                    key={tab.label}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => switchListing(tab.value)}
                                    className={cn(
                                        'relative min-w-[84px] px-5 rounded-t-[10px] text-[length:var(--typeface-paragraph-text-s)] font-medium transition-all duration-300',
                                        active
                                            ? 'h-11 bg-[var(--color-green-500)] text-white'
                                            : 'h-10 bg-white/20 text-white backdrop-blur-[40px] backdrop-saturate-200 backdrop-brightness-110 hover:bg-white/30',
                                    )}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="bg-[var(--surface-default)] rounded-[12px] p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.14)]">
                        <div className="grid grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_1.1fr_auto] gap-x-6 gap-y-5 items-end">
                            <Field label="Location" id="hs-city" className="col-span-2 lg:col-span-1">
                                <select id="hs-city" value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
                                    <option value="">All areas</option>
                                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </Field>
                            <Field label="Property type" id="hs-type">
                                <select id="hs-type" value={type} onChange={(e) => setType(e.target.value as PropertyType | '')} className={selectClass}>
                                    <option value="">Any</option>
                                    {types.map((t) => <option key={t} value={t}>{PROPERTY_TYPE_LABELS[t]}</option>)}
                                </select>
                            </Field>
                            <Field label="Bedrooms" id="hs-beds">
                                <select id="hs-beds" value={beds} onChange={(e) => setBeds(e.target.value)} className={selectClass}>
                                    <option value="">Any</option>
                                    {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+</option>)}
                                </select>
                            </Field>
                            <Field label="Max price" id="hs-price" className="col-span-2 lg:col-span-1">
                                <select id="hs-price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                                    disabled={!listing} title={listing ? undefined : 'Choose Buy or Rent to set a price'} className={selectClass}>
                                    <option value="">{listing ? 'Any' : 'Pick Buy or Rent'}</option>
                                    {listing && PRICE_STEPS[listing].map((p) => (
                                        <option key={p} value={p}>Up to {formatPrice(p)}{listing === 'RENT' ? '/mo' : ''}</option>
                                    ))}
                                </select>
                            </Field>
                            <button
                                type="submit"
                                className="btn-primary h-11 self-end col-span-2 lg:col-span-1 bg-[var(--color-green-500)] hover:bg-[var(--color-green-600)]"
                            >
                                <MagnifyingGlass size={18} weight="bold" />
                                Search properties
                            </button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
        </section>
    );
}
