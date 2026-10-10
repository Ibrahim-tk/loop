import Image from 'next/image';
import Link from 'next/link';

// Transparent cutout of a home; it sits on the band's bottom edge and pokes out above it
const HOUSE = '/landing-page/cta-house.webp';

export default function LandingCTA() {
    return (
        // Top padding leaves room for the portrait to break out above the band
        <section className="w-full px-5 sm:px-8 lg:px-16 pt-[var(--section-y)] lg:pt-[calc(var(--section-y)+120px)] pb-[var(--section-y)]">
            <div className="relative mx-auto w-full max-w-[var(--content-max)] rounded-[16px] bg-[var(--color-green-500)] text-white">
                {/* Soft diagonal shards echoing the logo, clipped to the band */}
                <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[16px]">
                    <span className="absolute -left-24 -bottom-24 h-72 w-72 rotate-45 rounded-[40px] bg-white/[0.06]" />
                    <span className="absolute -left-10 top-10 h-40 w-40 rotate-45 rounded-[28px] bg-white/[0.05]" />
                    <span className="absolute -right-20 -top-20 h-80 w-80 rotate-45 rounded-[48px] bg-white/[0.06]" />
                    <span className="absolute right-24 -bottom-28 h-56 w-56 rotate-45 rounded-[36px] bg-black/[0.06]" />
                </div>

                <div className="relative">
                    <div className="max-w-[560px] px-6 sm:px-10 lg:px-14 py-12 lg:py-16">
                        <h2 className="text-[length:var(--typeface-heading-h2)] font-normal leading-tight tracking-[-0.24px]">
                            Your next home is a viewing away
                        </h2>
                        <p className="mt-4 font-light text-white/85 text-[length:var(--typeface-paragraph-text)]">
                            Browse verified homes for rent and sale across Pakistan, compare them side by side and book a free viewing in minutes. No account needed.
                        </p>
                        <Link href="/contact" className="btn-primary mt-8 bg-transparent ring-1 ring-inset ring-white hover:bg-black hover:ring-black">
                            Contact us
                        </Link>
                    </div>

                </div>

                {/* House cutout, anchored to the bottom right and breaking out of the top */}
                <div className="pointer-events-none absolute bottom-0 right-0 hidden lg:block w-[min(56%,760px)] aspect-[2000/872]">
                    <Image src={HOUSE} alt="" fill sizes="(max-width: 1280px) 56vw, 760px" className="object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]" />
                </div>
            </div>
        </section>
    );
}
