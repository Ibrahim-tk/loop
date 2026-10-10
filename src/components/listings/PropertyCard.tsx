'use client';

import { useState } from 'react';
import { usePrefs } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bathtub, CaretRight, SquaresFour } from '@phosphor-icons/react';
import { ImageIcon } from 'lucide-react';
import { Property } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { FavouriteButton } from './SaveCompareButtons';
import { formatArea, formatListingPrice, getListingBadge } from '@/lib/properties';

/** Ghost chevron: the whole card is the link; this just signals it, and turns brand green on hover. */
function ViewChevron() {
    return (
        <CaretRight
            aria-hidden="true"
            size={20}
            weight="bold"
            className="shrink-0 text-[color:var(--on-surface-default)] transition-[color,transform] duration-300 group-hover:text-[color:var(--action-primary-hover)] group-hover:translate-x-0.5"
        />
    );
}

interface PropertyCardProps {
    property: Property;
    viewMode?: 'grid' | 'list';
    isPopular?: boolean;
}

export default function PropertyCard({ property, viewMode = 'grid', isPopular = false }: PropertyCardProps) {
    usePrefs(); // re-render when currency / area unit changes
    const [imageError, setImageError] = useState(false);
    const mainImage = property.property_images?.[0]?.storage_url;
    const hasValidImage = mainImage && !imageError;

    const badge = getListingBadge(property);
    const isFeatured = property.featured && property.status === 'AVAILABLE';
    const displayTag = isPopular && (property.view_count || 0) > 0 ? '🔥 Popular' : isFeatured ? `Featured · ${badge}` : badge;
    const tagClass = isFeatured && !displayTag.includes('🔥')
        ? 'pill-glass'
        : `inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-normal text-white backdrop-blur-[12px] ${displayTag.includes('🔥') ? 'bg-orange-500/80 font-medium' : 'bg-[rgba(0,0,0,0.25)]'}`;
    const price = formatListingPrice(property);

    const handleClick = () => {
        const supabase = createClient();
        supabase.rpc('increment_click', { row_id: property.id }).then(() => {});
    };

    if (viewMode === 'list') {
        return (
            <Link onClick={handleClick} href={`/rentals/${property.id}`} className="group bg-white rounded-[8px] overflow-hidden flex flex-row transition-shadow hover:shadow-[0_4px_12px_rgb(0,0,0,0.02)] block">
                {/* Image — left side */}
                <div className="relative w-[40%] sm:w-[420px] min-h-[150px] sm:h-[230px] shrink-0 overflow-hidden bg-gray-100">
                    {hasValidImage ? (
                        <Image
                            src={mainImage}
                            alt={property.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            sizes="(max-width: 640px) 40vw, 420px"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                            <span className="text-sm text-gray-400">No image</span>
                        </div>
                    )}
                    {/* Tag — left */}
                    <div className="absolute top-3 left-3 hidden sm:block">
                        <span className={tagClass}>{displayTag}</span>
                    </div>
                    {/* Save — right */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                        <FavouriteButton propertyId={property.id} propertyTitle={property.title} />
                    </div>
                </div>

                {/* Content — right side */}
                <div className="flex flex-col justify-between flex-1 min-w-0 gap-2 p-3 sm:p-5">
                    <div className="flex flex-col gap-2 sm:gap-3">
                        {/* Title & Location */}
                        <div className="flex flex-col gap-1 sm:gap-3">
                            <h3 className="text-[16px] sm:text-[20px] font-normal text-[color:var(--on-surface-default)] leading-snug line-clamp-1 transition-colors duration-300 group-hover:text-[var(--foundation-blue-blue-7)]">
                                {property.title}
                            </h3>
                            <p className="text-[13px] sm:text-[16px] font-light text-[color:var(--on-surface-variant)] leading-5 sm:leading-6 line-clamp-1">
                                {property.city}
                            </p>
                        </div>

                        {/* Beds / Baths / Area — spread across full width */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:justify-between w-full text-[13px] sm:text-[16px] font-light text-[color:var(--on-surface-variant)]">
                            <span className="flex items-center gap-1.5">
                                <Bed size={18} weight="light" className="text-[color:var(--on-surface-variant)]" />
                                {property.bedrooms} beds
                            </span>
                            <span className="hidden sm:inline text-[var(--outline-default)]">|</span>
                            <span className="flex items-center gap-1.5">
                                <Bathtub size={18} weight="light" className="text-[color:var(--on-surface-variant)]" />
                                {property.bathrooms} baths
                            </span>
                            <span className="hidden sm:inline text-[var(--outline-default)]">|</span>
                            <span className="flex items-center gap-1.5">
                                <SquaresFour size={18} weight="light" className="text-[color:var(--on-surface-variant)]" />
                                {formatArea(property.sqft)}
                            </span>
                        </div>
                    </div>

                    {/* Price + go-to-details chevron */}
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[18px] sm:text-[24px] font-normal text-[color:var(--on-surface-default)] leading-7 sm:leading-8">
                                {price.amount}
                            </span>
                            {price.suffix && (
                                <span className="text-[14px] font-light text-[color:var(--on-surface-variant)] leading-6">
                                    {price.suffix}
                                </span>
                            )}
                        </div>
                        <ViewChevron />
                    </div>
                </div>
            </Link>
        );
    }

    // Grid view (default)
    return (
        <Link onClick={handleClick} href={`/rentals/${property.id}`} className="group flex flex-col h-full rounded-[8px] overflow-hidden bg-[var(--bg-block)]">
            {/* Image — full bleed */}
            <div className="relative h-[220px] sm:h-[250px] lg:h-[274px] overflow-hidden bg-gray-100 shrink-0">
                {hasValidImage ? (
                    <Image
                        src={mainImage}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                        <span className="text-sm text-gray-400">No image</span>
                    </div>
                )}
                {/* Tag — left */}
                <div className="absolute top-3 left-3">
                    <span className={tagClass}>{displayTag}</span>
                </div>
                {/* Save — right */}
                <div className="absolute top-3 right-3 z-10">
                    <FavouriteButton propertyId={property.id} propertyTitle={property.title} />
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-5 p-5 flex-1">
                {/* Title & Location */}
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-[20px] font-normal text-[color:var(--on-surface-default)] leading-normal line-clamp-1 transition-colors duration-300 group-hover:text-[var(--foundation-blue-blue-7)]">
                            {property.title}
                        </h3>
                        <p className="text-[16px] font-light text-[color:var(--on-surface-variant)] leading-6 line-clamp-1">
                            {property.city}
                        </p>
                    </div>

                    {/* Beds / Baths / Area */}
                    <div className="flex items-center justify-between w-full text-[14px] sm:text-[16px] font-light text-[color:var(--on-surface-variant)]">
                        <span className="flex items-center gap-1.5">
                            <Bed size={24} weight="light" className="text-[color:var(--on-surface-variant)]" />
                            {property.bedrooms} beds
                        </span>
                        <span className="text-[var(--outline-default)]">|</span>
                        <span className="flex items-center gap-1.5">
                            <Bathtub size={24} weight="light" className="text-[color:var(--on-surface-variant)]" />
                            {property.bathrooms} baths
                        </span>
                        <span className="text-[var(--outline-default)]">|</span>
                        <span className="flex items-center gap-1.5">
                            <SquaresFour size={24} weight="light" className="text-[color:var(--on-surface-variant)]" />
                            {formatArea(property.sqft)}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[var(--outline-default)]" />

                {/* Price + go-to-details chevron */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-baseline gap-1">
                        <span className="text-[24px] font-normal text-[color:var(--on-surface-default)] leading-8">
                            {price.amount}
                        </span>
                        {price.suffix && (
                            <span className="text-[14px] font-light text-[color:var(--on-surface-variant)] leading-6">
                                {price.suffix}
                            </span>
                        )}
                    </div>
                    <ViewChevron />
                </div>
            </div>
        </Link>
    );
}
