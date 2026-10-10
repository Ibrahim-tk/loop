import Link from 'next/link';
import { Property } from '@/lib/types';
import { PROPERTY_TYPE_LABELS } from '@/lib/properties';
import Icon3D, { type Icon3DName } from '@/components/ui/Icon3D';

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

const CITY_ICONS: Record<string, Icon3DName> = {
    lahore: 'minar',
    islamabad: 'faisal-mosque',
    karachi: 'mazar-quaid',
    rawalpindi: 'clock-tower',
    peshawar: 'khyber-gate',
};

/** `large` stretches the cards across the full row (one column per item) with bigger icons. */
function IconCards({ title, chips, large = false }: { title: string; chips: (Chip & { icon: Icon3DName })[]; large?: boolean }) {
    if (chips.length < 2) return null;

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-[length:var(--typeface-heading-h4)] font-normal text-[color:var(--on-surface-default)]">{title}</h3>
            <div
                className={large ? 'grid grid-cols-2 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-4' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'}
                style={large ? ({ '--cols': chips.length } as React.CSSProperties) : undefined}
            >
                {chips.map((chip) => (
                    <Link
                        key={chip.href}
                        href={chip.href}
                        className={`group flex flex-col items-center gap-4 ${large ? 'pt-10 pb-8' : 'pt-6 pb-5'} px-4 rounded-[var(--radius-md)] border border-[var(--outline-default)] bg-white hover:border-[var(--action-border-hover)] hover:-translate-y-0.5 transition-all`}
                    >
                        <Icon3D name={chip.icon} size={large ? 136 : 88} className="transition-transform group-hover:scale-105" />
                        <span className="flex flex-col items-center gap-0.5">
                            <span className="text-[length:var(--typeface-paragraph-text)] font-medium text-[color:var(--on-surface-default)]">{chip.label}</span>
                            <span className="text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-secondary)]">
                                {chip.count} {chip.count === 1 ? 'listing' : 'listings'}
                            </span>
                        </span>
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
        href: `/properties?city=${encodeURIComponent(city)}`,
        icon: CITY_ICONS[city.toLowerCase()] ?? 'city',
    }));
    const types = countBy(properties, (p) => p.property_type).map(([type, count]) => ({
        label: PROPERTY_TYPE_LABELS[type as Property['property_type']] ?? type,
        count,
        href: `/properties?type=${type}`,
        icon: type.toLowerCase() as Icon3DName,
    }));

    if (areas.length < 2 && types.length < 2) return null;

    return (
        <section className="w-full py-[var(--section-y)] px-5 sm:px-8 lg:px-16 bg-white">
            <div className="mx-auto w-full max-w-[var(--content-max)]">
            <h2 className="mb-[var(--section-head)] text-[length:var(--typeface-heading-h2)] font-normal leading-none tracking-[-0.24px] text-[color:var(--on-surface-default)]">
                Browse properties
            </h2>
            <div className="flex flex-col gap-12">
                <IconCards title="By area" chips={areas} large />
                <IconCards title="By type" chips={types} />
            </div>
            </div>
        </section>
    );
}
