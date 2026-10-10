import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedBlock from '@/components/ui/AnimatedBlock';
import LandingCTA from '@/components/landing/LandingCTA';
import Icon3D, { type Icon3DName } from '@/components/ui/Icon3D';

export const metadata: Metadata = {
    title: 'About Us',
    description:
        'Fasana means "story" in Urdu. Meet the family behind Fasana Homes: two decades of investing, 35 years of hands-on management and homes tenants stay in for years.',
};

const NUMBERS = [
    { value: '20+', unit: 'yrs', label: 'investing in real estate' },
    { value: '35', unit: 'yrs', label: 'combined hands-on management' },
    { value: '~5', unit: 'yrs', label: 'average tenant stay' },
    { value: '2026', unit: '', label: 'Fasana Homes founded' },
];

const CHAPTERS = [
    {
        n: '01',
        title: 'It started with our own homes',
        body: 'The family behind Fasana began investing in real estate more than 20 years ago, and managed every property themselves. No agency in between, just owners who answered the phone.',
    },
    {
        n: '02',
        title: 'Tenants who stayed',
        body: 'Prompt replies, attention to detail and genuine care added up. Across 35 combined years of hands-on management, tenants stayed for about five years on average.',
    },
    {
        n: '03',
        title: 'Friends and family asked for help',
        body: 'People close to us started asking us to look after their properties the same way. Saying yes, one home at a time, showed us what we should be doing full time.',
    },
    {
        n: '04',
        title: 'Fasana Homes opens its doors',
        body: 'We made it official: one place to find, compare and view homes across Pakistan, run with the same standards we keep for our own.',
    },
];

const VALUES: { title: string; body: string; icon: Icon3DName }[] = [
    { title: 'Owners first, agents second', body: 'We manage like people who own property, because we do. Decisions are made the way we would make them for our own homes.', icon: 'house' },
    { title: 'Care that keeps tenants', body: 'Homes where residents feel comfortable are homes they stay in. Our five year average stay is the result, not the goal.', icon: 'heart' },
    { title: 'Quick replies, every time', body: 'A leaking tap or a viewing request gets the same answer: fast. Most messages hear back within a day.', icon: 'clock-tower' },
    { title: 'Every listing checked', body: 'If a home is on Fasana, our team has looked at it. No surprises when you arrive for a viewing.', icon: 'check' },
    { title: 'Rooted in community', body: 'We grew from helping friends and family. That is still how we want every landlord and tenant to feel.', icon: 'minar' },
    { title: 'Fair to both sides', body: 'Landlords and tenants get the same honesty and the same standard of service. Good homes need both.', icon: 'scales' },
];

