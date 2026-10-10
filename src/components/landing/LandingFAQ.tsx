import { Plus } from '@phosphor-icons/react/dist/ssr';

const FAQS = [
    {
        q: 'Do I need an account to book a viewing?',
        a: 'No. Pick a time on any listing and leave your name and number. We confirm on WhatsApp or by phone, usually the same day.',
    },
    {
        q: 'Are viewings free?',
        a: 'Yes. Viewings cost nothing and there is no obligation to rent or buy afterwards.',
    },
    {
        q: 'How current are the listings?',
        a: 'Our team checks every listing before it goes live and takes it down as soon as it is let or sold, so what you see is available.',
    },
    {
        q: 'What do I need to rent a property?',
        a: 'Usually a copy of your CNIC, proof of income and the security deposit agreed with the owner. We walk you through the paperwork.',
    },
    {
        q: 'Can I compare properties before deciding?',
        a: 'Yes. Use the compare button on any listing to see up to four properties side by side: price, area, rooms and amenities.',
    },
    {
        q: 'Do you charge tenants a commission?',
        a: 'Our fee is agreed upfront and shown before you sign anything. There are no hidden charges.',
    },
];

export default function LandingFAQ() {
    return (
        <section className="w-full py-[var(--section-y)] px-5 sm:px-8 lg:px-16 bg-[var(--surface-variant)]">
            <div className="mx-auto w-full max-w-[var(--content-max)] grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
                <div>
                    <h2 className="text-[length:var(--typeface-heading-h2)] font-normal leading-none tracking-[-0.24px] text-[color:var(--on-surface-default)]">
                        Frequently asked questions
                    </h2>
                    <p className="mt-4 max-w-[360px] text-[color:var(--text-secondary)]">
                        Everything you need to know before you book a viewing.
                    </p>
                </div>
                <div className="flex flex-col">
                    {FAQS.map((item) => (
                        <details key={item.q} className="group border-b border-[var(--outline-default)] first:border-t">
                            <summary className="flex items-center justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-[length:var(--typeface-heading-subheading)] text-[color:var(--on-surface-default)]">
                                {item.q}
                                <Plus size={20} className="shrink-0 transition-transform duration-200 group-open:rotate-45" />
                            </summary>
                            <p className="pb-6 pr-10 max-w-[640px] text-[color:var(--text-secondary)]">{item.a}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
