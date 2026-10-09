'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    DEFAULT_FILTERS,
    filtersFromParams,
    filtersToParams,
    type FilterChip,
    type PropertyFilters,
} from '@/lib/properties';

/**
 * Catalogue filter state, stored in the URL so filters survive a refresh
 * and can be shared as a link.
 */
export function usePropertyFilters() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const filters = useMemo(() => filtersFromParams(new URLSearchParams(searchParams.toString())), [searchParams]);

    const replace = useCallback(
        (next: PropertyFilters) => {
            const qs = filtersToParams(next).toString();
            // Updates useSearchParams without a server round-trip
            window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname);
        },
        [pathname]
    );

    const setFilter = useCallback(
        <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => replace({ ...filters, [key]: value }),
        [filters, replace]
    );

    const toggleAmenity = useCallback(
        (amenity: string) => {
            const has = filters.amenities.includes(amenity);
            setFilter('amenities', has ? filters.amenities.filter((a) => a !== amenity) : [...filters.amenities, amenity]);
        },
        [filters.amenities, setFilter]
    );

    const removeChip = useCallback(
        (chip: FilterChip) => {
            if (chip.key === 'amenities' && chip.value) {
                setFilter('amenities', filters.amenities.filter((a) => a !== chip.value));
            } else {
                setFilter(chip.key, DEFAULT_FILTERS[chip.key]);
            }
        },
        [filters.amenities, setFilter]
    );

    const clearAll = useCallback(() => replace({ ...DEFAULT_FILTERS, sort: filters.sort }), [filters.sort, replace]);

    return { filters, setFilter, toggleAmenity, removeChip, clearAll };
}
