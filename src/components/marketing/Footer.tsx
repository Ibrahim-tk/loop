import Link from 'next/link';

function FacebookIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function YoutubeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="bg-[var(--surface-default)] w-full px-5 sm:px-8 lg:px-16 py-[var(--p-16,64px)]">
            <div className="flex flex-col gap-8 sm:gap-12 lg:gap-16">

                {/* ── Main Content Row ─────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Logo + Description + Certifications */}
                    <div className="flex flex-col gap-8 flex-1">

                        {/* Logo */}
                        <Link href="/" className="shrink-0">
                            <img
                                src="/brand/logo-dark.png"
                                alt="Fasana Homes"
                                className="h-[32px] sm:h-[40px] lg:h-[40px] w-auto object-contain"
                            />
                        </Link>

                        {/* Second row: Description (repeated per Figma) + Nav Links + Address/Contact */}
                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* Left Sub: Description + Certification Logos */}
                            <div className="flex flex-col gap-6 w-full lg:w-[554px] shrink-0">
                                <p className="font-light text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-variant)] max-w-[388px]">
                                    Fasana Homes is your single point of contact for expert leasing, maintenance, and strategic renovations across Punjab and the rest of Pakistan.
                                </p>
                                {/* Certification Images */}
                                <div className="flex gap-3 items-center">
                                    <img
                                        src="/landing-page/dhud.png"
                                        alt="U.S. Department of Housing and Urban Development"
                                        className="h-[44px] w-auto object-contain"
                                        loading="lazy"
                                    />
                                    <img
                                        src="/landing-page/image 509.svg"
                                        alt="Equal Housing Opportunity"
                                        className="h-[40px] w-auto object-contain"
                                        loading="lazy"
                                    />
                                    <img
                                        src="/landing-page/image 512.svg"
                                        alt="REALTOR certification"
                                        className="h-[48px] w-auto object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Middle Sub: Nav Links Grid (2 columns) */}
                            <div className="flex-1">
                                <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-0 w-fit">
                                    {[
                                        ['Home', 'About'],
                                        ['Rentals', 'Contact'],
                                        ['Services'],
                                    ].map((row, rowIdx) => (
                                        row.map((label) => (
                                            <Link
                                                key={label}
                                                href={label === 'Home' ? '/' : `/${label.toLowerCase()}`}
                                                className="text-[16px] leading-6 text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface-default)] transition-colors py-2"
                                                style={{ gridRow: rowIdx + 1 }}
                                            >
                                                {label}
                                            </Link>
                                        ))
                                    ))}
                                </div>
                            </div>

                            {/* Right Sub: Contact Information */}
                            <div className="flex flex-col gap-5 flex-1">
                                <div className="flex flex-col gap-2">
                                    <p className="text-[length:var(--typeface-paragraph-text)] font-medium leading-6 text-[color:var(--on-surface-default)]">
                                        Get in touch
                                    </p>
                                    <div className="flex flex-col gap-1">
                                        <p className="font-light text-[length:var(--typeface-paragraph-text)] leading-6 text-[color:var(--on-surface-variant)]">
                                            Based in Punjab, serving all of Pakistan
                                        </p>
                                        <a
                                            href="mailto:admin@fasanahomes.com"
                                            className="font-light text-[length:var(--typeface-paragraph-text)] text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface-default)] transition-colors inline-flex items-center gap-2 w-fit group"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a16,16,0,0,0,21.82,0L216,74.19V192Z" />
                                            </svg>
                                            <span className="underline decoration-solid underline-offset-4 group-hover:decoration-[color:var(--on-surface-default)] decoration-[color:var(--on-surface-variant)] transition-all">
                                                admin@fasanahomes.com
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Credits Section ──────────────────────────────────── */}
                <div className="flex flex-col gap-8">
                    {/* Divider */}
                    <div className="h-px w-full bg-[var(--outline-default)]" />

                    {/* Bottom row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-60">
                        {/* Copyright */}
                        <p className="font-light text-[length:var(--typeface-paragraph-text-s)] leading-6 text-[color:var(--on-surface-variant)]">
                            &copy; 2026 Fasana Homes. All Rights Reserved.
                        </p>

                        {/* Privacy & Terms */}
                        <p className="font-light text-[length:var(--typeface-paragraph-text-s)] leading-6 text-[color:var(--on-surface-variant)]">
                            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                            {'  |  '}
                            <Link href="/terms" className="hover:underline">Terms of Service</Link>
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-2 items-center text-[color:var(--on-surface-variant)]">
                            <a href="#" aria-label="Facebook" className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity">
                                <FacebookIcon />
                            </a>
                            <a href="#" aria-label="Instagram" className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity">
                                <InstagramIcon />
                            </a>
                            <a href="#" aria-label="X" className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity">
                                <XIcon />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity">
                                <LinkedInIcon />
                            </a>
                            <a href="#" aria-label="YouTube" className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity">
                                <YoutubeIcon />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
