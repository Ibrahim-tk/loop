'use client';

import { LogoMark } from '@/components/brand/Logo';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-primary-500/90 backdrop-blur-xl shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'
                : 'bg-transparent'
                }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-[9px] group">
                        <LogoMark title="Fasana Homes" className="h-[50px] w-auto" />
                        <div className="flex flex-col">
                            <span className="text-[16px] font-bold tracking-tight text-white leading-tight">
                                FASANA
                            </span>
                            <span className="text-[14px] font-light text-white/80 leading-tight">
                                HOMES
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-base leading-6 transition-colors duration-300 ${pathname === link.href
                                    ? 'text-white'
                                    : 'text-white/70 hover:text-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden lg:flex items-center gap-4">

                        <Link
                            href="/contact"
                            style={{ background: 'rgba(0,0,0,0.10)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                            className="px-[22.5px] py-[15px] rounded-[6px] text-sm font-medium text-white border border-white/20 transition-all hover:border-white/30"
                        >
                            List Your Property
                        </Link>
                        <Link
                            href="/contact"
                            className="px-[22px] py-[15px] rounded-md bg-[var(--action-primary)] text-sm font-medium text-white text-center min-w-[80px] transition-colors hover:bg-[var(--action-primary-hover)]"
                        >
                            Contact an agent
                        </Link>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="lg:hidden relative z-50 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <X className="h-6 w-6 text-white" />
                        ) : (
                            <Menu className="h-6 w-6 text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-t border-white/10 bg-primary-500/95 backdrop-blur-xl"
                    >
                        <div className="px-4 py-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-base transition-colors ${pathname === link.href
                                        ? 'bg-white/10 text-white'
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 space-y-3">

                                <Link
                                    href="/contact"
                                    onClick={() => setIsOpen(false)}
                                    style={{ background: 'rgba(0,0,0,0.10)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                                    className="block text-center px-[22.5px] py-[15px] rounded-[6px] text-sm font-medium text-white border border-white/20"
                                >
                                    List Your Property
                                </Link>
                                <Link
                                    href="/contact"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center px-5 py-3 rounded-md bg-[var(--action-primary)] text-sm font-medium text-white"
                                >
                                    Contact an agent
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
