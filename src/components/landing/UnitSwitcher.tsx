'use client';

import { useEffect } from 'react';
import { usePrefs, type AreaUnit, type Currency } from '@/lib/store';
import { cn } from '@/lib/utils';
import Dropdown from '@/components/ui/Dropdown';

const CURRENCIES: Currency[] = ['PKR', 'USD', 'AED', 'GBP', 'SAR'];
const AREA_UNITS: { value: AreaUnit; label: string }[] = [
    { value: 'MARLA', label: 'Marla' },
    { value: 'KANAL', label: 'Kanal' },
    { value: 'SQFT', label: 'sq ft' },
];

/** Currency + area unit pickers. Prices are stored in PKR and areas in sq ft; this only changes display. */
export default function UnitSwitcher({ className }: { className?: string }) {
    const { currency, areaUnit, setCurrency, setAreaUnit } = usePrefs();

    useEffect(() => {
        usePrefs.persist.rehydrate();
    }, []);

    const selectClass =
        'h-9 rounded-[6px] border border-[var(--outline-default)] bg-white/70 pl-2.5 pr-7 text-[length:var(--typeface-paragraph-text-s)] font-medium text-[var(--text-primary)] cursor-pointer hover:bg-white transition-colors';

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Dropdown
                aria-label="Currency"
                title="Prices converted at indicative rates"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className={selectClass}
            >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Dropdown>
            <Dropdown
                aria-label="Area unit"
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                className={selectClass}
            >
                {AREA_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
            </Dropdown>
        </div>
    );
}
