'use client';

import { X } from '@phosphor-icons/react';
import type { FilterChip } from '@/lib/properties';

interface ActiveFilterChipsProps {
    chips: FilterChip[];
    onRemove: (chip: FilterChip) => void;
    onClearAll: () => void;
}

export default function ActiveFilterChips({ chips, onRemove, onClearAll }: ActiveFilterChipsProps) {
    if (chips.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
            {chips.map((chip) => (
                <button
                    key={`${chip.key}-${chip.value ?? ''}`}
                    type="button"
                    onClick={() => onRemove(chip)}
                    aria-label={`Remove filter ${chip.label}`}
                    className="group inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-[var(--bg-block)] border border-[var(--outline-default)] text-[length:var(--typeface-paragraph-text-s)] text-[color:var(--text-primary)] hover:border-[var(--action-border-hover)] transition-colors"
                >
                    {chip.label}
                    <X size={12} weight="bold" className="text-[color:var(--text-secondary)] group-hover:text-[color:var(--text-primary)]" />
                </button>
            ))}
            <button
                type="button"
                onClick={onClearAll}
                className="px-2 py-1.5 text-[length:var(--typeface-paragraph-text-s)] font-medium underline text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
            >
                Clear all
            </button>
        </div>
    );
}
