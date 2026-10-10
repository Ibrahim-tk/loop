'use client';

import { useEffect, useState } from 'react';
import { MagnifyingGlass, Minus, Plus, X } from '@phosphor-icons/react';
import {
    AMENITY_OPTIONS,
    FURNISHING_LABELS,
    PROPERTY_TYPE_LABELS,
    PUBLIC_STATUSES,
    STATUS_LABELS,
    type PropertyFilters,
} from '@/lib/properties';
import { SQFT_PER_KANAL, SQFT_PER_MARLA } from '@/lib/utils';
import type { Furnishing, ListingType, Property, PropertyStatus, PropertyType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
    filters: PropertyFilters;
    properties: Property[];
    setFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
    toggleAmenity: (amenity: string) => void;
    clearAll: () => void;
    activeCount: number;
}

const LISTING_OPTIONS: { value: ListingType | ''; label: string }[] = [
    { value: '', label: 'All' },
    { value: 'SALE', label: 'Buy' },
    { value: 'RENT', label: 'Rent' },
];
const COUNT_OPTIONS = ['', '1', '2', '3', '4', '5'];
const AREA_OPTIONS = [
    { value: '', label: 'Any' },
    { value: String(5 * SQFT_PER_MARLA), label: '5+ Marla' },
    { value: String(10 * SQFT_PER_MARLA), label: '10+ Marla' },
    { value: String(SQFT_PER_KANAL), label: '1+ Kanal' },
    { value: String(2 * SQFT_PER_KANAL), label: '2+ Kanal' },
];

const chip = (on: boolean) =>
    cn(
        'h-9 px-3.5 rounded-full border text-[length:var(--typeface-paragraph-text-s)] transition-colors',
        on
            ? 'bg-[var(--action-primary)] border-[var(--action-primary)] text-[color:var(--text-inverse)]'
            : 'bg-white border-[var(--outline-default)] text-[color:var(--text-primary)] hover:border-[var(--action-border-hover)]',
    );
const numberInput =
    'w-full h-11 px-3 border border-[var(--outline-default)] rounded-[8px] bg-white text-[length:var(--typeface-paragraph-text-s)] outline-none focus:border-[var(--action-primary)] transition-colors aria-[invalid=true]:border-[var(--border-danger)]';

