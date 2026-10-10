import type { Metadata } from 'next';
import { Archivo, Bricolage_Grotesque, Instrument_Serif, Pragati_Narrow } from 'next/font/google';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { AppToaster } from '@/components/ui/AppToaster';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

import './globals.css';

const archivo = Archivo({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-archivo-loaded',
    display: 'swap',
});

const instrumentSerif = Instrument_Serif({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-instrument-loaded',
    display: 'swap',
});

const pragatiNarrow = Pragati_Narrow({
    subsets: ['latin'],
    weight: ['400', '700'],
    variable: '--font-pragati-loaded',
    display: 'swap',
});

const bricolage = Bricolage_Grotesque({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-bricolage-loaded',
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'Fasana Homes | Property Management & Renovations',
        template: '%s | Fasana Homes',
    },
    description:
        'Fasana Homes provides expert property management and renovation services. Maximize your ROI with our comprehensive management solutions.',
    keywords: [
        'property management',
        'renovations',
        'rental properties',
        'real estate',
        'Fasana Homes',
        'tenant screening',
        'maintenance',
    ],
    icons: {
        icon: '/favicon.png',
        apple: '/apple-touch-icon.png',
    },
    openGraph: {
        title: 'Fasana Homes',
        description: 'Property Management & Renovation Experts',
        url: process.env.NEXT_PUBLIC_SITE_URL,
        siteName: 'Fasana Homes',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`antialiased ${archivo.variable} ${instrumentSerif.variable} ${pragatiNarrow.variable} ${bricolage.variable}`}
        >
            <body className="min-h-screen bg-[var(--surface-variant)]">
                <SpeedInsights />
                <Analytics />
                {/* Hidden SVG filters for liquid glass distortion */}
                <svg className="absolute w-0 h-0" aria-hidden="true">
                    <defs>
                        <filter id="liquid-glass-filter" x="-20%" y="-20%" width="140%" height="140%">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.015"
                                numOctaves="3"
                                seed="2"
                                result="noise"
                            />
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="noise"
                                scale="6"
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                        </filter>
                        <filter id="liquid-glass-filter-strong" x="-20%" y="-20%" width="140%" height="140%">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.012"
                                numOctaves="4"
                                seed="5"
                                result="noise"
                            />
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="noise"
                                scale="10"
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                        </filter>
                    </defs>
                </svg>
                <AppToaster />
                <ScrollReveal />
                {children}
            </body>
        </html>
    );
}
