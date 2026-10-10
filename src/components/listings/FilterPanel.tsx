'use client';

import { useEffect, useState } from 'react';
import { MagnifyingGlass, SlidersHorizontal, X } from '@phosphor-icons/react';
import { PublicSelect } from '@/components/ui/public-inputs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
    AMENITY_OPTIONS,
    FURNISHING_LABELS,
    PROPERTY_TYPE_LABELS,
    type PropertyFilters,
} from '@/lib/properties';
import type { Furnishing, ListingType, PropertyType } from '@/lib/types';

interface FilterPanelProps {
    filters: PropertyFilters;
    cities: string[];
    resultCount: number;
    setFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
    toggleAmenity: (amenity: string) => void;
    clearAll: () => void;
}

const COUNT_OPTIONS = ['1', '2', '3', '4', '5'].map((n) => ({ label: `${n}+`, value: n }));
const toOptions = (labels: Record<string, string>) => Object.entries(labels).map(([value, label]) => ({ value, label }));

const LISTING_TABS: { value: ListingType | ''; label: string }[] = [
    { value: '', label: 'All' },
    { value: 'SALE', label: 'Buy' },
    { value: 'RENT', label: 'Rent' },
];

const fieldLabel = 'block mb-2 text-[length:var(--typeface-paragraph-text-s)] font-medium text-[color:var(--text-primary)]';
const numberInput =
    'w-full p-3 border border-[var(--outline-default)] rounded-[6px] bg-white text-[length:var(--typeface-paragraph-text)] outline-none focus:border-[var(--action-primary)] transition-colors aria-[invalid=true]:border-[var(--border-danger)]';

/** Text input that commits on Enter/blur (numbers) or after a short pause (search). */
function useDraft(value: string, commit: (v: string) => void, debounceMs?: number) {
    const [draft, setDraft] = useState(value);
    useEffect(() => setDraft(value), [value]);
    useEffect(() => {
        if (debounceMs === undefined || draft === value) return;
        const t = setTimeout(() => commit(draft), debounceMs);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draft, debounceMs]);
    return [draft, setDraft] as const;
}

