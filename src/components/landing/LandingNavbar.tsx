'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Heart, Scales } from '@phosphor-icons/react';
import { useSavedHydrated, useSavedProperties } from '@/stores/savedProperties';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/rentals', label: 'Properties' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

interface LandingNavbarProps {
    variant?: 'landing' | 'inner';
    showBanner?: boolean;
}

export default function LandingNavbar({ variant = 'landing', showBanner = true }: LandingNavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const hydrated = useSavedHydrated();
    const savedCount = useSavedProperties((s) => s.favourites.length);
    const compareCount = useSavedProperties((s) => s.compare.length);
    const shortcuts = [
        { href: '/favourites', label: 'Saved', Icon: Heart, count: hydrated ? savedCount : 0 },
        { href: '/compare', label: 'Compare', Icon: Scales, count: hydrated ? compareCount : 0 },
    ];
    const [scrolled, setScrolled] = useState(variant === 'inner');
    const headerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;
        const ro = new ResizeObserver(([entry]) => {
            document.documentElement.style.setProperty(
                '--header-height',
                `${entry.contentRect.height}px`
            );
        });
        ro.observe(header);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (variant === 'inner') return;
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
        };
        handleScroll();
        requestAnimationFrame(handleScroll);
        window.addEventListener('scroll', handleScroll, { passive: true });
        document.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('scroll', handleScroll);
        };
    }, [variant]);

    // Force solid navbar background when the menu is opened
    const isSolid = scrolled || isOpen;

    // Only hide the announcement if we actually scrolled down or banner is disabled
    const hideAnnouncement = !showBanner || (variant === 'landing' && scrolled);

    return (
        <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
            {/* Announcement Bar */}
            <div
                className={`bg-[var(--action-primary)] flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-8 lg:px-16 shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] overflow-hidden transition-all duration-300 ease-in-out ${hideAnnouncement ? 'max-h-0 py-0 opacity-0' : 'max-h-[60px] py-1.5 sm:py-2 opacity-100'
                    }`}
            >
                <span className="text-white font-light text-[14px] sm:text-[length:var(--typeface-paragraph-text-s)] lg:text-[length:var(--typeface-paragraph-text)] leading-tight sm:leading-6 text-center">
                    Accepting new properties.
                </span>
                <Link
                    href="/rental-analysis"
                    className="text-white text-[14px] sm:text-[length:var(--typeface-paragraph-text-s)] lg:text-[length:var(--typeface-paragraph-text)] leading-tight sm:leading-6 underline decoration-solid hover:text-white/80 transition-colors text-center"
                >
                    Get a Free Rental Analysis
                </Link>
            </div>

            {/* Navbar */}
            <nav
                className={`w-full shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] transition-[background-color,border-color] duration-300 ease-in-out ${isSolid
                    ? 'bg-white border-b border-[var(--border-default)]'
                    : 'bg-transparent border-b border-transparent'
                    }`}
            >
                <div className="flex items-center justify-between px-5 sm:px-8 lg:px-16 py-2">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="relative shrink-0 flex items-center h-[48px] sm:h-[56px] lg:h-[56px]" onClick={() => setIsOpen(false)}>
                            <img
                                src="/landing-page/logo.svg"
                                alt="Blue Pillar Management"
                                className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-300 ${isSolid ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            />
                            <img
                                src="/landing-page/logo-dark.svg"
                                alt="Blue Pillar Management"
                                className={`h-full w-auto object-contain transition-opacity duration-300 ${isSolid ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            />
                        </Link>

                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-[length:var(--typeface-paragraph-text)] leading-6 transition-colors duration-300 ${isSolid
                                        ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        : 'text-white hover:text-white/80'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        {shortcuts.map(({ href, label, Icon, count }) => (
                            <Link
                                key={href}
                                href={href}
                                aria-label={count ? `${label} (${count})` : label}
                                className={`relative flex items-center gap-2 h-[50px] px-4 rounded-[6px] border text-[length:var(--typeface-paragraph-text-s)] font-medium whitespace-nowrap transition-all duration-300 ${isSolid
                                    ? 'text-[var(--text-primary)] border-[var(--outline-default)] hover:border-[var(--action-border-hover)]'
                                    : 'text-white border-white/60 hover:bg-white hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <Icon size={18} />
                                {label}
                                {count > 0 && (
                                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-[var(--color-green-500)] text-[11px] leading-5 text-center text-white">{count}</span>
                                )}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className={`flex items-center justify-center px-[22.5px] py-[15px] rounded-[6px] text-[length:var(--typeface-paragraph-text-s)] font-medium text-white leading-normal min-w-[80px] whitespace-nowrap transition-colors duration-300 ${isSolid
                                ? 'bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)]'
                                : 'bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)]'
                                }`}
                        >
                            Contact an agent
                        </Link>
                    </div>

                    <button
                        className={`lg:hidden p-2 rounded-lg transition-colors duration-300 z-50 relative ${isSolid
                            ? 'text-[var(--text-primary)] hover:bg-black/5'
                            : 'text-white hover:bg-white/10'
                            }`}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown - Slides down from navbar */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[calc(100dvh-120px)] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div
                        className={`px-5 py-6 space-y-1 transition-colors duration-300 bg-white border-t border-[var(--border-default)]`}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-[length:var(--typeface-paragraph-text)] rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                {shortcuts.map(({ href, label, Icon, count }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 px-4 py-[15px] rounded-[6px] border border-[var(--outline-default)] text-[length:var(--typeface-paragraph-text-s)] font-medium text-[var(--text-primary)]"
                                    >
                                        <Icon size={18} />
                                        {label}
                                        {count > 0 && (
                                            <span className="min-w-5 h-5 px-1.5 rounded-full bg-[var(--color-green-500)] text-[11px] leading-5 text-center text-white">{count}</span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="block text-center px-[22.5px] py-[15px] rounded-[6px] text-[length:var(--typeface-paragraph-text-s)] font-medium text-white bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)]"
                            >
                                Contact an agent
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
