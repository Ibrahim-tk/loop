import Icon3D from '@/components/ui/Icon3D';

// Placeholder quotes for the demo; swap for real reviews before launch
const TESTIMONIALS = [
    {
        quote: 'Booked a viewing on Friday night and had the keys to our flat in DHA by the next weekend. No back and forth, no surprises.',
        name: 'Ayesha R.',
        detail: 'Rented in Lahore',
    },
    {
        quote: 'The compare page made it easy to choose between two houses in F-11. The photos matched what we saw in person.',
        name: 'Hamza K.',
        detail: 'Rented in Islamabad',
    },
    {
        quote: 'They handled the paperwork and the owner in one go. Honest about the fee from the first call.',
        name: 'Sana M.',
        detail: 'Bought in Karachi',
    },
];

const STATS = [
    { value: '4.9/5', label: 'average rating' },
    { value: '1,200+', label: 'viewings booked' },
    { value: '24h', label: 'typical reply time' },
];

export default function LandingTestimonials() {
    return (
        <section className="w-full py-[var(--section-y)] px-5 sm:px-8 lg:px-16 bg-white">
            <div className="mx-auto w-full max-w-[var(--content-max)]">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-[var(--section-head)]">
                    <h2 className="text-[length:var(--typeface-heading-h2)] font-normal leading-none tracking-[-0.24px] text-[color:var(--on-surface-default)]">
                        Trusted by renters and buyers
                    </h2>
                    <dl className="flex flex-wrap gap-x-8 gap-y-3">
                        {STATS.map((s) => (
                            <div key={s.label} className="flex flex-col">
                                <dt className="order-2 text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]">{s.label}</dt>
                                <dd className="order-1 text-[length:var(--typeface-heading-h4)] leading-tight text-[color:var(--on-surface-default)]">{s.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {TESTIMONIALS.map((t) => (
                        <li key={t.name} className="flex flex-col justify-between gap-8 p-6 sm:p-8 rounded-[var(--radius-md)] border border-[var(--outline-default)] bg-white">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-1" role="img" aria-label="5 out of 5 stars">
                                    {Array.from({ length: 5 }, (_, i) => <Icon3D key={i} name="star" size={24} />)}
                                </div>
                                <blockquote className="text-[length:var(--typeface-paragraph-text)] leading-relaxed text-[color:var(--on-surface-default)]">
                                    “{t.quote}”
                                </blockquote>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-[var(--surface-variant)] flex items-center justify-center font-medium text-[color:var(--on-surface-default)]">
                                    {t.name[0]}
                                </span>
                                <div>
                                    <p className="font-medium text-[color:var(--on-surface-default)]">{t.name}</p>
                                    <p className="text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]">{t.detail}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
