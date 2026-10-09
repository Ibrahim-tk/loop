'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const MAX_COMPARE = 4;

interface SavedPropertiesState {
    favourites: string[];
    compare: string[];
    toggleFavourite: (id: string) => void;
    /** Returns false when the compare list is already full. */
    toggleCompare: (id: string) => boolean;
    removeFavourite: (id: string) => void;
    removeCompare: (id: string) => void;
    clearFavourites: () => void;
    clearCompare: () => void;
    /** Drops ids that no longer exist (e.g. a property deleted in admin). */
    prune: (existingIds: string[]) => void;
}

/** Favourites and comparison selection, saved in localStorage so they survive a refresh. */
export const useSavedProperties = create<SavedPropertiesState>()(
    persist(
        (set, get) => ({
            favourites: [],
            compare: [],
            toggleFavourite: (id) =>
                set((s) => ({
                    favourites: s.favourites.includes(id) ? s.favourites.filter((f) => f !== id) : [...s.favourites, id],
                })),
            toggleCompare: (id) => {
                const { compare } = get();
                if (compare.includes(id)) {
                    set({ compare: compare.filter((c) => c !== id) });
                    return true;
                }
                if (compare.length >= MAX_COMPARE) return false;
                set({ compare: [...compare, id] });
                return true;
            },
            removeFavourite: (id) => set((s) => ({ favourites: s.favourites.filter((f) => f !== id) })),
            removeCompare: (id) => set((s) => ({ compare: s.compare.filter((c) => c !== id) })),
            clearFavourites: () => set({ favourites: [] }),
            clearCompare: () => set({ compare: [] }),
            prune: (existingIds) => {
                const keep = new Set(existingIds);
                set((s) => ({
                    favourites: s.favourites.filter((id) => keep.has(id)),
                    compare: s.compare.filter((id) => keep.has(id)),
                }));
            },
        }),
        { name: 'saved-properties', version: 1 }
    )
);

/**
 * True once the persisted lists have loaded from localStorage.
 * Render counts and toggled states only after this to avoid hydration mismatches.
 */
export function useSavedHydrated() {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => {
        if (useSavedProperties.persist.hasHydrated()) setHydrated(true);
        return useSavedProperties.persist.onFinishHydration(() => setHydrated(true));
    }, []);
    return hydrated;
}
