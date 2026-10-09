import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import AnimatedBlock from '@/components/ui/AnimatedBlock';

const services = [
    {
        title: 'Property Management',
        description:
            'Rent collected. Leases handled. Financial reports delivered. You just sit back and cash the check.',
        cta: 'Get Management Details',
        href: '/services',
        image: '/landing-page/image1.webp',
    },
    {
        title: 'Maintenance & Repairs',
        description:
            'Something breaks, we fix it — fast. Your property stays in top shape without a single phone call from you.',
        cta: 'Discuss Property Upkeep',
        href: '/services',
        image: '/landing-page/image2.webp',
    },
    {
        title: 'Tenant Screening',
        description:
            'Background checks. Credit checks. Rental history. We fill your units with tenants who pay on time and stay long.',
        cta: 'Start Tenant Screening',
        href: '/rentals',
        image: '/landing-page/image3.webp',
    },
];

export default function LandingServices() {
    return (
        <section className="bg-white w-full flex flex-col md:flex-row items-stretch justify-center owerflow-hidden">
            {services.map((service, index) => (
                <AnimatedBlock
                    key={service.title}
                    delay={index * 0.2}
                    className="group relative flex flex-col w-full md:w-1/3 h-[480px] sm:h-[560px] lg:h-[720px] items-start justify-end p-6 sm:p-8 lg:px-10 lg:py-8 overflow-hidden"
                >
                    {/* Background image — zooms in 5% on hover */}
                    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                        <Image
                            src={service.image}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {/* Dark gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                    </div>

                    {/* Content — Micro-interactive */}
                    <div className="relative flex flex-col w-full mt-auto">
                        {/* Text Block - Slides up on hover */}
                        <div className="flex flex-col gap-4 sm:gap-6 w-full transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[4rem] sm:group-hover:-translate-y-[4.5rem]">
                            <h3 className="text-white text-[length:var(--typeface-heading-h3)] font-normal leading-8">
                                {service.title}
                            </h3>
                            <p className="text-white font-light text-[length:var(--typeface-heading-subheading)] leading-7 drop-shadow-sm">
                                {service.description}
                            </p>
                        </div>

                        {/* CTA & Line - Hidden initially, fades and slides up on hover */}
                        <div className="absolute bottom-0 left-0 w-full flex flex-col opacity-0 translate-y-6 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                            <Link
                                href={service.href}
                                className="group/link flex gap-2 items-center text-[length:var(--typeface-paragraph-text-s)] font-medium text-white pb-5 w-fit"
                            >
                                <span className="relative z-10">{service.cta}</span>
                                <ArrowRight
                                    size={18}
                                    weight="bold"
                                    className="opacity-0 -translate-x-4 transition-all duration-500 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover/link:translate-x-1.5"
                                />
                            </Link>
                            {/* Card full-width bottom line expands on hover */}
                            <div className="w-full h-[1px] bg-white/40 transform scale-x-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                        </div>
                    </div>
                </AnimatedBlock>
            ))}
        </section>
    );
}
