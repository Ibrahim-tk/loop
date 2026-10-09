'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, ArrowRight, ImageIcon } from 'lucide-react';
import { Property } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { formatListingPrice } from '@/lib/properties';

interface PropertyPreviewCardProps {
    property: Property;
    compact?: boolean;
}

export default function PropertyPreviewCard({ property, compact = false }: PropertyPreviewCardProps) {
    const [imageError, setImageError] = useState(false);
    const mainImage = property.property_images?.[0]?.storage_url;
    const hasValidImage = mainImage && !imageError;

    if (compact) {
        return (
            <Link href={`/rentals/${property.id}`} className="group block">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-accent-200 hover:shadow-md transition-all">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {hasValidImage ? (
                            <Image
                                src={mainImage}
                                alt={property.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <ImageIcon className="h-6 w-6 text-gray-300" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-accent-500 transition-colors">
                            {property.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{property.city}</p>
                        <p className="text-sm font-bold text-accent-500 mt-0.5">
                            {formatPrice(property.rent_price)}{property.listing_type === 'RENT' ? '/mo' : ''}
                        </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-accent-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
            </Link>
        );
    }

    return (
        <Link href={`/rentals/${property.id}`} className="group block">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-accent-200 hover:shadow-lg transition-all">
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    {hasValidImage ? (
                        <>
                            <Image
                                src={mainImage}
                                alt={property.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, 300px"
                                onError={() => setImageError(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <ImageIcon className="h-10 w-10 text-gray-300 mb-1" />
                            <span className="text-xs text-gray-400">No image</span>
                        </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-lg font-bold text-white drop-shadow-lg">
                            {formatPrice(property.rent_price)}
                            {formatListingPrice(property).suffix && <span className="text-sm font-normal text-white/80">/mo</span>}
                        </p>
                    </div>
                </div>
                <div className="p-4">
                    <h4 className="text-base font-semibold text-gray-900 group-hover:text-accent-500 transition-colors mb-1 line-clamp-1">
                        {property.title}
                    </h4>
                    <div className="flex items-center gap-1 text-gray-500 mb-3">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-xs truncate">{property.address}, {property.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                            <BedDouble className="h-3.5 w-3.5 text-accent-500" />
                            <span>{property.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Bath className="h-3.5 w-3.5 text-accent-500" />
                            <span>{property.bathrooms} Baths</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
