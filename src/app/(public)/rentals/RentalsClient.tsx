'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CaretDown, CaretRight, ListBullets, SquaresFour, ArrowLeft, ArrowRight, WarningCircle } from '@phosphor-icons/react';
import { Property } from '@/lib/types';
import { applyFilters, getActiveFilterChips, SORT_OPTIONS, type SortKey } from '@/lib/properties';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import PropertyGrid from '@/components/listings/PropertyGrid';
import FilterPanel from '@/components/listings/FilterPanel';
import ActiveFilterChips from '@/components/listings/ActiveFilterChips';

const PAGE_SIZE = 9;

interface RentalsClientProps {
    properties: Property[];
    loadError?: boolean;
}

export default function RentalsClient({ properties, loadError = false }: RentalsClientProps) {
    const { filters, setFilter, toggleAmenity, removeChip, clearAll } = usePropertyFilters();
    const [page, setPage] = useState(1);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

    const cities = useMemo(() => Array.from(new Set(properties.map((p) => p.city).filter(Boolean))).sort(), [properties]);
    const results = useMemo(() => applyFilters(properties, filters), [properties, filters]);
    const chips = useMemo(() => getActiveFilterChips(filters), [filters]);

    // Back to page 1 whenever the result set changes
    useEffect(() => setPage(1), [filters]);

    const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleSortChange = (key: SortKey) => {
        setFilter('sort', key);
        setShowSortMenu(false);
    };

    const goToPage = (next: number) => {
        setPage(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="bg-[var(--surface-variant)] min-h-screen pt-[var(--header-height)]">
            <div className="px-5 sm:px-8 lg:px-16 py-4 sm:py-6 lg:py-8 max-w-[1440px] mx-auto">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 text-[length:var(--typeface-paragraph-text)] leading-6">
                        <Link href="/" className="text-[color:var(--on-surface-default)] hover:underline hover:opacity-80 transition-all">
                            Home
                        </Link>
                        <CaretRight size={16} className="text-[color:var(--on-surface-default)] opacity-60" />
                        <span className="text-[color:var(--on-surface-default)] font-normal opacity-60">Properties</span>
                    </div>
                </nav>

                <div className="pb-4">
                    <h1 className="text-[length:var(--typeface-heading-h1)] font-normal text-[color:var(--on-surface-default)]">
                        Find your next property
                    </h1>
                </div>

                {/* Filters — sticky below navbar */}
                <div className="sticky top-[var(--header-height)] z-30 bg-[var(--surface-variant)] py-2 -mx-5 sm:-mx-8 lg:-mx-16 px-5 sm:px-8 lg:px-16">
                    <FilterPanel
                        filters={filters}
                        cities={cities}
                        resultCount={results.length}
                        setFilter={setFilter}
                        toggleAmenity={toggleAmenity}
                        clearAll={clearAll}
                    />
                </div>

                {/* Result count, chips, sort, view */}
                <div className="flex flex-col gap-3 pt-4">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-[length:var(--typeface-paragraph-text)] text-[color:var(--text-secondary)]" aria-live="polite">
                            <span className="font-medium text-[color:var(--text-primary)]">{results.length}</span>{' '}
                            {results.length === 1 ? 'property' : 'properties'} found
                        </p>

                        <div className="flex items-center gap-3 sm:gap-6">
                            {/* Sort */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowSortMenu(!showSortMenu)}
                                    aria-haspopup="listbox"
                                    aria-expanded={showSortMenu}
                                    className="flex items-center gap-2 text-[length:var(--typeface-paragraph-text)] text-[color:var(--on-surface-variant)] hover:text-[color:var(--text-primary)]"
                                >
                                    <span className="hidden sm:inline">Sort:</span>
                                    <span className="text-[color:var(--text-primary)]">{SORT_OPTIONS[filters.sort]}</span>
                                    <CaretDown size={18} />
                                </button>
                                {showSortMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                                        <ul role="listbox" aria-label="Sort properties" className="absolute right-0 top-full mt-2 w-[210px] py-1 bg-[var(--surface-default)] border border-[var(--outline-default)] rounded-[var(--radius-sm)] shadow-lg z-50">
                                            {(Object.keys(SORT_OPTIONS) as SortKey[]).map((key) => (
                                                <li key={key}>
                                                    <button
                                                        type="button"
                                                        role="option"
                                                        aria-selected={filters.sort === key}
                                                        onClick={() => handleSortChange(key)}
                                                        className={`block w-full text-left px-4 py-2.5 text-[length:var(--typeface-paragraph-text-s)] transition-colors ${
                                                            filters.sort === key
                                                                ? 'bg-[var(--surface-variant)] text-[color:var(--on-surface-default)] font-medium'
                                                                : 'text-[color:var(--on-surface-variant)] hover:bg-[var(--surface-variant)]'
                                                        }`}
                                                    >
                                                        {SORT_OPTIONS[key]}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>

                            {/* View toggle */}
                            <div className="hidden sm:flex gap-2" role="group" aria-label="Layout">
                                {([
                                    ['list', ListBullets, 'List view'],
                                    ['grid', SquaresFour, 'Grid view'],
                                ] as const).map(([mode, Icon, label]) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        aria-label={label}
                                        aria-pressed={viewMode === mode}
                                        onClick={() => setViewMode(mode)}
                                        className={`flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] border transition-colors ${
                                            viewMode === mode
                                                ? 'bg-[var(--surface-container-primary)] text-[color:var(--on-surface-inverse)] border-[var(--surface-container-primary)]'
                                                : 'bg-[var(--surface-default)] text-[color:var(--on-surface-variant)]'
                                        }`}
                                    >
                                        <Icon size={22} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <ActiveFilterChips chips={chips} onRemove={removeChip} onClearAll={clearAll} />
                </div>

                {/* Results */}
                {loadError ? (
                    <div role="alert" className="mt-8 flex flex-col items-center text-center gap-3 py-16 px-6 bg-[var(--bg-block)] rounded-[var(--radius-md)]">
                        <WarningCircle size={40} className="text-[color:var(--text-danger)]" />
                        <p className="text-[length:var(--typeface-heading-subheading)] text-[color:var(--text-primary)]">We couldn&apos;t load properties right now.</p>
                        <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-2">Try again</button>
                    </div>
                ) : (
                    <PropertyGrid
                        properties={pageItems}
                        viewMode={viewMode}
                        totalCount={results.length}
                        hasFilters={chips.length > 0}
                        onClearFilters={clearAll}
                    />
                )}

                {/* Pagination */}
                {!loadError && results.length > PAGE_SIZE && (
                    <nav aria-label="Pagination" className="mt-8">
                        <div className="flex items-center justify-between border-t border-[var(--outline-default)] py-3">
                            <button
                                type="button"
                                aria-label="Previous page"
                                onClick={() => goToPage(Math.max(1, page - 1))}
                                disabled={page <= 1}
                                className="p-1 text-[color:var(--on-surface-variant)] disabled:opacity-30 hover:text-[color:var(--on-surface-default)] transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <p className="text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-variant)]">
                                Page {page} of {totalPages}
                            </p>
                            <button
                                type="button"
                                aria-label="Next page"
                                onClick={() => goToPage(Math.min(totalPages, page + 1))}
                                disabled={page >= totalPages}
                                className="p-1 text-[color:var(--on-surface-variant)] disabled:opacity-30 hover:text-[color:var(--on-surface-default)] transition-colors"
                            >
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    </nav>
                )}
            </div>
        </section>
    );
}
