import { createPublicClient } from '@/lib/supabase/server';
import { PUBLIC_STATUSES } from '@/lib/properties';
import { Property, PropertyType } from '@/lib/types';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingSearchHero from '@/components/landing/LandingSearchHero';
import LandingListingRow from '@/components/landing/LandingListingRow';
import LandingBrowse from '@/components/landing/LandingBrowse';
import LandingFAQ from '@/components/landing/LandingFAQ';
import LandingTestimonials from '@/components/landing/LandingTestimonials';
import LandingCTA from '@/components/landing/LandingCTA';
import Footer from '@/components/marketing/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Homes for Rent & Sale',
    description:
        'Search homes for rent and sale, save your favourites and book a viewing with Fasana Homes.',
};

// Revalidate landing page periodically for fresh properties
export const revalidate = 60;

const FEATURED_COUNT = 6;
const RECENT_COUNT = 3;

const TRUST_POINTS = [
    { value: '35 yrs', label: 'combined experience' },
    { value: '~5 yrs', label: 'average tenant stay' },
    { value: 'Free', label: 'viewings, no account needed' },
    { value: '24h', label: 'typical reply time' },
    { value: '100%', label: 'listings checked by our team' },
    { value: '4', label: 'cities and growing' },
];

export default async function LandingPage() {
    const supabase = createPublicClient();

    // The catalogue is small, so load it once and derive every section from it
    const { data } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .in('status', PUBLIC_STATUSES)
        .order('display_order', { referencedTable: 'property_images', ascending: true });

    const properties = (data as Property[]) || [];

    // Admin-featured listings first, then the most viewed
    const featured = [...properties]
        .sort((a, b) => Number(b.featured) - Number(a.featured) || b.view_count - a.view_count)
        .slice(0, FEATURED_COUNT);
    const featuredIds = new Set(featured.map((p) => p.id));
    const recent = properties
        .filter((p) => !featuredIds.has(p.id))
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, RECENT_COUNT);

    const cities = Array.from(new Set(properties.map((p) => p.city).filter(Boolean))).sort();
    const types = Array.from(new Set(properties.map((p) => p.property_type).filter(Boolean))) as PropertyType[];

    return (
        <div className="flex flex-col items-center relative">
            <LandingNavbar />

            <LandingSearchHero cities={cities} types={types} />

            <LandingListingRow title="Featured properties" properties={featured} viewAllHref="/properties" />

            <LandingBrowse properties={properties} />

            {/* ═══ TRUST MARQUEE ═══ */}
            <section className="w-full bg-[var(--on-surface-primary)] py-8 overflow-hidden" aria-label="Why Fasana Homes">
                <ul className="sr-only">
                    {TRUST_POINTS.map((point) => <li key={point.label}>{point.value} {point.label}</li>)}
                </ul>
                <div className="marquee-track flex w-max text-white" aria-hidden="true">
                    {[0, 1].map((copy) => (
                        <div key={copy} className="flex shrink-0 items-baseline">
                            {TRUST_POINTS.map((point) => (
                                <div key={point.label} className="flex items-baseline">
                                    <span className="flex items-baseline gap-3 whitespace-nowrap">
                                        <span className="text-[length:var(--typeface-heading-h2)] leading-none">{point.value}</span>
                                        <span className="font-light text-white/80 text-[length:var(--typeface-paragraph-text)]">{point.label}</span>
                                    </span>
                                    <span className="px-12 text-[length:var(--typeface-heading-h2)] leading-none text-white/40">/</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            <LandingListingRow title="Recently added" properties={recent} viewAllHref="/properties?sort=newest" />

            <LandingTestimonials />

            <LandingFAQ />

            <LandingCTA />

            <Footer />
        </div>
    );
}
