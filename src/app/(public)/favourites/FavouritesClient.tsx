'use client';

import Link from 'next/link';
import Icon3D from '@/components/ui/Icon3D';
import { CaretRight, Heart, Info, WarningCircle } from '@phosphor-icons/react';
import PropertyGrid from '@/components/listings/PropertyGrid';
import { usePropertiesByIds } from '@/hooks/usePropertiesByIds';
import { useSavedHydrated, useSavedProperties } from '@/stores/savedProperties';

export default function FavouritesClient() {
    const hydrated = useSavedHydrated();
    const favourites = useSavedProperties((s) => s.favourites);
    const clearFavourites = useSavedProperties((s) => s.clearFavourites);
    const { properties, loading, error, removedCount } = usePropertiesByIds(favourites, hydrated);

    const isLoading = !hydrated || loading;

    return (
        <section className="bg-[var(--surface-variant)] min-h-screen pt-[var(--header-height)]">
            <div className="px-5 sm:px-8 lg:px-16 pt-6 sm:pt-8 lg:pt-10 pb-[var(--section-y)] max-w-[1440px] mx-auto">
                <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8 flex items-center gap-2 text-[length:var(--typeface-paragraph-text)]">
                    <Link href="/" className="hover:underline">Home</Link>
                    <CaretRight size={16} className="opacity-60" />
                    <span className="opacity-60">Saved</span>
                </nav>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4">
                    <div>
                        <h1 className="text-[length:var(--typeface-heading-h1)]">Saved properties</h1>
                        {!isLoading && properties.length > 0 && (
                            <p className="mt-2 text-[color:var(--text-secondary)]">
                                {properties.length} saved {properties.length === 1 ? 'property' : 'properties'}, kept on this device.
                            </p>
                        )}
                    </div>
                    {!isLoading && properties.length > 0 && (
                        <button type="button" onClick={clearFavourites}
                            className="self-start sm:self-auto text-[length:var(--typeface-paragraph-text-s)] font-medium underline text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]">
                            Remove all
                        </button>
                    )}
                </div>

                {removedCount > 0 && (
                    <div role="status" className="mb-4 flex items-start gap-3 p-4 rounded-[var(--radius-md)] bg-[var(--color-yellow-50)] text-[color:var(--text-primary)]">
                        <Info size={20} className="shrink-0 mt-0.5 text-[color:var(--text-warning)]" />
                        <p>
                            {removedCount === 1 ? 'One saved property is' : `${removedCount} saved properties are`} no longer listed, so we removed{' '}
                            {removedCount === 1 ? 'it' : 'them'} from your list.
                        </p>
                    </div>
                )}

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[var(--grid-col-gap)] gap-y-[var(--grid-row-gap)] pt-8" aria-busy="true" aria-label="Loading saved properties">
                        {Array.from({ length: Math.min(Math.max(favourites.length, 3), 6) }).map((_, i) => (
                            <div key={i} className="bg-[var(--surface-default)] rounded-[var(--radius-md)] overflow-hidden animate-pulse">
                                <div className="h-[274px] bg-[var(--surface-container-highest)]" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-[var(--surface-container-highest)] rounded w-3/4" />
                                    <div className="h-4 bg-[var(--surface-container-highest)] rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div role="alert" className="blur-rise mt-4 flex flex-col items-center text-center gap-3 py-16 px-6 bg-[var(--bg-block)] rounded-[var(--radius-md)]">
                        <Icon3D name="warning" size={96} className="mb-2" />
                        <p className="text-[length:var(--typeface-heading-subheading)]">We couldn&apos;t load your saved properties.</p>
                        <button type="button" onClick={() => window.location.reload()} className="btn-primary mt-2">Try again</button>
                    </div>
                ) : properties.length === 0 ? (
                    <div className="blur-rise mt-4 flex flex-col items-center text-center gap-3 py-16 px-6 bg-[var(--bg-block)] rounded-[var(--radius-md)]">
                        <Icon3D name="heart" size={104} className="mb-2" />
                        <h2 className="text-[length:var(--typeface-heading-h3)]">No saved properties yet</h2>
                        <p className="max-w-[420px] text-[color:var(--text-secondary)]">
                            Tap the heart on any property to keep it here and come back to it later.
                        </p>
                        <Link href="/rentals" className="btn-primary mt-2">Browse properties</Link>
                    </div>
                ) : (
                    <PropertyGrid properties={properties} />
                )}
            </div>
        </section>
    );
}
