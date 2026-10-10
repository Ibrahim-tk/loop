'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, X, CaretRight } from '@phosphor-icons/react';
import { createClient } from '@/lib/supabase/client';
import { formatListingPrice, PUBLIC_STATUSES } from '@/lib/properties';
import type { Property } from '@/lib/types';

type Result = Pick<Property, 'id' | 'title' | 'city' | 'address' | 'rent_price' | 'listing_type'> & {
    property_images?: { storage_url: string; display_order: number }[];
};

const FIELDS = 'id, title, city, address, rent_price, listing_type, property_images(storage_url, display_order)';

/** Navbar search: icon button that opens a panel with top listings, then live matches as you type. */
export default function NavSearch() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Fetch top listings (empty query) or matches, debounced.
    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        const q = query.trim().replace(/[%,()]/g, ' ');
        const timer = setTimeout(async () => {
            setLoading(true);
            let req = createClient().from('properties').select(FIELDS).in('status', [...PUBLIC_STATUSES]).limit(6);
            req = q
                ? req.or(`title.ilike.%${q}%,city.ilike.%${q}%,address.ilike.%${q}%`)
                : req.order('featured', { ascending: false }).order('view_count', { ascending: false });
            const { data } = await req;
            if (cancelled) return;
            setResults((data as Result[]) ?? []);
            setActive(0);
            setLoading(false);
        }, q ? 200 : 0);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [open, query]);

    useEffect(() => {
        if (!open) return;
        inputRef.current?.focus();
        const onDown = (e: MouseEvent) => {
            const t = e.target as Node;
            if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const close = () => {
        setOpen(false);
        setQuery('');
    };

    const onInputKey = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[active]) {
            e.preventDefault();
            router.push(`/properties/${results[active].id}`);
            close();
        }
    };

    const panel = (
        <div
            ref={panelRef}
            role="dialog"
            aria-label="Search properties"
            className="fixed z-[60] top-[calc(var(--header-height)+8px)] right-3 sm:right-5 lg:right-8 w-[calc(100vw-24px)] sm:w-[420px] rounded-[12px] bg-white shadow-[0_16px_48px_rgba(10,13,18,0.16)] border border-[var(--border-default)] overflow-hidden"
        >
            <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--border-default)]">
                <MagnifyingGlass size={20} className="shrink-0 text-[color:var(--on-surface-variant)]" />
                <input
                    ref={inputRef}
                    type="text"
                    enterKeyHint="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onInputKey}
                    placeholder="Search by title, area or city"
                    aria-label="Search properties"
                    className="flex-1 min-w-0 bg-transparent outline-none text-[length:var(--typeface-paragraph-text)] placeholder:text-[color:var(--text-tertiary)]"
                />
                {query && (
                    <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-[color:var(--on-surface-variant)] hover:text-[color:var(--text-primary)]">
                        <X size={18} />
                    </button>
                )}
            </div>

            <p className="px-4 pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-[color:var(--text-tertiary)]">
                {query.trim() ? 'Results' : 'Top properties'}
            </p>
            <ul className="max-h-[min(420px,60vh)] overflow-y-auto pb-2" aria-busy={loading}>
                {loading && results.length === 0 && Array.from({ length: 4 }, (_, i) => (
                    <li key={i} className="flex items-center gap-3 px-4 py-2.5 animate-pulse">
                        <span className="size-12 shrink-0 rounded-[6px] bg-gray-100" />
                        <span className="flex-1 space-y-2">
                            <span className="block h-3 w-3/5 rounded bg-gray-100" />
                            <span className="block h-2.5 w-2/5 rounded bg-gray-100" />
                        </span>
                    </li>
                ))}
                {!loading && results.length === 0 && (
                    <li className="px-4 py-6 text-center text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]">
                        No properties match &ldquo;{query.trim()}&rdquo;.
                    </li>
                )}
                {results.map((r, i) => {
                    const img = [...(r.property_images ?? [])].sort((a, b) => a.display_order - b.display_order)[0]?.storage_url;
                    const price = formatListingPrice(r);
                    return (
                        <li key={r.id}>
                            <Link
                                href={`/properties/${r.id}`}
                                onClick={close}
                                onMouseEnter={() => setActive(i)}
                                className={`group flex items-center gap-3 px-4 py-2.5 transition-colors ${i === active ? 'bg-[var(--surface-variant)]' : ''}`}
                            >
                                <span className="relative size-12 shrink-0 rounded-[6px] overflow-hidden bg-gray-100">
                                    {img && <Image src={img} alt="" fill sizes="48px" className="object-cover" />}
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate font-medium text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-primary)]">{r.title}</span>
                                    <span className="block truncate text-xs text-[color:var(--text-secondary)]">{r.address ? `${r.address}, ${r.city}` : r.city}</span>
                                </span>
                                <span className="shrink-0 text-right text-[length:var(--typeface-paragraph-text-s)] font-medium">
                                    {price.amount}
                                    {price.suffix && <span className="block text-xs font-normal text-[color:var(--text-secondary)]">{price.suffix}</span>}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <Link
                href="/properties"
                onClick={close}
                className="flex items-center justify-center gap-1 h-11 border-t border-[var(--border-default)] text-[length:var(--typeface-paragraph-text-s)] font-medium hover:text-[color:var(--action-primary-hover)] transition-colors"
            >
                Browse all properties <CaretRight size={14} />
            </Link>
        </div>
    );

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => (open ? close() : setOpen(true))}
                aria-label="Search properties"
                aria-expanded={open}
                title="Search"
                className="relative flex items-center justify-center size-11 rounded-[8px] bg-white/70 text-[var(--text-primary)] hover:bg-white transition-colors duration-300"
            >
                <MagnifyingGlass size={20} />
            </button>
            {open && typeof document !== 'undefined' && createPortal(panel, document.body)}
        </>
    );
}
