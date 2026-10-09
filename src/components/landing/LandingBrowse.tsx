import Link from 'next/link';
import { Property } from '@/lib/types';
import { PROPERTY_TYPE_LABELS } from '@/lib/properties';

interface Chip {
    label: string;
    count: number;
    href: string;
}

function countBy(properties: Property[], key: (p: Property) => string | undefined) {
    const counts = new Map<string, number>();
    properties.forEach((p) => {
        const value = key(p);
        if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

function ChipGroup({ title, chips }: { title: string; chips: Chip[] }) {
    // One option isn't a choice, so the group only shows when there are at least two
    if (chips.length < 2) return null;

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-[length:var(--typeface-heading-h4)] font-normal text-[color:var(--on-surface-default)]">{title}</h3>
            <div className="flex flex-wrap gap-3">
                {chips.map((chip) => (
                    <Link
                        key={chip.href}
                        href={chip.href}
                        className="inline-flex items-center gap-2 h-11 px-4 rounded-full border border-[var(--outline-default)] bg-white text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--on-surface-default)] hover:border-[var(--action-border-hover)] hover:bg-[var(--surface-variant)] transition-colors"
                    >
                        {chip.label}
                        <span className="text-[color:var(--text-secondary)]">{chip.count}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function LandingBrowse({ properties }: { properties: Property[] }) {
    const areas = countBy(properties, (p) => p.city).map(([city, count]) => ({
        label: city,
        count,
        href: `/rentals?city=${encodeURIComponent(city)}`,
    }));
    const types = countBy(properties, (p) => p.property_type).map(([type, count]) => ({
        label: PROPERTY_TYPE_LABELS[type as Property['property_type']] ?? type,
        count,
        href: `/rentals?type=${type}`,
    }));

    if (areas.length < 2 && types.length < 2) return null;

    return (
        <section className="w-full py-12 lg:py-16 px-5 sm:px-8 lg:px-16 bg-[var(--surface-variant)]">
            <h2 className="mb-8 text-[length:var(--typeface-heading-h2)] font-normal leading-none tracking-[-0.24px] text-[color:var(--on-surface-default)]">
                Browse properties
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <ChipGroup title="By area" chips={areas} />
                <ChipGroup title="By type" chips={types} />
            </div>
        </section>
    );
}
