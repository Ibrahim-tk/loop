import { MagnifyingGlass } from '@phosphor-icons/react';
import Icon3D from '@/components/ui/Icon3D';
import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
    properties: Property[];
    viewMode?: 'grid' | 'list';
    totalCount?: number;
    /** When true, the empty state explains that filters hid everything. */
    hasFilters?: boolean;
    onClearFilters?: () => void;
}

export default function PropertyGrid({ properties, viewMode = 'grid', hasFilters = false, onClearFilters }: PropertyGridProps) {
    if (properties.length === 0) {
        return (
            <div className="blur-rise mt-8 flex flex-col items-center text-center gap-3 py-16 px-6 bg-[var(--bg-block)] rounded-[var(--radius-md)]">
                <Icon3D name="search" size={104} className="mb-2" />
                <h2 className="text-[length:var(--typeface-heading-h3)]">
                    {hasFilters ? 'No properties match your filters' : 'No properties listed yet'}
                </h2>
                <p className="max-w-[420px] text-[length:var(--typeface-paragraph-text)] text-[color:var(--text-secondary)]">
                    {hasFilters
                        ? 'Try widening your price range, removing an amenity, or searching a different city.'
                        : 'Check back soon for new listings.'}
                </p>
                {hasFilters && onClearFilters && (
                    <button type="button" onClick={onClearFilters} className="btn-primary mt-2">
                        Clear all filters
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-x-[var(--grid-col-gap)] gap-y-[var(--grid-row-gap)] pt-8' : 'flex flex-col gap-5 pt-4'}>
            {properties.map((property) => (
                <PropertyCard key={property.id} property={property} viewMode={viewMode} />
            ))}
        </div>
    );
}