export default function FilterPanel({ filters, cities, resultCount, setFilter, toggleAmenity, clearAll }: FilterPanelProps) {
    const [search, setSearch] = useDraft(filters.q, (v) => setFilter('q', v.trim()), 300);
    const [minPrice, setMinPrice] = useDraft(filters.minPrice, () => {});
    const [maxPrice, setMaxPrice] = useDraft(filters.maxPrice, () => {});
    const [minArea, setMinArea] = useDraft(filters.minArea, () => {});

    const priceInvalid = minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice);

    const commitNumber = (key: 'minPrice' | 'maxPrice' | 'minArea', raw: string) => {
        const cleaned = raw === '' ? '' : String(Math.max(0, Math.floor(Number(raw)) || 0));
        if (cleaned !== filters[key]) setFilter(key, cleaned);
    };

    const advancedCount =
        [filters.minPrice, filters.maxPrice, filters.beds, filters.baths, filters.minArea, filters.furnishing].filter(Boolean).length +
        filters.amenities.length;

    const cityOptions = cities.map((c) => ({ label: c, value: c }));

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div className="flex-1 relative flex items-center bg-[var(--surface-default)] border border-[var(--outline-default)] rounded-[var(--radius-sm)] h-[48px] min-w-0">
                    <MagnifyingGlass size={22} className="absolute left-3 text-[color:var(--text-secondary)] pointer-events-none" />
                    <input
                        type="search"
                        aria-label="Search by title, address or city"
                        placeholder="Search by title, address or city"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && setFilter('q', search.trim())}
                        className="w-full h-full pl-11 pr-10 text-base bg-transparent outline-none placeholder:text-[color:var(--text-placeholder)] [&::-webkit-search-cancel-button]:hidden"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setFilter('q', '');
                            }}
                            className="absolute right-3 w-[22px] h-[22px] rounded-[var(--radius-sm)] bg-[var(--surface-variant)] flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                            aria-label="Clear search"
                        >
                            <X size={12} weight="bold" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3">
                    {/* Buy / Rent */}
                    <div role="radiogroup" aria-label="Listing type" className="flex h-[48px] p-1 rounded-[var(--radius-sm)] bg-[var(--surface-default)] border border-[var(--outline-default)]">
                        {LISTING_TABS.map((tab) => {
                            const active = filters.listing === tab.value;
                            return (
                                <button
                                    key={tab.label}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => setFilter('listing', tab.value)}
                                    className={`px-4 rounded-[3px] text-[length:var(--typeface-paragraph-text-s)] font-medium transition-colors ${
                                        active
                                            ? 'bg-[var(--action-primary)] text-[color:var(--text-inverse)]'
                                            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Quick filters on wide screens */}
                    <div className="hidden xl:block w-[170px]">
                        <PublicSelect
                            aria-label="Location"
                            placeholder="Location"
                            value={filters.city}
                            options={cityOptions}
                            onChange={(e) => setFilter('city', e.target.value)}
                            onClear={() => setFilter('city', '')}
                            className="h-[48px]"
                        />
                    </div>
                    <div className="hidden xl:block w-[170px]">
                        <PublicSelect
                            aria-label="Property type"
                            placeholder="Property type"
                            value={filters.type}
                            options={toOptions(PROPERTY_TYPE_LABELS)}
                            onChange={(e) => setFilter('type', e.target.value as PropertyType)}
                            onClear={() => setFilter('type', '')}
                            className="h-[48px]"
                        />
                    </div>

                    {/* All filters */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-[48px] px-5 rounded-[var(--radius-sm)] bg-[var(--action-primary)] text-[color:var(--text-inverse)] text-[length:var(--typeface-paragraph-text-s)] font-medium hover:bg-[var(--action-primary-hover)] transition-colors"
                            >
                                <SlidersHorizontal size={18} />
                                Filters
                                {advancedCount > 0 && (
                                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-[var(--color-green-500)] text-[11px] leading-5 text-white">{advancedCount}</span>
                                )}
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-[420px] p-0 flex flex-col bg-[var(--bg-block)]">
                            <SheetHeader className="px-6 pt-6 pb-4 border-b border-[var(--outline-default)] text-left">
                                <SheetTitle className="font-display text-[32px] leading-8 font-normal">Filters</SheetTitle>
                                <SheetDescription>Combine as many as you like. Results update as you go.</SheetDescription>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
                                <div className="grid grid-cols-2 gap-3 xl:hidden">
                                    <div>
                                        <label className={fieldLabel} htmlFor="f-city">Location</label>
                                        <PublicSelect id="f-city" placeholder="Any" value={filters.city} options={cityOptions}
                                            onChange={(e) => setFilter('city', e.target.value)} onClear={() => setFilter('city', '')} />
                                    </div>
                                    <div>
                                        <label className={fieldLabel} htmlFor="f-type">Property type</label>
                                        <PublicSelect id="f-type" placeholder="Any" value={filters.type} options={toOptions(PROPERTY_TYPE_LABELS)}
                                            onChange={(e) => setFilter('type', e.target.value as PropertyType)} onClear={() => setFilter('type', '')} />
                                    </div>
                                </div>

                                <fieldset>
                                    <legend className={fieldLabel}>Price (USD)</legend>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="number" inputMode="numeric" min={0} placeholder="Min" aria-label="Minimum price"
                                            value={minPrice} aria-invalid={priceInvalid} className={numberInput}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            onBlur={() => commitNumber('minPrice', minPrice)}
                                            onKeyDown={(e) => e.key === 'Enter' && commitNumber('minPrice', minPrice)} />
                                        <input type="number" inputMode="numeric" min={0} placeholder="Max" aria-label="Maximum price"
                                            value={maxPrice} aria-invalid={priceInvalid} className={numberInput}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            onBlur={() => commitNumber('maxPrice', maxPrice)}
                                            onKeyDown={(e) => e.key === 'Enter' && commitNumber('maxPrice', maxPrice)} />
                                    </div>
                                    {priceInvalid && (
                                        <p role="alert" className="mt-2 text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-danger)]">
                                            Minimum price is higher than maximum, so nothing will match.
                                        </p>
                                    )}
                                </fieldset>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={fieldLabel} htmlFor="f-beds">Bedrooms</label>
                                        <PublicSelect id="f-beds" placeholder="Any" value={filters.beds} options={COUNT_OPTIONS}
                                            onChange={(e) => setFilter('beds', e.target.value)} onClear={() => setFilter('beds', '')} />
                                    </div>
                                    <div>
                                        <label className={fieldLabel} htmlFor="f-baths">Bathrooms</label>
                                        <PublicSelect id="f-baths" placeholder="Any" value={filters.baths} options={COUNT_OPTIONS}
                                            onChange={(e) => setFilter('baths', e.target.value)} onClear={() => setFilter('baths', '')} />
                                    </div>
                                </div>

                                <div>
                                    <label className={fieldLabel} htmlFor="f-area">Minimum area (sq ft)</label>
                                    <input id="f-area" type="number" inputMode="numeric" min={0} placeholder="e.g. 1500"
                                        value={minArea} className={numberInput}
                                        onChange={(e) => setMinArea(e.target.value)}
                                        onBlur={() => commitNumber('minArea', minArea)}
                                        onKeyDown={(e) => e.key === 'Enter' && commitNumber('minArea', minArea)} />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={fieldLabel} htmlFor="f-furnishing">Furnishing</label>
                                        <PublicSelect id="f-furnishing" placeholder="Any" value={filters.furnishing} options={toOptions(FURNISHING_LABELS)}
                                            onChange={(e) => setFilter('furnishing', e.target.value as Furnishing)} onClear={() => setFilter('furnishing', '')} />
                                    </div>
                                </div>

                                <fieldset>
                                    <legend className={fieldLabel}>Amenities</legend>
                                    <div className="flex flex-wrap gap-2">
                                        {AMENITY_OPTIONS.map((a) => {
                                            const on = filters.amenities.includes(a);
                                            return (
                                                <button key={a} type="button" aria-pressed={on} onClick={() => toggleAmenity(a)}
                                                    className={`px-3 py-1.5 rounded-full border text-[length:var(--typeface-paragraph-text-s)] transition-colors ${
                                                        on
                                                            ? 'bg-[var(--action-primary)] border-[var(--action-primary)] text-[color:var(--text-inverse)]'
                                                            : 'bg-white border-[var(--outline-default)] text-[color:var(--text-secondary)] hover:border-[var(--action-border-hover)]'
                                                    }`}>
                                                    {a}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </fieldset>
                            </div>

                            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[var(--outline-default)]">
                                <button type="button" onClick={clearAll}
                                    className="text-[length:var(--typeface-paragraph-text-s)] font-medium underline text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
                                    Clear all
                                </button>
                                <span className="text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]" aria-live="polite">
                                    {resultCount} {resultCount === 1 ? 'property' : 'properties'}
                                </span>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
}
