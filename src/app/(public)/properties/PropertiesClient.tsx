'use client';

import { useEffect, useMemo, useState } from 'react';
import Icon3D from '@/components/ui/Icon3D';
import { usePrefs } from '@/lib/store';
import Link from 'next/link';
import { CaretDown, CaretRight, ListBullets, SquaresFour, ArrowLeft, ArrowRight, WarningCircle, SlidersHorizontal } from '@phosphor-icons/react';
import { Property } from '@/lib/types';
import { applyFilters, getActiveFilterChips, PROPERTY_TYPE_LABELS, SORT_OPTIONS, type SortKey } from '@/lib/properties';
import type { PropertyType } from '@/lib/types';
import { usePropertyFilters } from '@/hooks/usePropertyFilters';
import PropertyGrid from '@/components/listings/PropertyGrid';
import FilterSidebar from '@/components/listings/FilterSidebar';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import ActiveFilterChips from '@/components/listings/ActiveFilterChips';

const PAGE_SIZE = 9;

interface PropertiesClientProps {
    properties: Property[];
    loadError?: boolean;
}

export default function PropertiesClient({ properties, loadError = false }: PropertiesClientProps) {
    usePrefs(); // re-render when currency / area unit changes
    const { filters, setFilter, toggleAmenity, removeChip, clearAll } = usePropertyFilters();
    const [page, setPage] = useState(1);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

    const [filtersOpen, setFiltersOpen] = useState(false);
    // Quick category strip above the results, most common type first
    const typeCounts = useMemo(() => {
        const counts = new Map<PropertyType, number>();
        properties.forEach((p) => p.property_type && counts.set(p.property_type, (counts.get(p.property_type) ?? 0) + 1));
        return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    }, [properties]);
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
            <div className="px-5 sm:px-8 lg:px-16 pt-6 sm:pt-8 lg:pt-10 pb-[var(--section-y)] max-w-[1440px] mx-auto">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 text-[length:var(--typeface-paragraph-text)] leading-6">
                        <Link href="/" className="text-[color:var(--on-surface-default)] hover:underline hover:opacity-80 transition-all">
                            Home
                        </Link>
                        <CaretRight size={16} className="text-[color:var(--on-surface-default)] opacity-60" />
                        <span className="text-[color:var(--on-surface-default)] font-normal opacity-60">Properties</span>
                    </div>
                </nav>

                <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 xl:gap-12">
                    {/* Sidebar — sticky under the floating navbar, scrolls on its own if taller than the screen */}
                    <aside className="hidden lg:block sticky top-[calc(var(--header-height)+16px)] self-start max-h-[calc(100dvh-var(--header-height)-32px)] overflow-y-auto pr-2 -mr-2 [scrollbar-width:thin]">
                        <FilterSidebar filters={filters} properties={properties} setFilter={setFilter} toggleAmenity={toggleAmenity} clearAll={clearAll} activeCount={chips.length} />
                    </aside>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pb-5">
                            <h1 className="text-[length:var(--typeface-heading-h1)] font-normal leading-none text-[color:var(--on-surface-default)]">
                                Properties
                            </h1>
                            <p className="text-[length:var(--typeface-paragraph-text)] text-[color:var(--text-secondary)]" aria-live="polite">
                                <span className="font-medium text-[color:var(--text-primary)]">{results.length}</span>{' '}
                                {results.length === 1 ? 'result' : 'results'}
                            </p>
                        </div>

                        {/* Quick type strip */}
                        {typeCounts.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-hide">
                                {[['', 'All', properties.length] as const, ...typeCounts.map(([t, n]) => [t, PROPERTY_TYPE_LABELS[t], n] as const)].map(([value, label, n]) => {
                                    const on = filters.type === value;
                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            aria-pressed={on}
                                            onClick={() => setFilter('type', value as PropertyType | '')}
                                            className={cn(
                                                'shrink-0 h-11 px-4 rounded-[8px] border text-[length:var(--typeface-paragraph-text-s)] font-medium whitespace-nowrap transition-colors',
                                                on
                                                    ? 'bg-[var(--action-primary)] border-[var(--action-primary)] text-white'
                                                    : 'bg-white border-[var(--outline-default)] text-[color:var(--text-primary)] hover:border-[var(--action-border-hover)]',
                                            )}
                                        >
                                            {label} <span className={on ? 'text-white/70' : 'text-[color:var(--text-secondary)]'}>{n}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Toolbar: mobile filters, sort, view */}
                        <div className="sticky lg:static top-[calc(var(--header-height)+8px)] z-30 flex items-center justify-between gap-3 py-3 border-y border-[var(--outline-default)] bg-[var(--surface-variant)]">
                            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                                <SheetTrigger asChild>
                                    <button
                                        type="button"
                                        className="lg:hidden flex items-center gap-2 h-10 px-4 rounded-[8px] bg-[var(--action-primary)] text-white text-[length:var(--typeface-paragraph-text-s)] font-medium"
                                    >
                                        <SlidersHorizontal size={18} />
                                        Filters
                                        {chips.length > 0 && <span className="min-w-5 h-5 px-1.5 rounded-full bg-[var(--color-green-500)] text-[11px] leading-5">{chips.length}</span>}
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-full sm:max-w-[400px] p-0 flex flex-col bg-[var(--bg-block)]">
                                    <SheetTitle className="sr-only">Filters</SheetTitle>
                                    <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4">
                                        <FilterSidebar filters={filters} properties={properties} setFilter={setFilter} toggleAmenity={toggleAmenity} clearAll={clearAll} activeCount={chips.length} />
                                    </div>
                                    <div className="p-4 border-t border-[var(--outline-default)]">
                                        <button type="button" onClick={() => setFiltersOpen(false)} className="w-full h-12 rounded-[8px] bg-[var(--action-primary)] text-white font-medium">
                                            Show {results.length} {results.length === 1 ? 'result' : 'results'}
                                        </button>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            <div className="flex items-center gap-3 sm:gap-6 ml-auto">
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
                            <div className="flex gap-2" role="group" aria-label="Layout">
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

                        <div className="pt-4">
                            <ActiveFilterChips chips={chips} onRemove={removeChip} onClearAll={clearAll} />
                        </div>

                {/* Results */}
                {loadError ? (
                    <div role="alert" className="blur-rise mt-8 flex flex-col items-center text-center gap-3 py-16 px-6 bg-[var(--bg-block)] rounded-[var(--radius-md)]">
                        <Icon3D name="warning" size={96} className="mb-2" />
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
                </div>
            </div>
        </section>
    );
}
