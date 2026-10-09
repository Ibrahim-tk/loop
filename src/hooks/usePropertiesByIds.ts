'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Property } from '@/lib/types';
import { useSavedProperties } from '@/stores/savedProperties';

/**
 * Loads the given properties (with images), keeping the order of `ids`.
 * Ids that no longer exist are reported and pruned from saved lists.
 */
export function usePropertiesByIds(ids: string[], enabled = true) {
    const prune = useSavedProperties((s) => s.prune);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [removedCount, setRemovedCount] = useState(0);
    const key = ids.join(',');

    useEffect(() => {
        if (!enabled) return;
        if (ids.length === 0) {
            setProperties([]);
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(false);

        createClient()
            .from('properties')
            .select('*, property_images(*)')
            .in('id', ids)
            .then(({ data, error: err }) => {
                if (cancelled) return;
                if (err) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                const rows = (data as Property[]) ?? [];
                const byId = new Map(rows.map((p) => [p.id, p]));
                const ordered = ids.map((id) => byId.get(id)).filter((p): p is Property => Boolean(p));
                ordered.forEach((p) => p.property_images?.sort((a, b) => a.display_order - b.display_order));

                const missing = ids.length - ordered.length;
                if (missing > 0) {
                    setRemovedCount((n) => n + missing);
                    // Only prune ids that this query looked up
                    const { favourites, compare } = useSavedProperties.getState();
                    const found = new Set(ordered.map((p) => p.id));
                    const stillValid = [...favourites, ...compare].filter((id) => !ids.includes(id) || found.has(id));
                    prune(stillValid);
                }
                setProperties(ordered);
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, enabled]);

    return { properties, loading, error, removedCount };
}
