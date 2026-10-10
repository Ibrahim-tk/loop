import Link from 'next/link';
import { ArrowRight, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import { WHATSAPP_URL } from '@/lib/constants/contact';

export default function LandingCTA() {
    return (
        <section className="w-full py-[var(--section-y)] px-5 sm:px-8 lg:px-16 bg-[var(--on-surface-primary)] text-white">
            <div className="mx-auto w-full max-w-[var(--content-max)] flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="max-w-[640px]">
                    <h2 className="text-[length:var(--typeface-heading-h2)] font-normal leading-tight tracking-[-0.24px]">
                        Your next home is a viewing away
                    </h2>
                    <p className="mt-4 font-light text-white/80 text-[length:var(--typeface-paragraph-text)]">
                        Browse verified homes for rent and sale across Pakistan, compare them side by side and book a free viewing in minutes. No account needed.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                    <Link href="/properties" className="inline-flex items-center gap-2 h-12 px-6 rounded-[8px] bg-white text-[color:var(--on-surface-primary)] font-medium hover:bg-white/90 transition-colors">
                        Browse properties <ArrowRight size={18} />
                    </Link>
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-12 px-6 rounded-[8px] ring-1 ring-white/40 font-medium hover:bg-white/10 transition-colors">
                        <WhatsappLogo size={18} /> Talk to us
                    </a>
                </div>
            </div>
        </section>
    );
}
