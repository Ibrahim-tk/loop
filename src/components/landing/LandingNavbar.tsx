'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Heart } from '@phosphor-icons/react';
import WhatsappIcon from '@/components/ui/WhatsappIcon';
import { useSavedHydrated, useSavedProperties } from '@/stores/savedProperties';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/lib/constants/contact';

interface LandingNavbarProps {
    variant?: 'landing' | 'inner';
}

export default function LandingNavbar({ variant = 'landing' }: LandingNavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const hydrated = useSavedHydrated();
    const savedCount = useSavedProperties((s) => s.favourites.length);
    const saved = { href: '/favourites', label: 'Saved', Icon: Heart, count: hydrated ? savedCount : 0 };
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



    return (
        <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50">

            {/* Navbar */}
            <div className="px-3 sm:px-5 lg:px-8 pt-3">
            <nav
                className={`${'mx-auto w-full max-w-[var(--content-max)]'} rounded-[12px] border overflow-hidden transition-[background-color,border-color,box-shadow] duration-300 ease-in-out bg-white/35 backdrop-blur-2xl backdrop-saturate-[1.8] border-white/20 shadow-[0_8px_32px_rgba(10,13,18,0.10),inset_0_1px_0_rgba(255,255,255,0.35)]`}
            >
                <div className="h-[var(--navbar-height)] flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] gap-6 xl:gap-8 pl-5 pr-2.5">
                    <Link href="/" className="relative shrink-0 flex items-center justify-self-start h-[22px] sm:h-[26px]" onClick={() => setIsOpen(false)}>
                        <img
                            src="/brand/logo-dark.png"
                            alt="Fasana Homes"
                            className={`h-full w-auto object-contain transition-opacity duration-300 opacity-100`}
                        />
                    </Link>

                    <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 rounded-[8px] text-[length:var(--typeface-paragraph-text)] font-medium leading-6 text-[var(--text-primary)] hover:text-[var(--action-primary-hover)] transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden lg:flex justify-self-end items-center gap-3">
                    <Link
                        href={saved.href}
                        aria-label={saved.count ? `${saved.label} (${saved.count})` : saved.label}
                        title={saved.label}
                        className="relative flex items-center justify-center size-11 rounded-[8px] bg-white/70 text-[var(--text-primary)] hover:bg-white transition-colors duration-300"
                    >
                        <saved.Icon size={20} />
                        {saved.count > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full bg-[var(--color-green-500)] text-[11px] leading-5 text-center text-white">{saved.count}</span>
                        )}
                    </Link>
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Chat on WhatsApp: ${WHATSAPP_DISPLAY}`}
                        className="btn-primary"
                    >
                        <WhatsappIcon size={20} />
                        {WHATSAPP_DISPLAY}
                    </a>
                    </div>

                    <button
                        className={`lg:hidden p-2 rounded-lg transition-colors duration-300 z-50 relative text-[var(--text-primary)] hover:bg-black/5`}
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
                            <div className="grid grid-cols-1 gap-3">
                                {[saved].map(({ href, label, Icon, count }) => (
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
                            <a
                                href={WHATSAPP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsOpen(false)}
                                className="btn-primary w-full"
                            >
                                <WhatsappIcon size={20} />
                                {WHATSAPP_DISPLAY}
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
            </div>
        </header>
    );
}
