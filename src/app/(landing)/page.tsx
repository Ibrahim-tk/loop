import { createPublicClient } from '@/lib/supabase/server';
import { Property, PropertyType } from '@/lib/types';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingSearchHero from '@/components/landing/LandingSearchHero';
import LandingListingRow from '@/components/landing/LandingListingRow';
import LandingBrowse from '@/components/landing/LandingBrowse';
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
];

export default async function LandingPage() {
    const supabase = createPublicClient();

    // The catalogue is small, so load it once and derive every section from it
    const { data } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .in('status', ['AVAILABLE', 'PENDING', 'SHOWCASE'])
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

    const { data: bannerSetting } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'banner_enabled')
        .single();

    const showBanner = bannerSetting?.value !== 'false';

    return (
        <div className="flex flex-col items-center relative">
            <LandingNavbar showBanner={showBanner} />

            <LandingSearchHero cities={cities} types={types} />

            <LandingListingRow title="Featured properties" properties={featured} viewAllHref="/rentals" />

            {/* ═══ TRUST STRIP ═══ */}
            <section className="w-full bg-[var(--on-surface-primary)] px-5 sm:px-8 lg:px-16 py-8">
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
                    {TRUST_POINTS.map((point) => (
                        <li key={point.label} className="flex items-baseline gap-3">
                            <span className="text-[length:var(--typeface-heading-h2)] leading-none">{point.value}</span>
                            <span className="font-light text-white/80 text-[length:var(--typeface-paragraph-text)]">{point.label}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <LandingListingRow title="Recently added" properties={recent} viewAllHref="/rentals?sort=newest" />

            <LandingBrowse properties={properties} />

            <Footer />
        </div>
    );
}
