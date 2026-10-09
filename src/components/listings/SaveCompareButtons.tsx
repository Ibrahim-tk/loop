'use client';

import toast from 'react-hot-toast';
import { Heart, Scales } from '@phosphor-icons/react';
import { MAX_COMPARE, useSavedHydrated, useSavedProperties } from '@/stores/savedProperties';
import { cn } from '@/lib/utils';

interface ButtonProps {
    propertyId: string;
    propertyTitle: string;
    /** "icon" sits on top of card images; "full" is a labelled button for detail pages. */
    variant?: 'icon' | 'full';
    className?: string;
}

// Buttons live inside card links, so they must not trigger navigation
const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
};

const iconBase =
    'flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md transition-all active:scale-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--action-primary)]';
const fullBase =
    'inline-flex items-center justify-center gap-2 h-12 px-5 rounded-[6px] border text-[length:var(--typeface-paragraph-text-s)] font-medium transition-colors';

export function FavouriteButton({ propertyId, propertyTitle, variant = 'icon', className }: ButtonProps) {
    const hydrated = useSavedHydrated();
    const isSaved = useSavedProperties((s) => s.favourites.includes(propertyId)) && hydrated;
    const toggle = useSavedProperties((s) => s.toggleFavourite);

    const onClick = (e: React.MouseEvent) => {
        stop(e);
        toggle(propertyId);
        toast.success(isSaved ? `Removed “${propertyTitle}” from saved` : `Saved “${propertyTitle}”`, { id: `fav-${propertyId}` });
    };

    const label = isSaved ? `Remove ${propertyTitle} from saved` : `Save ${propertyTitle}`;
    const icon = <Heart size={variant === 'icon' ? 20 : 18} weight={isSaved ? 'fill' : 'regular'} className={isSaved ? 'text-[color:var(--action-danger)]' : undefined} />;

    if (variant === 'full') {
        return (
            <button type="button" onClick={onClick} aria-pressed={isSaved} aria-label={label}
                className={cn(fullBase, isSaved ? 'border-[var(--action-danger)] text-[color:var(--action-danger)] bg-[var(--color-red-50)]' : 'border-[var(--outline-default)] bg-white hover:border-[var(--action-border-hover)]', className)}>
                {icon}
                {isSaved ? 'Saved' : 'Save'}
            </button>
        );
    }

    return (
        <button type="button" onClick={onClick} aria-pressed={isSaved} aria-label={label} title={isSaved ? 'Saved' : 'Save'}
            className={cn(iconBase, 'bg-white/90 text-[color:var(--text-primary)] hover:bg-white', className)}>
            {icon}
        </button>
    );
}

export function CompareButton({ propertyId, propertyTitle, variant = 'icon', className }: ButtonProps) {
    const hydrated = useSavedHydrated();
    const isComparing = useSavedProperties((s) => s.compare.includes(propertyId)) && hydrated;
    const toggle = useSavedProperties((s) => s.toggleCompare);

    const onClick = (e: React.MouseEvent) => {
        stop(e);
        const ok = toggle(propertyId);
        if (!ok) {
            toast.error(`You can compare up to ${MAX_COMPARE} properties. Remove one first.`, { id: 'compare-full' });
        }
    };

    const label = isComparing ? `Remove ${propertyTitle} from comparison` : `Add ${propertyTitle} to comparison`;
    const icon = <Scales size={variant === 'icon' ? 20 : 18} weight={isComparing ? 'fill' : 'regular'} />;

    if (variant === 'full') {
        return (
            <button type="button" onClick={onClick} aria-pressed={isComparing} aria-label={label}
                className={cn(fullBase, isComparing ? 'border-[var(--action-primary)] bg-[var(--action-primary)] text-[color:var(--text-inverse)]' : 'border-[var(--outline-default)] bg-white hover:border-[var(--action-border-hover)]', className)}>
                {icon}
                {isComparing ? 'Comparing' : 'Compare'}
            </button>
        );
    }

    return (
        <button type="button" onClick={onClick} aria-pressed={isComparing} aria-label={label} title={isComparing ? 'In comparison' : 'Compare'}
            className={cn(iconBase, isComparing ? 'bg-[var(--action-primary)] text-[color:var(--text-inverse)]' : 'bg-white/90 text-[color:var(--text-primary)] hover:bg-white', className)}>
            {icon}
        </button>
    );
}