export default function AboutPage() {
    return (
        <div className="flex flex-col w-full bg-[var(--surface-default)]">
            {/* ── 1. Hero: the name is the story ─────────────────────────────── */}
            <section className="relative w-full overflow-hidden px-5 sm:px-8 lg:px-16 pt-[calc(var(--header-height)+56px)] pb-[var(--section-y)]">
                <div className="mx-auto w-full max-w-[var(--content-max)] grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
                    <div>
                        <AnimatedBlock animateOnMount>
                            <h1 className="text-[length:var(--typeface-display-base)] font-normal leading-[1.02] tracking-[-0.03em] text-[color:var(--on-surface-default)]">
                                Every home has a story.
                            </h1>
                        </AnimatedBlock>
                        <AnimatedBlock animateOnMount delay={0.2}>
                            <p className="mt-6 max-w-[520px] font-light text-[length:var(--typeface-heading-subheading)] leading-[1.5] text-[color:var(--on-surface-variant)]">
                                <span className="text-[color:var(--on-surface-default)]">Fasana</span> is Urdu for a tale, a story. We chose it because finding a home is one of the biggest chapters in anyone&apos;s life, and we want to help you write a good one.
                            </p>
                        </AnimatedBlock>
                        <AnimatedBlock animateOnMount delay={0.3} className="mt-8 flex flex-wrap gap-3">
                            <Link href="#our-story" className="btn-primary">Read our story</Link>
                            <Link href="/properties" className="btn-primary bg-transparent text-[color:var(--on-surface-default)] ring-1 ring-inset ring-[var(--outline-default)] hover:bg-[var(--surface-variant)] hover:text-[color:var(--on-surface-default)]">
                                Browse homes
                            </Link>
                        </AnimatedBlock>
                    </div>

                    {/* Arch photo with the calligraphy as a signature */}
                    <AnimatedBlock animateOnMount delay={0.2} className="relative mx-auto w-full max-w-[380px]">
                        {/* Faint فسانہ calligraphy tucked behind the photo, peeking out at the lower left */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/brand/logo-wordmark.png"
                            alt=""
                            aria-hidden="true"
                            draggable={false}
                            className="hidden lg:block pointer-events-none select-none absolute -left-[90%] -bottom-[6%] w-[95%] max-w-none opacity-10"
                        />
                        {/* Photo with hand-painted, brushy edges (SVG noise mask) */}
                        <div
                            className="relative z-10 aspect-[415/739] max-h-[640px] mx-auto"
                            style={{
                                WebkitMaskImage: 'url(/about-us-page/paint-mask.svg)',
                                maskImage: 'url(/about-us-page/paint-mask.svg)',
                                WebkitMaskSize: '100% 100%',
                                maskSize: '100% 100%',
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                            }}
                        >
                            <Image src="/about-us-page/garden-path.jpg" alt="A stone path across the lawn to a modern Fasana home" fill priority sizes="(max-width: 1024px) 90vw, 400px" className="object-cover" />
                        </div>

                    </AnimatedBlock>
                </div>
            </section>

            {/* ── 2. In numbers ─────────────────────────────────────────────── */}
            <section aria-label="Fasana in numbers" className="w-full px-5 sm:px-8 lg:px-16 pb-[var(--section-y)]">
                <dl className="mx-auto w-full max-w-[var(--content-max)] grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--outline-default)] border-y border-[var(--outline-default)]">
                    {NUMBERS.map((n) => (
                        <div key={n.label} className="flex flex-col-reverse bg-[var(--surface-default)] py-8 lg:py-10 px-4 lg:px-8">
                            <dt className="mt-3 text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--on-surface-variant)]">{n.label}</dt>
                            <dd className="text-[length:var(--typeface-heading-h1)] leading-none tracking-[-0.02em] text-[color:var(--on-surface-default)]">
                                {n.value}
                                {n.unit && <span className="ml-1.5 text-[length:var(--typeface-heading-h5)] text-[color:var(--color-green-500)]">{n.unit}</span>}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* ── 3. Our story, told in chapters ───────────────────────────── */}
            <section id="our-story" className="scroll-mt-[var(--header-height)] w-full bg-[var(--surface-variant)] px-5 sm:px-8 lg:px-16 py-[var(--section-y)]">
                <div className="mx-auto w-full max-w-[var(--content-max)] grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20">
                    <div className="lg:sticky lg:top-[calc(var(--header-height)+40px)] self-start">
                        <h2 className="text-[length:var(--typeface-heading-h1)] font-normal leading-[1.05] tracking-[-0.02em]">
                            Our fasana, in four chapters
                        </h2>
                        <p className="mt-5 max-w-[440px] font-light text-[length:var(--typeface-paragraph-text)] leading-[1.6] text-[color:var(--on-surface-variant)]">
                            We didn&apos;t start as an agency. We started as landlords who cared about the people living in our homes.
                        </p>
                        <div className="relative mt-10 hidden lg:block aspect-[4/3] max-w-[440px] rounded-[16px] overflow-hidden">
                            <Image src="/properties/house-19.jpg" alt="A modern Fasana home with a landscaped garden" fill sizes="440px" className="object-cover" />
                        </div>
                    </div>

                    <ol className="relative">
                        {/* Spine */}
                        <span aria-hidden="true" className="absolute left-[19px] top-2 bottom-2 w-px bg-[var(--outline-default)]" />
                        {CHAPTERS.map((c) => (
                            <li key={c.n} className="relative pl-16 pb-12 last:pb-0">
                                <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-[var(--color-green-500)] text-white text-[13px] font-medium">
                                    {c.n}
                                </span>
                                <h3 className="text-[length:var(--typeface-heading-h4)] font-normal leading-10">{c.title}</h3>
                                <p className="mt-3 max-w-[560px] font-light text-[length:var(--typeface-paragraph-text)] leading-[1.6] text-[color:var(--on-surface-variant)]">
                                    {c.body}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* ── 4. What we stand for ─────────────────────────────────────── */}
            <section className="w-full px-5 sm:px-8 lg:px-16 pt-[var(--section-y)]">
                <div className="mx-auto w-full max-w-[var(--content-max)]">
                    <div className="flex flex-col items-center text-center gap-4 mb-10 lg:mb-14">
                        <h2 className="text-[length:var(--typeface-heading-h1)] font-normal leading-[1.05] tracking-[-0.02em]">
                            What we stand for
                        </h2>
                        <p className="max-w-[440px] font-light text-[length:var(--typeface-paragraph-text)] leading-[1.6] text-[color:var(--on-surface-variant)]">
                            Six promises we&apos;ve kept since the first home we managed, and the ones we&apos;ll keep for yours.
                        </p>
                    </div>
                    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {VALUES.map((v) => (
                            <li key={v.title} className="group rounded-[12px] bg-[var(--bg-block,var(--surface-variant))] overflow-hidden">
                                <div className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-[radial-gradient(closest-side_at_50%_55%,var(--color-green-50),transparent)]">
                                    <Icon3D name={v.icon} size={120} className="transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-105" />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-[length:var(--typeface-heading-h5)] font-normal leading-tight">{v.title}</h3>
                                    <p className="mt-2 font-light text-[length:var(--typeface-paragraph-text-s)] leading-[1.6] text-[color:var(--on-surface-variant)]">{v.body}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── 5. Pull quote, leading into the CTA ────────────────────────── */}
            <section className="w-full px-5 sm:px-8 lg:px-16 pt-[var(--section-y)] lg:pt-[calc(var(--section-y)+120px)]">
                <figure className="mx-auto w-full max-w-[900px] text-center">
                    <blockquote className="text-[length:var(--typeface-heading-h2)] font-normal leading-[1.25] tracking-[-0.01em] text-[color:var(--on-surface-default)]">
                        &ldquo;We manage every home the way we&apos;d want ours managed. That&apos;s why tenants stay, and why owners trust us with theirs.&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--on-surface-variant)]">
                        The Fasana family
                    </figcaption>
                </figure>
            </section>

            {/* ── 6. Same CTA band as the homepage ─────────────────────────── */}
            <LandingCTA />
        </div>
    );
}
