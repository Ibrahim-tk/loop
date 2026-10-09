'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Bed, Bathtub, Car, CalendarDots, ArrowsOut,
    ArrowLeft, ArrowRight, CaretRight, CaretDown,
    MapPin, X, Check, Phone, EnvelopeSimple, CalendarCheck, ChatCircleText,
} from '@phosphor-icons/react';
import { ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Property } from '@/lib/types';
import { formatArea, formatListingPrice, FURNISHING_LABELS, LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS, STATUS_LABELS } from '@/lib/properties';
import { FavouriteButton, CompareButton } from '@/components/listings/SaveCompareButtons';
import LandingContactForm from '@/components/landing/LandingContactForm';
import ViewingBooking from '@/components/listings/ViewingBooking';

// ─── Lightbox Modal ──────────────────────────────────────────────────
// Matches Figma node 90-5067 exactly
function LightboxModal({
    images,
    currentIndex,
    onClose,
    onNavigate,
    onSetIndex,
    propertyTitle,
    propertyCity,
    propertyStatus,
}: {
    images: { id: string; storage_url: string; display_order: number }[];
    currentIndex: number;
    onClose: () => void;
    onNavigate: (dir: 'prev' | 'next') => void;
    onSetIndex: (index: number) => void;
    propertyTitle: string;
    propertyCity?: string;
    propertyStatus?: string;
}) {
    const [imgError, setImgError] = useState<Record<number, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const thumbnailStripRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLoading(true);
    }, [currentIndex]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onNavigate('prev');
            if (e.key === 'ArrowRight') onNavigate('next');
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose, onNavigate]);

    // Scroll active thumbnail into view
    useEffect(() => {
        if (!thumbnailStripRef.current) return;
        const active = thumbnailStripRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
        active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [currentIndex]);

    const statusLabel =
        propertyStatus === 'AVAILABLE' ? 'Available' :
            propertyStatus === 'PENDING' ? 'Pending' :
                propertyStatus?.replace('_', ' ') || '';

    return (
        // Full-screen overlay — rgba(0,0,0,0.93) per Figma
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.93)' }}>

            {/* ── Header ─────────────────────────────────────────── */}
            {/* border-b rgba(30,41,59,0.5), pl-24 pr-24 pt-16 pb-17 */}
            <div
                className="flex items-center justify-between shrink-0 px-3 py-3 sm:px-6 sm:py-4"
                style={{ borderBottom: '1px solid rgba(30,41,59,0.5)' }}
            >
                {/* Left: title + status badge + location */}
                <div className="flex flex-col gap-2">
                    {/* Title row */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-[18px] sm:text-[24px] font-normal leading-8 text-white">
                            {propertyTitle}
                        </h2>
                        {/* Available badge — Figma: bg-[rgba(21,128,61,0.1)] text-[var(--text-attention)] */}
                        <div
                            className="flex items-center px-2 py-0.5 rounded-[4px]"
                            style={{ background: 'rgba(21,128,61,0.1)', backdropFilter: 'blur(12px)' }}
                        >
                            <span className="text-[14px] font-normal leading-5 text-[var(--text-attention)]">
                                {statusLabel}
                            </span>
                        </div>
                    </div>
                    {/* Location row */}
                    <div className="flex items-center gap-2">
                        <MapPin size={20} weight="regular" className="text-white shrink-0" />
                        <span className="text-[16px] font-light leading-6 text-white">
                            {propertyCity}
                        </span>
                    </div>
                </div>

                {/* Right: Close button — size-[40px], backdrop-blur-[10px], bg-[rgba(0,0,0,0.2)], rounded-full */}
                <button
                    onClick={onClose}
                    aria-label="Close lightbox"
                    className="flex items-center justify-center rounded-[6px] size-[40px] shrink-0 transition-colors hover:bg-white/10"
                    style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
                >
                    <X size={14} weight="bold" className="text-white" />
                </button>
            </div>

            {/* ── Main Image Area ──────────────────────────────────── */}
            {/* flex-1, px-[80px] py-[32px], relative for prev/next absolute buttons */}
            <div className="relative flex flex-1 items-center justify-center px-4 sm:px-10 lg:px-20 py-2 sm:py-4 min-h-0">

                {/* Image container — fills available space */}
                <div className="relative w-full h-full max-w-[1152px] rounded-[8px] overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]">
                    {/* Spinner */}
                    {isLoading && !imgError[currentIndex] && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    )}
                    {!imgError[currentIndex] ? (
                            <Image
                                key={currentIndex}
                                src={images[currentIndex]?.storage_url}
                                alt={`${propertyTitle} - Image ${currentIndex + 1}`}
                                fill
                                className={`object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            sizes="(max-width: 1200px) 100vw, 1152px"
                            priority
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setImgError((p) => ({ ...p, [currentIndex]: true }));
                                setIsLoading(false);
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                            <div className="text-center text-white/40">
                                <ImageIcon className="h-16 w-16 mx-auto mb-2" />
                                <p className="text-sm">Image failed to load</p>
                            </div>
                        </div>
                    )}

                    {/* Bottom gradient + counter pill */}
                    <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end p-8 bg-gradient-to-t from-[rgba(0,0,0,0.8)] to-transparent">
                        <div
                            className="flex items-center justify-center px-[22.5px] py-1.5 rounded-[6px]"
                            style={{ background: 'rgba(10,49,97,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.08)' }}
                        >
                            <span className="text-[14px] font-normal leading-5 text-white">
                                {currentIndex + 1} / {images.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Prev button — Figma: left-[32px], size-[56px], bg-[rgba(0,0,0,0.5)], backdrop-blur-[6px], rounded-[8px] */}
                {images.length > 1 && (
                    <button
                        onClick={() => onNavigate('prev')}
                        aria-label="Previous image"
                        className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center size-[40px] sm:size-[56px] rounded-[8px] transition-colors hover:bg-black/70"
                        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
                    >
                        <ArrowLeft size={24} weight="bold" className="text-white" />
                    </button>
                )}

                {/* Next button — Figma: right-[32px], size-[56px], bg-[rgba(0,0,0,0.2)], backdrop-blur-[6px], rounded-[8px] */}
                {images.length > 1 && (
                    <button
                        onClick={() => onNavigate('next')}
                        aria-label="Next image"
                        className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 flex items-center justify-center size-[40px] sm:size-[56px] rounded-[8px] transition-colors hover:bg-black/40"
                        style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
                    >
                        <ArrowRight size={24} weight="bold" className="text-white" />
                    </button>
                )}
            </div>

            {/* ── Thumbnail Strip ──────────────────────────────────── */}
            {/* Figma: backdrop-blur-[6px], px-[104px] py-[16px] */}
            {images.length > 1 && (
                <div
                    className="shrink-0 px-6 sm:px-16 lg:px-[104px] py-4"
                    style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
                >
                    {/* Scrollable row — gap-[12px], thumbnails w-[128px] h-[80px] */}
                    <div
                        ref={thumbnailStripRef}
                        className="flex gap-3 overflow-x-auto pb-2 scrollbar-none"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {images.map((img, idx) => (
                            <button
                                key={img.id}
                                data-active={currentIndex === idx ? 'true' : 'false'}
                                onClick={() => onSetIndex(idx)}
                                className={`relative w-[80px] h-[52px] sm:w-[128px] sm:h-[80px] shrink-0 rounded-[4px] overflow-hidden border transition-all duration-150 ${currentIndex === idx
                                    ? 'border-white opacity-100'
                                    : 'border-[var(--color-gray-500)] opacity-60 hover:opacity-80'
                                    }`}
                            >
                                <Image
                                    src={img.storage_url}
                                    alt={`Thumbnail ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Similar Property Card ───────────────────────────────────────────
function SimilarPropertyCard({ property }: { property: Property }) {
    const [imageError, setImageError] = useState(false);
    const mainImage = property.property_images?.sort((a, b) => a.display_order - b.display_order)?.[0]?.storage_url;
    const hasValidImage = mainImage && !imageError;

    const statusLabel =
        property.status === 'AVAILABLE' ? 'For Rent' :
            property.status === 'PENDING' ? 'Pending' :
                property.status.replace('_', ' ');

    const handleClick = () => {
        const supabase = createClient();
        supabase.rpc('increment_click', { row_id: property.id }).then(() => {});
    };

    return (
        <Link
            onClick={handleClick}
            href={`/rentals/${property.id}`}
            className="bg-white flex flex-col rounded-[4px] overflow-hidden min-w-[300px] w-[300px] lg:min-w-[420px] lg:w-[420px] shrink-0 hover:shadow-lg transition-shadow"
        >
            {/* Image */}
            <div className="relative h-[274px] overflow-hidden bg-gray-100">
                {hasValidImage ? (
                    <Image
                        src={mainImage}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 300px, 420px"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                        <span className="text-sm text-gray-400">No image</span>
                    </div>
                )}
                {/* Tag */}
                <div className="absolute top-3 right-3">
                    {property.featured ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-[14px] font-normal text-white bg-[rgba(10,49,97,0.2)] backdrop-blur-[12px] rounded-[4px]">
                            Most Popular
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-1 text-[length:var(--typeface-paragraph-text)] font-light text-white bg-[rgba(0,0,0,0.3)] backdrop-blur-[12px]">
                            {statusLabel}
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col p-5">
                <div className="flex flex-col gap-5">
                    {/* Title + Location + Stats */}
                    <div className="flex flex-col gap-3 border-b border-[var(--outline-default)] pb-5">
                        <div className="flex flex-col gap-3">
                            <h3 className="text-[length:var(--typeface-heading-h4)] font-normal text-[color:var(--on-surface-default)] leading-normal line-clamp-1">
                                {property.title}
                            </h3>
                            <p className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-variant)] leading-6 line-clamp-1">
                                {property.address}, {property.city} {property.zip}
                            </p>
                        </div>
                        <div className="flex items-end justify-between text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-variant)]">
                            <span className="flex items-center gap-1.5">
                                <Bed size={24} weight="light" />
                                {property.bedrooms} beds
                            </span>
                            <span className="h-5 w-px bg-[var(--outline-default)]" />
                            <span className="flex items-center gap-1.5">
                                <Bathtub size={24} weight="light" />
                                {property.bathrooms} baths
                            </span>
                            <span className="h-5 w-px bg-[var(--outline-default)]" />
                            <span className="flex items-center gap-1.5">
                                <ArrowsOut size={24} weight="light" />
                                {property.sqft} m&sup2;
                            </span>
                        </div>
                    </div>

                    {/* Price + View Details */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[length:var(--typeface-heading-h3)] font-normal text-[color:var(--on-surface-default)] leading-8">
                                {formatListingPrice(property).amount}
                            </span>
                            {formatListingPrice(property).suffix && (
<span className="text-[length:var(--typeface-paragraph-text-s)] font-light leading-6">{formatListingPrice(property).suffix}</span>)}
                        </div>
                        <span className="flex items-center gap-2 text-[14px] font-medium text-[color:var(--on-surface-default)]">
                            View Details
                            <ArrowRight size={24} />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function PropertyDetailClient({
    property,
    similarProperties: initialSimilarProperties,
}: {
    property: Property;
    similarProperties: Property[];
}) {
    const [currentImage, setCurrentImage] = useState(0);
    const [imageError, setImageError] = useState<Record<number, boolean>>({});
    const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [similarProperties] = useState<Property[]>(initialSimilarProperties);
    const scrollRef = useRef<HTMLDivElement>(null);
    const viewedRef = useRef(false);

    // Increment view count on mount (fire-and-forget)
    useEffect(() => {
        if (viewedRef.current) return;
        viewedRef.current = true;
        const supabase = createClient();
        supabase.rpc('increment_view', { row_id: property.id }).then(() => { });
    }, [property.id]);

    const navigateImage = useCallback((direction: 'prev' | 'next') => {
        if (!property?.property_images?.length) return;
        const len = property.property_images.length;
        setCurrentImage((prev) =>
            direction === 'prev' ? (prev > 0 ? prev - 1 : len - 1) : (prev < len - 1 ? prev + 1 : 0)
        );
    }, [property?.property_images?.length]);

    const scrollCards = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 440;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    // ── Loading / Error / Not Found — no longer needed since data comes from server
    // These states are now handled by loading.tsx and error.tsx at the route level

    const images = property.property_images?.sort((a, b) => a.display_order - b.display_order) || [];
    const visibleThumbnails = images.slice(1, 4);
    const remainingCount = Math.max(0, images.length - 4);

    const overviewStats: { icon: typeof Bed; label: string; value: string | number }[] = [
        { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
        { icon: Bathtub, label: 'Bathrooms', value: property.bathrooms },
        { icon: Car, label: 'Parking', value: property.garage != null ? property.garage : '—' },
        { icon: CalendarDots, label: 'Year Built', value: property.year_built != null ? property.year_built : '—' },
        { icon: ArrowsOut, label: 'Area (sq ft)', value: property.sqft ? property.sqft.toLocaleString() : '—' },
    ];

    // Build highlights from DB data or fall back to defaults
    const rawHighlights = property.features?.length ? property.features : property.highlights ?? [];
    const specifications: [string, string | number][] = [
        ['Listing', LISTING_TYPE_LABELS[property.listing_type] ?? '—'],
        ['Property type', PROPERTY_TYPE_LABELS[property.property_type] ?? '—'],
        ['Status', STATUS_LABELS[property.status] ?? property.status],
        ['Furnishing', FURNISHING_LABELS[property.furnishing] ?? '—'],
        ['Area', property.sqft ? formatArea(property.sqft) : '—'],
        ['Bedrooms', property.bedrooms],
        ['Bathrooms', property.bathrooms],
        ['Parking spaces', property.garage ?? '—'],
        ['Year built', property.year_built ?? '—'],
        ['Address', [property.address, property.city, property.zip].filter(Boolean).join(', ')],
    ];
    // Chunk into columns of 3
    const highlights: string[][] = [];
    for (let i = 0; i < rawHighlights.length; i += 3) {
        highlights.push(rawHighlights.slice(i, i + 3));
    }

    const googleMapsUrl = property.google_maps_url;
    const zillowUrl = property.zillow_url;

    return (
        <>
            {/* Lightbox */}
            {lightboxOpen && images.length > 0 && (
                <LightboxModal
                    images={images}
                    currentIndex={currentImage}
                    onClose={() => setLightboxOpen(false)}
                    onNavigate={navigateImage}
                    onSetIndex={setCurrentImage}
                    propertyTitle={property.title}
                    propertyCity={property.city}
                    propertyStatus={property.status}
                />
            )}

            {/* ── Section: Breadcrumb + Main Content ──────────────────── */}
            <section className="bg-[var(--surface-variant)] min-h-screen pt-[var(--header-height)]">
                <div className="flex flex-col gap-8 px-5 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">

                    {/* Breadcrumb */}
                    <div className="lg:px-8">
                        <div className="flex items-center gap-2 text-[length:var(--typeface-paragraph-text)] leading-6">
                            <Link href="/" className="text-[color:var(--on-surface-default)] hover:underline hover:opacity-80 transition-all">
                                Home
                            </Link>
                            <CaretRight size={16} className="text-[color:var(--on-surface-default)] opacity-60" />
                            <Link href="/rentals" className="text-[color:var(--on-surface-default)] hover:underline hover:opacity-80 transition-all">
                                Properties
                            </Link>
                            <CaretRight size={16} className="text-[color:var(--on-surface-default)] opacity-60" />
                            <span className="text-[color:var(--on-surface-default)] font-normal opacity-60">
                                {property.title}
                            </span>
                        </div>
                    </div>

                    {/* Two-column layout */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:px-6">

                        {/* ── Left Column ─────────────────────────────── */}
                        <div className="bg-white rounded-[4px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] flex-1 p-3.5 sm:p-5 flex flex-col gap-6">

                            {/* Header: Tags + Title + Price */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    {/* Most Popular Tag */}
                                    {property.featured && (
                                        <div className="self-start">
                                            <span className="inline-flex items-center px-2 py-0.5 text-[14px] font-normal text-[color:var(--on-surface-default)] bg-[var(--surface-container-lowest)] backdrop-blur-[12px] rounded-[4px] leading-5">
                                                ★ Featured
                                            </span>
                                        </div>
                                    )}
                                    {/* Title + Available Badge */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-[length:var(--typeface-heading-h3)] font-normal text-[color:var(--on-surface-default)] leading-8">
                                            {property.title}
                                        </h1>
                                        <span className="inline-flex items-center px-2 py-0.5 text-[14px] font-normal text-[var(--feedback-success)] bg-[rgba(21,128,61,0.1)] backdrop-blur-[12px] rounded-[4px] leading-5">
                                            {STATUS_LABELS[property.status] ?? property.status.replace('_', ' ')} · {LISTING_TYPE_LABELS[property.listing_type]}
                                        </span>
                                    </div>
                                    {/* Location */}
                                    <div className="flex items-center gap-2">
                                        <MapPin size={20} weight="regular" className="text-[color:var(--on-surface-variant)] shrink-0" />
                                        <p className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-variant)] leading-6">
                                            {property.address}, {property.city} {property.zip}
                                        </p>
                                    </div>
                                </div>
                                {/* Price + save/compare */}
                                <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[length:var(--typeface-heading-h2)] font-normal text-[color:var(--on-surface-default)] leading-9">
                                            {formatListingPrice(property).amount}
                                        </span>
                                        {formatListingPrice(property).suffix && (
                                            <span className="text-[length:var(--typeface-heading-subheading)] font-light text-[color:var(--on-surface-default)] leading-7">{formatListingPrice(property).suffix}</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <FavouriteButton propertyId={property.id} propertyTitle={property.title} variant="full" />
                                        <CompareButton propertyId={property.id} propertyTitle={property.title} variant="full" />
                                    </div>
                                    <div className="flex gap-2">
                                        <a href="#book-viewing" className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-[6px] bg-[var(--action-primary)] text-[color:var(--text-inverse)] text-[length:var(--typeface-paragraph-text-s)] font-medium hover:bg-[var(--action-primary-hover)] transition-colors">
                                            <CalendarCheck size={18} /> Book a viewing
                                        </a>
                                        <a href="#ask-question" className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-[6px] border border-[var(--outline-default)] bg-white text-[length:var(--typeface-paragraph-text-s)] font-medium hover:border-[var(--action-border-hover)] transition-colors">
                                            <ChatCircleText size={18} /> Enquire
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* ── Image Gallery ────────────────────────── */}
                            {images.length > 0 ? (
                                <div className="flex gap-4 w-full">
                                    {/* Main Image */}
                                    <div
                                        className="relative flex-1 aspect-[4096/2720] cursor-pointer rounded-md overflow-hidden group"
                                        onClick={() => setLightboxOpen(true)}
                                    >
                                        {!imageLoaded[0] && !imageError[0] && (
                                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                                        )}
                                        {!imageError[0] ? (
                                            <Image
                                                src={images[0]?.storage_url}
                                                alt={`${property.title} - Main Image`}
                                                fill
                                                className="object-cover"
                                                priority
                                                onLoad={() => setImageLoaded((p) => ({ ...p, [0]: true }))}
                                                onError={() => setImageError((p) => ({ ...p, [0]: true }))}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                                                <ImageIcon className="h-16 w-16 text-gray-300 mb-2" />
                                                <span className="text-gray-400">Image failed to load</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Thumbnails Column */}
                                    {images.length > 1 && (
                                        <div className="hidden sm:flex flex-col gap-4 w-[180px] lg:w-[215px] self-stretch shrink-0">
                                            {visibleThumbnails.map((img, idx) => (
                                                <button
                                                    key={img.id}
                                                    onClick={() => {
                                                        setCurrentImage(idx + 1);
                                                        setLightboxOpen(true);
                                                    }}
                                                    className="relative flex-1 min-h-0 overflow-hidden rounded-md"
                                                >
                                                    {!imageLoaded[idx + 1] && !imageError[idx + 1] && (
                                                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                                                    )}
                                                    {!imageError[idx + 1] ? (
                                                        <Image
                                                            src={img.storage_url}
                                                            alt={`${property.title} - Thumbnail ${idx + 1}`}
                                                            fill
                                                            className="object-cover"
                                                            onLoad={() => setImageLoaded((p) => ({ ...p, [idx + 1]: true }))}
                                                            onError={() => setImageError((p) => ({ ...p, [idx + 1]: true }))}
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                                            <ImageIcon className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                            {/* "+N" overlay on last visible or extra slot */}
                                            {images.length > 4 && visibleThumbnails.length === 3 && (
                                                <button
                                                    onClick={() => {
                                                        setCurrentImage(3);
                                                        setLightboxOpen(true);
                                                    }}
                                                    className="relative flex-1 min-h-0 overflow-hidden rounded-md"
                                                >
                                                    {images[3] && !imageError[3] ? (
                                                        <Image
                                                            src={images[3].storage_url}
                                                            alt={`${property.title} - More images`}
                                                            fill
                                                            className="object-cover"
                                                            onError={() => setImageError((p) => ({ ...p, [3]: true }))}
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gray-200" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <span className="text-[48px] font-normal text-white leading-none tracking-[-0.24px]">
                                                            +{remainingCount}
                                                        </span>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="aspect-[4096/2720] bg-gray-100 flex flex-col items-center justify-center rounded">
                                    <ImageIcon className="h-16 w-16 text-gray-300 mb-2" />
                                    <p className="text-gray-400">No images uploaded yet</p>
                                </div>
                            )}

                            {/* ── Overview ────────────────────────────── */}
                            <div className="flex flex-col gap-6 mt-4">
                                {/* Section Header */}
                                <div className="flex items-center justify-between pb-2 border-b border-[var(--outline-default)]">
                                    <h2 className="text-[length:var(--typeface-heading-h3)] font-normal text-[color:var(--on-surface-default)] leading-8">
                                        Overview
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[length:var(--typeface-paragraph-text-s)] font-light text-[color:var(--on-surface-variant)] leading-6">
                                            Property ID: {(property.id || '').substring(0, 4).toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="grid grid-cols-2 md:grid-cols-3 sm:flex sm:items-stretch w-full gap-y-6 sm:gap-y-0">
                                    {overviewStats.map((stat, i) => (
                                        <div key={stat.label} className="flex flex-row items-center flex-1 min-w-0 pr-2 sm:pr-0">
                                            <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                                                <stat.icon size={24} weight="light" className="text-[color:var(--on-surface-variant)] shrink-0 mb-1" />
                                                <span className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-variant)] leading-6 truncate">
                                                    {stat.label}
                                                </span>
                                                <span className="text-[length:var(--typeface-heading-h3)] font-normal text-[color:var(--on-surface-default)] leading-8">
                                                    {stat.value}
                                                </span>
                                            </div>
                                            {/* Vertical Divider */}
                                            {i < overviewStats.length - 1 && (
                                                <div className="hidden sm:block w-px h-[60px] bg-[var(--outline-default)] mx-4 lg:mx-6 shrink-0 self-center" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── Property Highlights ─────────────────── */}
                            {rawHighlights.length > 0 && (
                            <div className="flex flex-col gap-4 mt-6 md:mt-8">
                                {/* Section Header */}
                                <div className="flex items-center justify-between">
                                    <h2 className="text-[length:var(--typeface-heading-h3)] font-normal text-[color:var(--on-surface-default)] leading-8">
                                        Property highlights
                                    </h2>
                                </div>

                                {/* Highlights Grid */}
                                <div className="bg-[var(--surface-variant)] rounded-[var(--radius-sm)] px-6 py-8 w-full">
                                    {/* Mobile: flat list */}
                                    <div className="flex flex-col gap-3 sm:hidden">
                                        {rawHighlights.map((item) => (
                                            <div key={item} className="flex items-start gap-3">
                                                <Check size={20} weight="regular" className="text-[var(--feedback-success)] shrink-0 mt-0.5" />
                                                <span className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-variant)] leading-6">
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Desktop: chunked columns */}
                                    <div className="hidden sm:flex sm:flex-row items-center gap-0">
                                        {highlights.map((column, colIdx) => (
                                            <div key={colIdx} className="flex items-center flex-1 min-w-0">
                                                <div className="flex flex-col gap-4 flex-1">
                                                    {column.map((item) => (
                                                        <div key={item} className="flex items-start gap-3">
                                                            <Check size={20} weight="regular" className="text-[var(--feedback-success)] shrink-0 mt-0.5" />
                                                            <span className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-variant)] leading-6">
                                                                {item}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {colIdx < highlights.length - 1 && (
                                                    <div className="w-px h-[100px] bg-[var(--outline-default)] mx-6 shrink-0" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            )}

                            {/* ── Specifications ──────────────────────── */}
                            <div className="flex flex-col gap-4 mt-6 md:mt-8">
                                <h2 className="pb-2 border-b border-[var(--outline-default)] text-[length:var(--typeface-heading-h3)] font-normal leading-8">Specifications</h2>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                    {specifications.map(([label, value]) => (
                                        <div key={label} className="flex justify-between gap-4 py-3 border-b border-[var(--outline-variant)]">
                                            <dt className="text-[color:var(--on-surface-variant)]">{label}</dt>
                                            <dd className="text-right">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            {/* ── Amenities ───────────────────────────── */}
                            <div className="flex flex-col gap-4 mt-6 md:mt-8">
                                <h2 className="pb-2 border-b border-[var(--outline-default)] text-[length:var(--typeface-heading-h3)] font-normal leading-8">Amenities</h2>
                                {property.amenities?.length ? (
                                    <ul className="flex flex-wrap gap-2">
                                        {property.amenities.map((a) => (
                                            <li key={a} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface-variant)] text-[length:var(--typeface-paragraph-text-s)]">
                                                <Check size={14} weight="bold" className="text-[color:var(--text-attention)]" />
                                                {a}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-[color:var(--on-surface-variant)]">No amenities listed for this property.</p>
                                )}
                            </div>

                            {/* ── About this property ─────────────────── */}
                            <div className="flex flex-col gap-3 mt-6 md:mt-8 mb-4">
                                {/* Section Header */}
                                <div className="flex items-center justify-between pb-2 border-b border-[var(--outline-default)]">
                                    <h2 className="text-[length:var(--typeface-heading-h3)] font-normal text-[color:var(--on-surface-default)] leading-8">
                                        About this property
                                    </h2>
                                </div>

                                {/* Description */}
                                <div className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-variant)] leading-7 whitespace-pre-wrap">
                                    {property.description || 'No description available.'}
                                </div>
                            </div>

                            {/* ── Zillow Link and Map moved to right column ──────────────── */}
                        </div>

                        {/* ── Right Column ────────────────────────────── */}
                        <div className="lg:w-[390px] shrink-0 flex flex-col gap-6">

                            {/* ── Location Widget ─────────────────────── */}
                            {(googleMapsUrl || zillowUrl) && (
                                <div className="bg-[var(--surface-default)] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-[4px] p-3.5 sm:p-5 flex flex-col gap-4 ">
                                    {/* Location Header */}
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-[length:var(--typeface-heading-h4)] font-normal text-[color:var(--on-surface-default)] leading-normal">
                                            Location
                                        </h3>
                                    </div>

                                    {/* Map */}
                                    {googleMapsUrl && (
                                        <div className="flex flex-col gap-2.5">
                                            <a
                                                href={googleMapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="relative h-[188px] rounded-[4px] overflow-hidden bg-[var(--surface-container-primary)] block group cursor-pointer"
                                            >
                                                <Image 
                                                    src="/landing-page/map-preview.webp"
                                                    alt="Map Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-2">
                                                    <MapPin size={32} weight="fill" className="text-white" />
                                                    <span className="font-medium text-[14px] text-white underline decoration-solid leading-[normal]">
                                                        View on map
                                                    </span>
                                                </div>
                                            </a>
                                        </div>
                                    )}

                                    {/* ── Zillow Link ─────────────────────────── */}
                                    {zillowUrl && (
                                        <a 
                                            href={zillowUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-[var(--surface-container-lowest)] rounded-[var(--radius-sm)] p-4 flex flex-col gap-[13px] hover:bg-[var(--surface-container-low)] transition-colors block group cursor-pointer"
                                        >
                                            <p className="text-[length:var(--typeface-paragraph-text-s)] font-normal text-[color:var(--on-surface-variant)] leading-5">
                                                View this listing on Zillow.com.
                                            </p>
                                            <div className="flex items-end gap-3">
                                                <span className="text-[14px] font-medium text-[color:var(--on-surface-default)] underline decoration-solid group-hover:text-blue-600 transition-colors">
                                                    View on
                                                </span>
                                                <span className="text-[20px] font-bold text-[var(--text-attention)] leading-6">
                                                    Zillow
                                                </span>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* ── Agent ───────────────────────────────── */}
                            {property.agent_name && (
                                <div className="bg-[var(--surface-default)] shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-[4px] p-3.5 sm:p-5 flex flex-col gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[var(--surface-container-highest)] shrink-0">
                                            {property.agent_photo_url && <Image src={property.agent_photo_url} alt="" fill sizes="64px" className="object-cover" />}
                                        </div>
                                        <div>
                                            <p className="text-[12px] uppercase tracking-wide text-[color:var(--on-surface-variant)]">Listing agent</p>
                                            <p className="text-[length:var(--typeface-heading-subheading)] leading-6">{property.agent_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-[length:var(--typeface-paragraph-text-s)]">
                                        {property.agent_phone && (
                                            <a href={`tel:${property.agent_phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2 hover:underline">
                                                <Phone size={18} /> {property.agent_phone}
                                            </a>
                                        )}
                                        {property.agent_email && (
                                            <a href={`mailto:${property.agent_email}`} className="inline-flex items-center gap-2 hover:underline">
                                                <EnvelopeSimple size={18} /> {property.agent_email}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ── Book a viewing ──────────────────────── */}
                            <div id="book-viewing" className="scroll-mt-[calc(var(--header-height)+16px)] bg-[var(--surface-default)] shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-[4px] p-3.5 sm:p-5 flex flex-col gap-5">
                                <div className="flex items-center gap-2 pb-3 border-b border-[var(--outline-default)]">
                                    <CalendarCheck size={24} />
                                    <h3 className="text-[length:var(--typeface-heading-h4)] font-normal leading-normal">Book a viewing</h3>
                                </div>
                                <ViewingBooking property={property} />
                            </div>

                            {/* ── Ask a question ──────────────────────── */}
                            <div id="ask-question" className="scroll-mt-[calc(var(--header-height)+16px)] bg-[var(--surface-default)] shadow-[0_10px_40px_rgba(0,0,0,0.04)] rounded-[4px] p-3.5 sm:p-5 flex flex-col gap-6">
                                <div className="flex items-center gap-2 pb-3 border-b border-[var(--outline-default)]">
                                    <ChatCircleText size={24} />
                                    <h3 className="text-[length:var(--typeface-heading-h4)] font-normal leading-normal">Ask a question</h3>
                                </div>
                                <LandingContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Section: Similar Properties ──────────────────────── */}
            {similarProperties.length > 0 && (
                <section className="bg-[var(--surface-variant)] pl-5 sm:pl-8 lg:pl-10 py-12 lg:py-16">
                    <div className="flex flex-col gap-6 sm:gap-12 px-0 sm:px-2 lg:px-6">
                        {/* Header */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pr-5 sm:pr-8 lg:pr-[72px]">
                            {/* Left: Title + Subtitle */}
                            <div className="flex flex-col gap-3 max-w-[637px]">
                                <h2 className="text-[28px] sm:text-[36px] lg:text-[48px] font-normal text-[color:var(--on-surface-default)] leading-none tracking-[-0.24px]">
                                    Similar properties
                                </h2>
                                <p className="text-[length:var(--typeface-heading-subheading)] font-light text-[color:var(--on-surface-default)] leading-7">
                                    Explore our curated list of high-quality homes across Punjab and Pakistan. All properties are professionally managed and ready for immediate move-in.
                                </p>
                            </div>
                            {/* Right: View All + Arrows */}
                            <div className="flex items-center gap-6 shrink-0">
                                <Link
                                    href="/rentals"
                                    className="flex items-center justify-center px-[22.5px] py-[15px] rounded-[var(--radius-md)] bg-[var(--on-surface-primary)] text-[color:var(--on-surface-inverse)] text-[length:var(--typeface-paragraph-text-s)] font-medium leading-normal min-w-[80px] hover:bg-[var(--foundation-blue-blue-7)] transition-colors"
                                >
                                    View all
                                </Link>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => scrollCards('left')}
                                        className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-sm)] border border-[var(--outline-default)] bg-[var(--surface-default)] text-[color:var(--on-surface-default)] hover:bg-[var(--surface-variant)] transition-colors"
                                    >
                                        <ArrowLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => scrollCards('right')}
                                        className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-sm)] border border-[var(--outline-default)] bg-[var(--surface-default)] text-[color:var(--on-surface-default)] hover:bg-[var(--surface-variant)] transition-colors"
                                    >
                                        <ArrowRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Cards Scroll */}
                        <div
                            ref={scrollRef}
                            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
                        >
                            {similarProperties.map((p) => (
                                <SimilarPropertyCard key={p.id} property={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}
