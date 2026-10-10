'use client';

import Image from 'next/image';
import Icon3D from '@/components/ui/Icon3D';
import { usePrefs } from '@/lib/store';
import Link from 'next/link';
import { CaretRight, Check, Info, Minus, Scales, WarningCircle, X } from '@phosphor-icons/react';
import { usePropertiesByIds } from '@/hooks/usePropertiesByIds';
import { MAX_COMPARE, useSavedHydrated, useSavedProperties } from '@/stores/savedProperties';
import {
    formatArea,
    formatListingPrice,
    FURNISHING_LABELS,
    LISTING_TYPE_LABELS,
    PROPERTY_TYPE_LABELS,
    STATUS_LABELS,
} from '@/lib/properties';
import { formatPrice, SQFT_PER_MARLA } from '@/lib/utils';
import type { Property } from '@/lib/types';

interface Row {
    label: string;
    render: (p: Property) => React.ReactNode;
    /** Numeric value used to highlight the best column. */
    score?: (p: Property) => number;
    best?: 'min' | 'max';
    /** Only highlight when every property shares a listing type (rent vs sale prices aren't comparable). */
    sameListingOnly?: boolean;
}

const ROWS: Row[] = [
    { label: 'Listing', render: (p) => LISTING_TYPE_LABELS[p.listing_type] },
    {
        label: 'Price',
        render: (p) => {
            const price = formatListingPrice(p);
            return <span className="font-medium">{price.amount}<span className="font-normal text-[color:var(--text-secondary)]"> {price.suffix}</span></span>;
        },
        score: (p) => p.rent_price,
        best: 'min',
        sameListingOnly: true,
    },
    {
        label: 'Price per Marla',
        render: (p) => (p.sqft ? formatPrice(Math.round((p.rent_price / p.sqft) * SQFT_PER_MARLA)) : '—'),
        score: (p) => (p.sqft ? p.rent_price / p.sqft : Infinity),
        best: 'min',
        sameListingOnly: true,
    },
    { label: 'Area', render: (p) => formatArea(p.sqft), score: (p) => p.sqft, best: 'max' },
    { label: 'Bedrooms', render: (p) => p.bedrooms || 'Studio', score: (p) => p.bedrooms, best: 'max' },
    { label: 'Bathrooms', render: (p) => p.bathrooms, score: (p) => p.bathrooms, best: 'max' },
    { label: 'Parking', render: (p) => p.garage ?? 0, score: (p) => p.garage ?? 0, best: 'max' },
    { label: 'Property type', render: (p) => PROPERTY_TYPE_LABELS[p.property_type] },
    { label: 'Location', render: (p) => `${p.city}${p.zip ? `, ${p.zip}` : ''}` },
    { label: 'Furnishing', render: (p) => FURNISHING_LABELS[p.furnishing] },
    { label: 'Status', render: (p) => STATUS_LABELS[p.status] ?? p.status },
    { label: 'Year built', render: (p) => p.year_built ?? '—', score: (p) => p.year_built ?? 0, best: 'max' },
];

/** Index set of columns holding the best value for a row (only when values differ). */
function bestColumns(row: Row, properties: Property[]) {
    if (!row.score || !row.best || properties.length < 2) return new Set<number>();
    if (row.sameListingOnly && new Set(properties.map((p) => p.listing_type)).size > 1) return new Set<number>();
    const scores = properties.map(row.score);
    const finite = scores.filter(Number.isFinite);
    if (finite.length === 0 || new Set(finite).size === 1) return new Set<number>();
    const target = row.best === 'min' ? Math.min(...finite) : Math.max(...finite);
    return new Set(scores.flatMap((s, i) => (s === target ? [i] : [])));
}

const cellBase = 'px-4 py-3 align-top border-b border-[var(--outline-default)] text-[length:var(--typeface-paragraph-text)]';
const labelCell = `${cellBase} sticky left-0 z-10 bg-[var(--bg-gray-block)] text-[color:var(--text-secondary)] font-medium w-[120px] min-w-[120px] sm:w-[180px] sm:min-w-[180px]`;

