'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle, MagnifyingGlass, SpinnerGap } from '@phosphor-icons/react';
import Modal from '@/components/ui/Modal';
import { createClient } from '@/lib/supabase/client';
import { formatArea, formatListingPrice } from '@/lib/properties';
import { usePrefs } from '@/lib/store';
import { useSavedProperties } from '@/stores/savedProperties';
import { cn } from '@/lib/utils';
import type { Property } from '@/lib/types';

type Option = Pick<Property, 'id' | 'title' | 'city' | 'rent_price' | 'listing_type' | 'sqft' | 'bedrooms' | 'bathrooms' | 'property_images'>;

/** Pick one other listing, then open the side-by-side comparison with the current one. */
export default function CompareModal({ open, onOpenChange, current }: { open: boolean; onOpenChange: (o: boolean) => void; current: Pick<Property, 'id' | 'title'> }) {
    usePrefs(); // prices follow the visitor's currency / area unit
    const router = useRouter();
    const clearCompare = useSavedProperties((s) => s.clearCompare);
    const toggleCompare = useSavedProperties((s) => s.toggleCompare);
    const [options, setOptions] = useState<Option[] | null>(null);
    const [selected, setSelected] = useState('');
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (!open || options) return;
        createClient()
            .from('properties')
            .select('id, title, city, rent_price, listing_type, sqft, bedrooms, bathrooms, property_images(storage_url, display_order)')
            .in('status', ['AVAILABLE', 'PENDING', 'SHOWCASE'])
            .neq('id', current.id)
            .order('featured', { ascending: false })
            .then(({ data }) => setOptions((data as Option[]) ?? []));
    }, [open, options, current.id]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return (options ?? []).filter((o) => !q || `${o.title} ${o.city}`.toLowerCase().includes(q));
    }, [options, query]);

    const compareNow = () => {
        clearCompare();
        toggleCompare(current.id);
        toggleCompare(selected);
        onOpenChange(false);
        router.push('/compare');
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange} size="lg" title="Compare with another property" description={`Pick a listing to see side by side with ${current.title}.`}>
            <div className="flex flex-col gap-4">
                <label className="relative block">
                    <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-secondary)]" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or city"
                        aria-label="Search properties"
                        className="w-full h-11 pl-10 pr-3 rounded-[8px] bg-[var(--bg-gray-block)] text-[length:var(--typeface-paragraph-text-s)] outline-none focus:ring-2 focus:ring-[var(--action-primary-hover)]/30"
                    />
                </label>

                {!options ? (
                    <div className="flex items-center justify-center gap-2 py-16 text-[color:var(--text-secondary)]">
                        <SpinnerGap size={18} className="animate-spin" /> Loading properties…
                    </div>
                ) : (
                    <div role="radiogroup" aria-label="Properties" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[52dvh] overflow-y-auto -mx-1 px-1 py-1">
                        {visible.map((o) => {
                            const img = [...(o.property_images ?? [])].sort((a, b) => a.display_order - b.display_order)[0]?.storage_url;
                            const price = formatListingPrice(o);
                            const isSel = o.id === selected;
                            return (
                                <button
                                    key={o.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSel}
                                    onClick={() => setSelected(o.id)}
                                    className={cn(
                                        'relative text-left rounded-[10px] overflow-hidden bg-white ring-1 transition-all',
                                        isSel ? 'ring-2 ring-[var(--action-primary-hover)]' : 'ring-[var(--outline-default)] hover:ring-[var(--color-gray-400)]',
                                    )}
                                >
                                    <div className="relative h-[120px] bg-[var(--bg-gray-block)]">
                                        {img && <Image src={img} alt="" fill sizes="300px" className="object-cover" />}
                                        {isSel && (
                                            <CheckCircle size={28} weight="fill" className="absolute top-2 right-2 text-[color:var(--action-primary-hover)] bg-white rounded-full" />
                                        )}
                                    </div>
                                    <div className="p-3 flex flex-col gap-1">
                                        <p className="font-medium line-clamp-1">{o.title}</p>
                                        <p className="text-[12px] text-[color:var(--text-secondary)]">
                                            {o.city} · {o.bedrooms} beds · {formatArea(o.sqft)}
                                        </p>
                                        <p className="text-[length:var(--typeface-paragraph-text-s)] font-medium">
                                            {price.amount}<span className="font-normal text-[color:var(--text-secondary)]"> {price.suffix}</span>
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                        {visible.length === 0 && <p className="col-span-full py-10 text-center text-[color:var(--text-secondary)]">No properties match “{query}”.</p>}
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                    <button type="button" onClick={() => onOpenChange(false)} className="h-11 px-5 rounded-[8px] text-[length:var(--typeface-paragraph-text-s)] font-medium hover:bg-[var(--bg-gray-block)]">
                        Cancel
                    </button>
                    <button type="button" disabled={!selected} onClick={compareNow} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                        Compare side by side
                    </button>
                </div>
            </div>
        </Modal>
    );
}
