import Link from 'next/link';
import HeroVideo from '@/components/landing/HeroVideo';
import AnimatedHeading from '@/components/ui/AnimatedHeading';
import AnimatedBlock from '@/components/ui/AnimatedBlock';

export default function LandingHero() {
    return (
        <section className="relative w-full h-[100dvh] overflow-hidden">
            <HeroVideo />

            {/* Hero Content — Centered vertically, aligned left up to max-width */}
            <div className="relative z-10 w-full h-full flex flex-col items-start justify-center px-5 sm:px-8 lg:px-16">
                <div className="w-full pt-[60px] lg:pt-[80px]">
                    <div className="flex flex-col gap-8 sm:gap-12 items-start text-left">
                        {/* Heading + Description */}
                        <div className="flex flex-col gap-4 sm:gap-6 items-start text-white max-w-[900px]">
                            <div className="flex flex-col gap-3 sm:gap-4 w-full">
                                <AnimatedHeading as="p" className="text-[length:var(--typeface-heading-h5)] font-normal leading-normal">
                                    MANAGEMENT &amp; RENOVATION EXPERTS
                                </AnimatedHeading>
                                <AnimatedHeading as="h1" delay={0.2} className="text-[length:var(--typeface-display-base)] font-normal leading-none tracking-[-0.5px] sm:tracking-[-0.8px] lg:tracking-[-1.2px]">
                                    Exceptional Property Management You Can Trust.
                                </AnimatedHeading>
                            </div>
                            <AnimatedBlock delay={0.4}>
                                <p className="font-light text-[length:var(--typeface-heading-subheading)] leading-7 max-w-full lg:max-w-[768px]">
                                    We handle the day-to-day management of your rental properties so you don&apos;t have to. Experience stress-free ownership, reliable tenants, and proactive maintenance.
                                </p>
                            </AnimatedBlock>
                        </div>

                        {/* CTA Buttons */}
                        <AnimatedBlock delay={0.6} className="flex flex-col sm:flex-row gap-3 items-start justify-start w-full sm:w-auto">
                            <Link
                                href="/rental-analysis"
                                className="w-full sm:w-auto bg-[var(--surface-variant)] flex items-center justify-center px-[22.5px] py-[15px] rounded-[6px] text-[length:var(--typeface-paragraph-text-s)] font-medium text-[color:var(--on-surface-default)] leading-normal hover:bg-[#efefef] transition-colors text-center"
                            >
                                Get a Free Rental Analysis
                            </Link>
                            <Link
                                href="/contact"
                                className="w-full sm:w-auto bg-[var(--on-surface-primary)] flex items-center justify-center px-[22.5px] py-[15px] rounded-[6px] text-[length:var(--typeface-paragraph-text-s)] font-medium text-white leading-normal hover:bg-[var(--foundation-blue-blue-7)] transition-colors text-center"
                            >
                                Contact Us
                            </Link>
                        </AnimatedBlock>
                    </div>
                </div>
            </div>
        </section>
    );
}
