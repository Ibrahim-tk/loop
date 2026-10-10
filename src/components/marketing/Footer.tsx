import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { createPublicClient } from '@/lib/supabase/server';
import { PUBLIC_STATUSES } from '@/lib/properties';
import { SQFT_PER_KANAL, SQFT_PER_MARLA } from '@/lib/utils';
import WhatsappIcon from '@/components/ui/WhatsappIcon';

const MAX_CITIES = 6;

type FooterLink = { label: string; href: string };

const search = (params: Record<string, string | number>) =>
    `/properties?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()}`;

const STATIC_COLUMNS: { title: string; links: FooterLink[] }[] = [
    {
        title: 'Buy',
        links: [
            { label: 'All homes for sale', href: search({ listing: 'SALE' }) },
            { label: 'Houses for sale', href: search({ listing: 'SALE', type: 'HOUSE' }) },
            { label: 'Apartments for sale', href: search({ listing: 'SALE', type: 'APARTMENT' }) },
            { label: 'Villas for sale', href: search({ listing: 'SALE', type: 'VILLA' }) },
            { label: 'Plots for sale', href: search({ listing: 'SALE', type: 'PLOT' }) },
            { label: 'Commercial for sale', href: search({ listing: 'SALE', type: 'COMMERCIAL' }) },
        ],
    },
    {
        title: 'Rent',
        links: [
            { label: 'All homes for rent', href: search({ listing: 'RENT' }) },
            { label: 'Houses for rent', href: search({ listing: 'RENT', type: 'HOUSE' }) },
            { label: 'Apartments for rent', href: search({ listing: 'RENT', type: 'APARTMENT' }) },
            { label: 'Penthouses for rent', href: search({ listing: 'RENT', type: 'PENTHOUSE' }) },
            { label: 'Studios for rent', href: search({ listing: 'RENT', type: 'STUDIO' }) },
            { label: 'Furnished rentals', href: search({ listing: 'RENT', furnishing: 'FURNISHED' }) },
        ],
    },
    {
        title: 'By size',
        links: [
            { label: '5 Marla & up', href: search({ minArea: 5 * SQFT_PER_MARLA }) },
            { label: '10 Marla & up', href: search({ minArea: 10 * SQFT_PER_MARLA }) },
            { label: '1 Kanal & up', href: search({ minArea: SQFT_PER_KANAL }) },
            { label: '2 Kanal & up', href: search({ minArea: 2 * SQFT_PER_KANAL }) },
            { label: '3+ bedroom homes', href: search({ beds: 3 }) },
            { label: '5+ bedroom homes', href: search({ beds: 5 }) },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'All properties', href: '/properties' },
            { label: 'Newest listings', href: search({ sort: 'newest' }) },
            { label: 'About us', href: '/about' },
            { label: 'Contact us', href: '/contact' },
            { label: 'Saved homes', href: '/favourites' },
        ],
    },
];

const WHATSAPP = { label: '+92 333 9876543', href: 'https://wa.me/923339876543' };
const CONNECT: FooterLink[] = [WHATSAPP, { label: 'admin@fasanahomes.com', href: 'mailto:admin@fasanahomes.com' }];

/** Cities that actually have listings, most listings first, so every city link shows results. */
async function getTopCities(): Promise<FooterLink[]> {
    const { data } = await createPublicClient()
        .from('properties')
        .select('city')
        .in('status', PUBLIC_STATUSES);
    const counts = new Map<string, number>();
    (data ?? []).forEach(({ city }: { city: string | null }) => {
        if (city) counts.set(city, (counts.get(city) ?? 0) + 1);
    });
    return Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, MAX_CITIES)
        .map(([city]) => ({ label: `Homes in ${city}`, href: search({ city }) }));
}

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
    return (
        <nav aria-label={title}>
            <h2 className="mb-3 text-[length:var(--typeface-paragraph-text-s)] font-semibold text-[color:var(--on-surface-default)]">{title}</h2>
            <ul className="flex flex-col gap-2.5">
                {links.map((link) => {
                    const external = link.href.startsWith('http');
                    return (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                className="text-[length:var(--typeface-paragraph-text-xs)] text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface-default)] transition-colors break-words"
                            >
                                {link.label}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default async function Footer() {
    const cities = await getTopCities();
    const columns = [
        ...STATIC_COLUMNS.slice(0, 2),
        ...(cities.length ? [{ title: 'Popular cities', links: cities }] : []),
        ...STATIC_COLUMNS.slice(2),
        { title: 'Connect', links: CONNECT },
    ];

    return (
        <footer className="w-full font-[family-name:var(--font-bricolage)] bg-[var(--surface-default)] border-t border-[var(--outline-default)] px-5 sm:px-8 lg:px-16 pt-16 pb-8">
            <div className="mx-auto w-full max-w-[var(--content-max)]">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,1fr)_2.4fr] gap-12 lg:gap-16">
                    {/* Brand + CTA */}
                    <div className="flex flex-col gap-8">
                        <Link href="/" className="w-fit">
                            <Logo className="h-[36px] text-[28px] text-[color:var(--text-primary)]" />
                        </Link>
                        <p className="max-w-[320px] text-[length:var(--typeface-heading-h4)] leading-snug text-[color:var(--on-surface-default)]">
                            Find your next home in Punjab and across Pakistan.
                        </p>
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/properties"
                                className="group w-fit inline-flex items-center gap-4 h-12 pl-5 pr-1.5 rounded-[8px] bg-[var(--action-primary)] text-white text-[length:var(--typeface-paragraph-text-s)] font-medium hover:bg-[var(--action-primary-hover)] transition-colors"
                            >
                                Browse properties
                                <span className="size-9 rounded-[6px] bg-white text-[color:var(--action-primary)] flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                                    <ArrowRight size={18} weight="bold" />
                                </span>
                            </Link>
                            <a
                                href={WHATSAPP.href}
                                aria-label={`Chat on WhatsApp: ${WHATSAPP.label}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-fit inline-flex items-center gap-2 text-[length:var(--typeface-paragraph-text-xs)] text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface-default)] transition-colors"
                            >
                                <WhatsappIcon size={18} />
                                {WHATSAPP.label}
                            </a>
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                        {columns.map((col) => (
                            <LinkColumn key={col.title} title={col.title} links={col.links} />
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-14 pt-6 border-t border-[var(--outline-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[length:var(--typeface-paragraph-text-xs)] text-[color:var(--on-surface-variant)]">
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <Link href="/properties" className="hover:text-[color:var(--on-surface-default)]">Properties</Link>
                        <Link href="/about" className="hover:text-[color:var(--on-surface-default)]">About</Link>
                        <Link href="/contact" className="hover:text-[color:var(--on-surface-default)]">Contact</Link>
                    </div>
                    <p>&copy; {new Date().getFullYear()} Fasana Homes. Based in Punjab, serving all of Pakistan.</p>
                </div>
            </div>
        </footer>
    );
}
