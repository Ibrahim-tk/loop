'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scales } from '@phosphor-icons/react';
import { MAX_COMPARE, useSavedHydrated, useSavedProperties } from '@/stores/savedProperties';

/** Floating bar that appears once something is picked for comparison. */
export default function CompareTray() {
    const pathname = usePathname();
    const hydrated = useSavedHydrated();
    const count = useSavedProperties((s) => s.compare.length);
    const clearCompare = useSavedProperties((s) => s.clearCompare);

    if (!hydrated || count === 0 || pathname === '/compare' || pathname.startsWith('/admin')) return null;

    const ready = count >= 2;

    return (
        <div role="region" aria-label="Comparison" className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-3 sm:gap-5 pl-4 pr-2 py-2 rounded-full bg-[var(--bg-inverse)] text-[color:var(--text-inverse)] shadow-[var(--shadow-menu)] max-w-full">
                <Scales size={20} className="shrink-0" />
                <span className="text-[length:var(--typeface-paragraph-text-s)] whitespace-nowrap" aria-live="polite">
                    {count} of {MAX_COMPARE} selected
                </span>
                <button type="button" onClick={clearCompare}
                    className="text-[length:var(--typeface-paragraph-text-s)] underline text-[color:var(--text-on-dark)] opacity-80 hover:opacity-100">
                    Clear
                </button>
                {ready ? (
                    <Link href="/compare"
                        className="h-10 px-5 inline-flex items-center rounded-full bg-[var(--color-green-500)] text-white text-[length:var(--typeface-paragraph-text-s)] font-medium hover:bg-[var(--action-brand-hover)] transition-colors">
                        Compare
                    </Link>
                ) : (
                    <span className="h-10 px-4 inline-flex items-center rounded-full bg-white/10 text-[length:var(--typeface-paragraph-text-s)] text-white/70 whitespace-nowrap" aria-disabled="true">
                        Pick 1 more
                    </span>
                )}
            </div>
        </div>
    );
}