/** Collapsible group; open by default so every filter is visible at a glance. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    return (
        <section className="border-t border-[var(--outline-default)] py-5">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                className="w-full flex items-center justify-between text-left text-[length:var(--typeface-paragraph-text)] font-semibold text-[color:var(--text-primary)]"
            >
                {title}
                {open ? <Minus size={18} /> : <Plus size={18} />}
            </button>
            {open && <div className="mt-4">{children}</div>}
        </section>
    );
}

/** Single-choice list with counts, like a radio list you can click off again. */
function OptionList({
    options,
    value,
    onChange,
}: {
    options: { value: string; label: string; count: number }[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <ul className="flex flex-col gap-1">
            {options.map((o) => {
                const on = value === o.value;
                return (
                    <li key={o.value}>
                        <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => onChange(on ? '' : o.value)}
                            className={cn(
                                'w-full flex items-center gap-3 px-2 py-2 rounded-[6px] text-left text-[length:var(--typeface-paragraph-text-s)] transition-colors',
                                on ? 'bg-[var(--surface-variant)] font-medium' : 'hover:bg-[var(--surface-variant)]',
                            )}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    'size-[18px] shrink-0 rounded-[4px] border flex items-center justify-center',
                                    on ? 'bg-[var(--action-primary)] border-[var(--action-primary)]' : 'border-[var(--outline-default)] bg-white',
                                )}
                            >
                                {on && <span className="size-2 rounded-[1px] bg-white" />}
                            </span>
                            <span className="flex-1 text-[color:var(--text-primary)]">{o.label}</span>
                            <span className="text-[color:var(--text-secondary)]">{o.count}</span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

function countBy<T extends string>(properties: Property[], key: (p: Property) => T | undefined) {
    const counts = new Map<T, number>();
    properties.forEach((p) => {
        const v = key(p);
        if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
    });
    return counts;
}

export default function FilterSidebar({ filters, properties, setFilter, toggleAmenity, clearAll, activeCount }: FilterSidebarProps) {
    // Text inputs keep a local draft and commit after a pause / on blur
    const [search, setSearch] = useState(filters.q);
    const [minPrice, setMinPrice] = useState(filters.minPrice);
    const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
    useEffect(() => setSearch(filters.q), [filters.q]);
    useEffect(() => setMinPrice(filters.minPrice), [filters.minPrice]);
    useEffect(() => setMaxPrice(filters.maxPrice), [filters.maxPrice]);
    useEffect(() => {
        if (search === filters.q) return;
        const t = setTimeout(() => setFilter('q', search.trim()), 300);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const commitPrice = (key: 'minPrice' | 'maxPrice', raw: string) => {
        const cleaned = raw === '' ? '' : String(Math.max(0, Math.floor(Number(raw)) || 0));
        if (cleaned !== filters[key]) setFilter(key, cleaned);
    };
    const priceInvalid = minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice);

    const cityCounts = countBy(properties, (p) => p.city);
    const typeCounts = countBy(properties, (p) => p.property_type);
    const cities = Array.from(cityCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([value, count]) => ({ value, label: value, count }));
    const types = Array.from(typeCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([value, count]) => ({ value, label: PROPERTY_TYPE_LABELS[value], count }));

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between pb-4">
                <h2 className="text-[length:var(--typeface-heading-h4)] font-semibold text-[color:var(--text-primary)]">Filters</h2>
                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="text-[length:var(--typeface-paragraph-text-s)] font-medium underline text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                    >
                        Clear all ({activeCount})
                    </button>
                )}
            </div>

            {/* Search */}
            <div className="relative mb-5">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-secondary)] pointer-events-none" />
                <input
                    type="search"
                    aria-label="Search by title, address or city"
                    placeholder="Search title, address, city"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-11 pl-10 pr-9 rounded-[8px] border border-[var(--outline-default)] bg-white text-[length:var(--typeface-paragraph-text-s)] outline-none focus:border-[var(--action-primary)] [&::-webkit-search-cancel-button]:hidden"
                />
                {search && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => {
                            setSearch('');
                            setFilter('q', '');
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 size-6 rounded-full flex items-center justify-center text-[color:var(--text-secondary)] hover:bg-[var(--surface-variant)]"
                    >
                        <X size={12} weight="bold" />
                    </button>
                )}
            </div>

            <Section title="Buy or rent">
                <div role="radiogroup" aria-label="Buy or rent" className="grid grid-cols-3 p-1 rounded-[8px] bg-[var(--surface-variant)]">
                    {LISTING_OPTIONS.map((o) => (
                        <button
                            key={o.label}
                            type="button"
                            role="radio"
                            aria-checked={filters.listing === o.value}
                            onClick={() => setFilter('listing', o.value)}
                            className={cn(
                                'h-9 rounded-[6px] text-[length:var(--typeface-paragraph-text-s)] font-medium transition-colors',
                                filters.listing === o.value ? 'bg-white shadow-sm text-[color:var(--text-primary)]' : 'text-[color:var(--text-secondary)]',
                            )}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            </Section>

            {cities.length > 0 && (
                <Section title="Location">
                    <OptionList options={cities} value={filters.city} onChange={(v) => setFilter('city', v)} />
                </Section>
            )}

            {types.length > 0 && (
                <Section title="Property type">
                    <OptionList options={types} value={filters.type} onChange={(v) => setFilter('type', v as PropertyType | '')} />
                </Section>
            )}

            <Section title="Price (PKR)">
                <div className="grid grid-cols-2 gap-2">
                    {(['minPrice', 'maxPrice'] as const).map((key) => (
                        <input
                            key={key}
                            type="number"
                            inputMode="numeric"
                            min={0}
                            placeholder={key === 'minPrice' ? 'Min' : 'Max'}
                            aria-label={key === 'minPrice' ? 'Minimum price' : 'Maximum price'}
                            aria-invalid={priceInvalid}
                            value={key === 'minPrice' ? minPrice : maxPrice}
                            onChange={(e) => (key === 'minPrice' ? setMinPrice : setMaxPrice)(e.target.value)}
                            onBlur={(e) => commitPrice(key, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && commitPrice(key, e.currentTarget.value)}
                            className={numberInput}
                        />
                    ))}
                </div>
                {priceInvalid && (
                    <p role="alert" className="mt-2 text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-danger)]">
                        Min is higher than max, so nothing will match.
                    </p>
                )}
            </Section>

            {(['beds', 'baths'] as const).map((key) => (
                <Section key={key} title={key === 'beds' ? 'Bedrooms' : 'Bathrooms'}>
                    <div className="flex flex-wrap gap-2">
                        {COUNT_OPTIONS.map((n) => (
                            <button key={n || 'any'} type="button" aria-pressed={filters[key] === n} onClick={() => setFilter(key, n)} className={chip(filters[key] === n)}>
                                {n ? `${n}+` : 'Any'}
                            </button>
                        ))}
                    </div>
                </Section>
            ))}

            <Section title="Area">
                <div className="flex flex-wrap gap-2">
                    {AREA_OPTIONS.map((o) => (
                        <button key={o.label} type="button" aria-pressed={filters.minArea === o.value} onClick={() => setFilter('minArea', o.value)} className={chip(filters.minArea === o.value)}>
                            {o.label}
                        </button>
                    ))}
                </div>
            </Section>

            <Section title="Furnishing">
                <div className="flex flex-wrap gap-2">
                    {(Object.entries(FURNISHING_LABELS) as [Furnishing, string][]).map(([value, label]) => {
                        const on = filters.furnishing === value;
                        return (
                            <button key={value} type="button" aria-pressed={on} onClick={() => setFilter('furnishing', on ? '' : value)} className={chip(on)}>
                                {label}
                            </button>
                        );
                    })}
                </div>
            </Section>

            <Section title="Status">
                <div className="flex flex-wrap gap-2">
                    {PUBLIC_STATUSES.map((value) => {
                        const on = filters.status === value;
                        return (
                            <button key={value} type="button" aria-pressed={on} onClick={() => setFilter('status', on ? '' : (value as PropertyStatus))} className={chip(on)}>
                                {STATUS_LABELS[value]}
                            </button>
                        );
                    })}
                </div>
            </Section>

            <Section title="Amenities">
                <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map((a) => {
                        const on = filters.amenities.includes(a);
                        return (
                            <button key={a} type="button" aria-pressed={on} onClick={() => toggleAmenity(a)} className={chip(on)}>
                                {a}
                            </button>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}
