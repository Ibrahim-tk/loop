import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { Property } from '@/lib/types';
import PropertyCard from '@/components/listings/PropertyCard';

interface LandingListingRowProps {
    title: string;
    properties: Property[];
    viewAllHref: string;
    tone?: 'white' | 'variant';
}

export default function LandingListingRow({ title, properties, viewAllHref, tone = 'white' }: LandingListingRowProps) {
    if (properties.length === 0) return null;

    return (
        <section className={`w-full py-12 lg:py-16 px-5 sm:px-8 lg:px-16 ${tone === 'variant' ? 'bg-[var(--surface-variant)]' : 'bg-white'}`}>
            <div className="flex items-end justify-between gap-4 mb-6 lg:mb-8">
                <h2 className="text-[length:var(--typeface-heading-h2)] font-normal leading-none tracking-[-0.24px] text-[color:var(--on-surface-default)]">
                    {title}
                </h2>
                <Link
                    href={viewAllHref}
                    className="shrink-0 inline-flex items-center gap-1.5 text-[length:var(--typeface-paragraph-text-s)] font-medium text-[color:var(--on-surface-default)] underline-offset-4 hover:underline"
                >
                    View all <ArrowRight size={16} />
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} viewMode="grid" />
                ))}
            </div>
        </section>
    );
}