export default function CompareClient() {
    usePrefs(); // re-render when currency / area unit changes
    const hydrated = useSavedHydrated();
    const compare = useSavedProperties((s) => s.compare);
    const removeCompare = useSavedProperties((s) => s.removeCompare);
    const clearCompare = useSavedProperties((s) => s.clearCompare);
    const { properties, loading, error, removedCount } = usePropertiesByIds(compare, hydrated);

    const isLoading = !hydrated || loading;
    const amenities = Array.from(new Set(properties.flatMap((p) => p.amenities ?? []))).sort();

    return (
        <section className="bg-[var(--surface-variant)] min-h-screen pt-[var(--header-height)]">
            <div className="px-5 sm:px-8 lg:px-16 pt-6 sm:pt-8 lg:pt-10 pb-[var(--section-y)] max-w-[1440px] mx-auto">
                <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8 flex items-center gap-2 text-[length:var(--typeface-paragraph-text)]">
                    <Link href="/" className="hover:underline">Home</Link>
                    <CaretRight size={16} className="opacity-60" />
                    <Link href="/rentals" className="hover:underline">Properties</Link>
                    <CaretRight size={16} className="opacity-60" />
                    <span className="opacity-60">Compare</span>
                </nav>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6">
                    <div>
                        <h1 className="text-[length:var(--typeface-heading-h1)]">Compare properties</h1>
                        <p className="mt-2 text-[color:var(--text-secondary)]">
                            Up to {MAX_COMPARE} side by side. <span className="inline-flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--color-green-500)]" /> marks the best value in a row.</span>
                        </p>
                    </div>
                    {!isLoading && properties.length > 0 && (
                        <button type="button" onClick={clearCompare}
                            className="self-start sm:self-auto text-[length:var(--typeface-paragraph-text-s)] font-medium underline text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
                            Clear comparison
                        </button>
                    )}
                </div>

                {removedCount > 0 && (
                    <div role="status" className="mb-4 flex items-start gap-3 p-4 rounded-[var(--radius-md)] bg-[var(--color-yellow-50)]">
                        <Info size={20} className="shrink-0 mt-0.5 text-[color:var(--text-warning)]" />
                        <p>A property you were comparing is no longer listed, so we removed it.</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="h-[480px] rounded-[var(--radius-md)] bg-[var(--surface-default)] animate-pulse" aria-busy="true" aria-label="Loading comparison" />
                ) : error ? (
                    <div role="alert" className="blur-rise flex flex-col items-center text-center gap-3 py-16 px-6 bg-[var(--bg-block)] rounded-[var(--radius-md)]">
                        <Icon3D name="warning" size={96} className="mb-2" />
                        <p className="text-[length:var(--typeface-heading-subheading)]">We couldn&apos;t load the comparison.</p>
                        <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-2">Try again</button>
                    </div>
                ) : properties.length < 2 ? (
                    <div className="blur-rise flex flex-col items-center text-center gap-3 py-16 px-6 bg-[var(--bg-block)] rounded-[var(--radius-md)]">
                        <Icon3D name="scales" size={104} className="mb-2" />
                        <h2 className="text-[length:var(--typeface-heading-h3)]">
                            {properties.length === 0 ? 'Nothing to compare yet' : 'Add one more property'}
                        </h2>
                        <p className="max-w-[440px] text-[color:var(--text-secondary)]">
                            {properties.length === 0
                                ? 'Use the scales icon on any property to add it here. Pick 2 to 4.'
                                : `“${properties[0].title}” is ready. Add at least one more to see them side by side.`}
                        </p>
                        <Link href="/rentals" className="btn-primary mt-2">Browse properties</Link>
                    </div>
                ) : (
                    <div className="rounded-[var(--radius-md)] bg-[var(--bg-block)] overflow-hidden border border-[var(--outline-default)]">
                        <div className="overflow-x-auto overscroll-x-contain" tabIndex={0} aria-label="Comparison table, scroll sideways for more">
                            <table className="w-full border-collapse text-left">
                                <caption className="sr-only">Comparison of {properties.length} properties</caption>
                                <thead>
                                    <tr>
                                        <th scope="col" className={`${labelCell} align-bottom`}><span className="sr-only">Attribute</span></th>
                                        {properties.map((p) => (
                                            <th key={p.id} scope="col" className={`${cellBase} min-w-[220px] w-[260px] font-normal`}>
                                                <div className="relative aspect-[4/3] rounded-[var(--radius-sm)] overflow-hidden bg-[var(--surface-container-highest)]">
                                                    {p.property_images?.[0] && (
                                                        <Image src={p.property_images[0].storage_url} alt="" fill sizes="260px" className="object-cover" />
                                                    )}
                                                    <button type="button" onClick={() => removeCompare(p.id)} aria-label={`Remove ${p.title} from comparison`}
                                                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
                                                        <X size={14} weight="bold" />
                                                    </button>
                                                </div>
                                                <Link href={`/rentals/${p.id}`} className="block mt-3 text-[length:var(--typeface-heading-subheading)] leading-6 hover:underline">
                                                    {p.title}
                                                </Link>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ROWS.map((row) => {
                                        const best = bestColumns(row, properties);
                                        return (
                                            <tr key={row.label}>
                                                <th scope="row" className={labelCell}>{row.label}</th>
                                                {properties.map((p, i) => (
                                                    <td key={p.id} className={`${cellBase} ${best.has(i) ? 'bg-[var(--color-green-50)]' : ''}`}>
                                                        <span className="inline-flex items-center gap-2">
                                                            {best.has(i) && <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-green-500)] shrink-0" aria-label="Best value" />}
                                                            {row.render(p)}
                                                        </span>
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                    {amenities.length > 0 && (
                                        <tr>
                                            <th scope="rowgroup" colSpan={properties.length + 1} className="px-4 pt-6 pb-2 sticky left-0 bg-[var(--bg-block)] font-display text-[length:var(--typeface-heading-h4)] font-normal">
                                                Amenities
                                            </th>
                                        </tr>
                                    )}
                                    {amenities.map((a) => (
                                        <tr key={a}>
                                            <th scope="row" className={labelCell}>{a}</th>
                                            {properties.map((p) => {
                                                const has = p.amenities?.includes(a);
                                                return (
                                                    <td key={p.id} className={cellBase}>
                                                        {has ? (
                                                            <Check size={18} weight="bold" className="text-[color:var(--text-attention)]" aria-label="Yes" />
                                                        ) : (
                                                            <Minus size={18} className="text-[color:var(--text-tertiary)]" aria-label="No" />
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
