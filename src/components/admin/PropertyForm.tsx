'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { AlertCircle, ChevronLeft, Link2, Loader2, Plus, Save, X } from '@/components/admin/icons';
import { createClient } from '@/lib/supabase/client';
import { saveProperty } from '@/lib/actions/properties';
import { syncPropertyImages } from '@/lib/admin/propertyImages';
import {
    EMPTY_PROPERTY_FORM,
    isAllowedImageUrl,
    propertySchema,
    toFieldErrors,
    type PropertyFieldErrors,
    type PropertyFormValues,
} from '@/lib/propertySchema';
import { AMENITY_OPTIONS, FURNISHING_LABELS, PROPERTY_TYPE_LABELS, SIMPLE_STATUS_LABELS, LIVE_SIMPLE_STATUSES, toSimpleStatus, fromSimpleStatus, type SimpleStatus } from '@/lib/properties';
import ImageUploader, { type ImageItem } from '@/components/admin/ImageUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatPrice, SQFT_PER_KANAL, SQFT_PER_MARLA } from '@/lib/utils';
import Dropdown from '@/components/ui/Dropdown';
import PropertyCard from '@/components/listings/PropertyCard';
import type { Property } from '@/lib/types';


const selectClass =
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive';

interface PropertyFormProps {
    mode: 'create' | 'edit';
    propertyId?: string;
    initialValues?: PropertyFormValues;
    initialImages?: ImageItem[];
}

export default function PropertyForm({ mode, propertyId, initialValues = EMPTY_PROPERTY_FORM, initialImages = [] }: PropertyFormProps) {
    const router = useRouter();
    const [form, setForm] = useState<PropertyFormValues>(initialValues);
    const [errors, setErrors] = useState<PropertyFieldErrors>({});
    const [images, setImages] = useState<ImageItem[]>(initialImages);
    const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrlError, setImageUrlError] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [customAmenity, setCustomAmenity] = useState('');
    const [saving, setSaving] = useState(false);
    const [progress, setProgress] = useState('');
    const [dirty, setDirty] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    // Area is stored in sq ft; admins enter it in Marla or Kanal.
    const [areaUnit, setAreaUnit] = useState<'MARLA' | 'KANAL'>(() => {
        const sqft = Number(initialValues.sqft);
        return sqft >= SQFT_PER_KANAL && sqft % SQFT_PER_KANAL === 0 ? 'KANAL' : 'MARLA';
    });
    const sqftPerUnit = areaUnit === 'KANAL' ? SQFT_PER_KANAL : SQFT_PER_MARLA;
    const [areaInput, setAreaInput] = useState(() => {
        const sqft = Number(initialValues.sqft);
        if (!sqft) return '';
        const per = sqft >= SQFT_PER_KANAL && sqft % SQFT_PER_KANAL === 0 ? SQFT_PER_KANAL : SQFT_PER_MARLA;
        return String(Math.round((sqft / per) * 100) / 100);
    });
    const setArea = (value: string, per: number) => {
        setAreaInput(value);
        const n = Number(value);
        set('sqft', value.trim() && Number.isFinite(n) ? String(Math.round(n * per)) : value);
    };

    // Warn before leaving with unsaved changes
    useEffect(() => {
        if (!dirty) return;
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [dirty]);

    const set = <K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
        setDirty(true);
        if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const field = (key: keyof PropertyFormValues) => ({
        id: `pf-${key}`,
        'aria-invalid': Boolean(errors[key]),
        'aria-describedby': errors[key] ? `pf-${key}-err` : undefined,
    });

    const ErrorText = ({ name }: { name: keyof PropertyFormValues }) =>
        errors[name] ? (
            <p id={`pf-${name}-err`} className="text-xs text-destructive mt-1">
                {errors[name]}
            </p>
        ) : null;

    const text = (key: keyof PropertyFormValues) => ({
        ...field(key),
        value: form[key] as string,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(key, e.target.value as never),
        className: cn(errors[key] && 'border-destructive focus-visible:ring-destructive'),
    });

    const toggleAmenity = (a: string) =>
        set('amenities', form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a]);

    const addCustomAmenity = () => {
        const v = customAmenity.trim();
        if (v && !form.amenities.includes(v)) set('amenities', [...form.amenities, v]);
        setCustomAmenity('');
    };

    const addFeature = () => {
        const v = featureInput.trim();
        if (v && !form.features.includes(v)) set('features', [...form.features, v]);
        setFeatureInput('');
    };

    const addImageUrl = () => {
        const v = imageUrl.trim();
        if (!isAllowedImageUrl(v)) {
            setImageUrlError('Paste an https link from images.unsplash.com or your Supabase storage.');
            return;
        }
        if (images.some((img) => img.url === v)) {
            setImageUrlError('That image is already added.');
            return;
        }
        setImages((imgs) => [...imgs, { url: v }]);
        setImageUrl('');
        setImageUrlError('');
        setDirty(true);
    };

    const focusFirstError = (errs: PropertyFieldErrors) => {
        const first = Object.keys(errs)[0];
        if (!first) return;
        requestAnimationFrame(() => {
            const el = formRef.current?.querySelector<HTMLElement>(`#pf-${first}`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el?.focus({ preventScroll: true });
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const check = propertySchema.safeParse(form);
        if (!check.success) {
            const errs = toFieldErrors(check.error);
            setErrors(errs);
            toast.error(`Please fix ${Object.keys(errs).length} field${Object.keys(errs).length === 1 ? '' : 's'} before saving.`);
            focusFirstError(errs);
            return;
        }

        setSaving(true);
        setProgress(mode === 'create' ? 'Creating property…' : 'Saving changes…');
        try {
            const result = await saveProperty(form, propertyId);
            if (!result.ok) {
                if (result.fieldErrors) {
                    setErrors(result.fieldErrors);
                    focusFirstError(result.fieldErrors);
                }
                toast.error(result.error);
                return;
            }

            const imageResult = await syncPropertyImages(createClient(), result.id, images, deletedImageIds, setProgress);
            if (imageResult.bucketMissing) toast.error('Image storage is not set up, so uploaded files were skipped.');
            else if (imageResult.failed) toast.error(`${imageResult.failed} image${imageResult.failed === 1 ? '' : 's'} could not be saved.`);

            toast.success(mode === 'create' ? `“${form.title}” is live on the site.` : 'Changes saved. The public site is updated.');
            setDirty(false);
            router.push('/admin/properties');
            router.refresh();
        } catch {
            toast.error('Something went wrong while saving. Please try again.');
        } finally {
            setSaving(false);
            setProgress('');
        }
    };

    const priceLabel = form.listing_type === 'RENT' ? 'Monthly rent (PKR)' : 'Sale price (PKR)';
    const priceValue = Number(form.rent_price);
    const errorCount = Object.values(errors).filter(Boolean).length;

    // Live preview of the public listing card, built from the form as it stands.
    const preview = {
        id: propertyId ?? 'preview',
        title: form.title.trim() || 'Property title',
        address: form.address,
        city: form.city.trim() || 'City',
        zip: form.zip,
        rent_price: priceValue || 0,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        sqft: Number(form.sqft) || 0,
        status: form.status,
        listing_type: form.listing_type,
        property_type: form.property_type,
        furnishing: form.furnishing,
        featured: form.featured,
        description: form.description,
        amenities: form.amenities,
        features: form.features,
        view_count: 0,
        click_count: 0,
        created_at: '',
        updated_at: '',
        property_images: images[0] ? [{ id: 'preview', property_id: '', storage_url: images[0].url, display_order: 0 }] : [],
    } as Property;

    return (
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-6 pb-24 xl:grid-cols-[minmax(0,56rem)_340px] items-start">
          <div className="min-w-0 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/admin/properties" aria-label="Back to properties"
                    className="-ml-2 inline-flex items-center justify-center size-10 rounded-md text-foreground hover:text-[color:var(--color-green-500)] transition-colors">
                    <ChevronLeft className="h-7 w-7" />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">{mode === 'create' ? 'New property' : 'Edit property'}</h1>
            </div>

            {errorCount > 0 && (
                <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    {errorCount} field{errorCount === 1 ? ' needs' : 's need'} attention below.
                </div>
            )}

            {/* Listing */}
            <Card>
                <CardHeader>
                    <CardTitle>Listing</CardTitle>
                    <CardDescription>What it is and whether it&apos;s for sale or rent.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <Label htmlFor="pf-title">Title <span className="text-destructive">*</span></Label>
                        <Input placeholder="e.g. Modern Hillside Villa" {...text('title')} />
                        <ErrorText name="title" />
                    </div>
                    <div>
                        <Label htmlFor="pf-property_type">Property type <span className="text-destructive">*</span></Label>
                        <Dropdown {...text('property_type')} className={selectClass}>
                            {Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => (
                                <option key={v} value={v}>{l}</option>
                            ))}
                        </Dropdown>
                        <ErrorText name="property_type" />
                    </div>
                    <div>
                        <Label htmlFor="pf-status">Status <span className="text-destructive">*</span></Label>
                        <Dropdown
                            id="pf-status"
                            value={toSimpleStatus(form)}
                            onChange={(e) => {
                                const next = fromSimpleStatus(e.target.value as SimpleStatus, form.listing_type);
                                setForm((f) => ({ ...f, ...next }));
                            }}
                            className={selectClass}
                        >
                            {(Object.keys(SIMPLE_STATUS_LABELS) as SimpleStatus[]).map((k) => (
                                <option key={k} value={k}>{SIMPLE_STATUS_LABELS[k]}</option>
                            ))}
                        </Dropdown>
                        <p className="mt-1.5 text-xs text-muted-foreground">
                            {LIVE_SIMPLE_STATUSES.includes(toSimpleStatus(form)) ? 'Shown on the site.' : 'Hidden from the site, kept on record.'}
                        </p>
                        <ErrorText name="status" />
                    </div>
                    {toSimpleStatus(form) === 'DRAFT' && (
                        <div>
                            <Label htmlFor="pf-listing_type">Will be listed</Label>
                            <Dropdown {...text('listing_type')} className={selectClass}>
                                <option value="SALE">For sale</option>
                                <option value="RENT">For rent</option>
                            </Dropdown>
                        </div>
                    )}
                    <label className="flex items-center gap-3 self-center rounded-md border p-3 cursor-pointer">
                        <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 accent-[var(--color-green-500)]" />
                        <span>
                            <span className="block text-sm font-medium">Featured</span>
                            <span className="block text-xs text-muted-foreground">Shown first and on the home page.</span>
                        </span>
                    </label>
                </CardContent>
            </Card>

            {/* Location */}
            <Card>
                <CardHeader>
                    <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                        <Label htmlFor="pf-address">Street address <span className="text-destructive">*</span></Label>
                        <Input placeholder="1420 Ridgecrest Ln" autoComplete="street-address" {...text('address')} />
                        <ErrorText name="address" />
                    </div>
                    <div className="sm:col-span-4">
                        <Label htmlFor="pf-city">City <span className="text-destructive">*</span></Label>
                        <Input placeholder="Lahore" {...text('city')} />
                        <ErrorText name="city" />
                    </div>
                    <div className="sm:col-span-2">
                        <Label htmlFor="pf-zip">Zip</Label>
                        <Input placeholder="92037" {...text('zip')} />
                        <ErrorText name="zip" />
                    </div>
                    <div className="sm:col-span-6">
                        <Label htmlFor="pf-google_maps_url">Google Maps link <span className="font-normal text-muted-foreground">(optional)</span></Label>
                        <Input placeholder="https://maps.google.com/…" {...text('google_maps_url')} />
                        <ErrorText name="google_maps_url" />
                    </div>
                </CardContent>
            </Card>

            {/* Price & size */}
            <Card>
                <CardHeader>
                    <CardTitle>Price &amp; size</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                    <div className="col-span-2 sm:col-span-1">
                        <Label htmlFor="pf-rent_price">{priceLabel} <span className="text-destructive">*</span></Label>
                        <Input type="number" inputMode="numeric" min={0} placeholder={form.listing_type === 'RENT' ? '85000' : '35000000'} {...text('rent_price')} />
                        {priceValue > 0 && !errors.rent_price && (
                            <p className="mt-1 text-xs text-muted-foreground">{formatPrice(priceValue, 'PKR')}{form.listing_type === 'RENT' ? ' / month' : ''}</p>
                        )}
                        <ErrorText name="rent_price" />
                    </div>
                    <div>
                        <Label htmlFor="pf-sqft">Area <span className="text-destructive">*</span></Label>
                        <div className="flex gap-2">
                            <Input {...field('sqft')} type="number" inputMode="decimal" min={0} step="any" placeholder={areaUnit === 'KANAL' ? '1' : '10'}
                                value={areaInput} onChange={(e) => setArea(e.target.value, sqftPerUnit)}
                                className={cn('min-w-0', errors.sqft && 'border-destructive focus-visible:ring-destructive')} />
                            <Dropdown aria-label="Area unit" value={areaUnit} className={cn(selectClass, 'w-28 shrink-0')}
                                onChange={(e) => {
                                    const unit = e.target.value as 'MARLA' | 'KANAL';
                                    setAreaUnit(unit);
                                    setArea(areaInput, unit === 'KANAL' ? SQFT_PER_KANAL : SQFT_PER_MARLA);
                                }}>
                                <option value="MARLA">Marla</option>
                                <option value="KANAL">Kanal</option>
                            </Dropdown>
                        </div>
                        <ErrorText name="sqft" />
                    </div>
                    <div>
                        <Label htmlFor="pf-furnishing">Furnishing <span className="text-destructive">*</span></Label>
                        <Dropdown {...text('furnishing')} className={selectClass}>
                            {Object.entries(FURNISHING_LABELS).map(([v, l]) => (
                                <option key={v} value={v}>{l}</option>
                            ))}
                        </Dropdown>
                    </div>
                    <div>
                        <Label htmlFor="pf-bedrooms">Bedrooms <span className="text-destructive">*</span></Label>
                        <Input type="number" inputMode="numeric" min={0} placeholder="0 for studio" {...text('bedrooms')} />
                        <ErrorText name="bedrooms" />
                    </div>
                    <div>
                        <Label htmlFor="pf-bathrooms">Bathrooms <span className="text-destructive">*</span></Label>
                        <Input type="number" inputMode="numeric" min={0} {...text('bathrooms')} />
                        <ErrorText name="bathrooms" />
                    </div>
                    <div>
                        <Label htmlFor="pf-garage">Parking spaces</Label>
                        <Input type="number" inputMode="numeric" min={0} {...text('garage')} />
                        <ErrorText name="garage" />
                    </div>
                    <div>
                        <Label htmlFor="pf-year_built">Year built</Label>
                        <Input type="number" inputMode="numeric" placeholder="2019" {...text('year_built')} />
                        <ErrorText name="year_built" />
                    </div>
                </CardContent>
            </Card>

            {/* Description */}
            <Card>
                <CardHeader>
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label htmlFor="pf-description">Description <span className="text-destructive">*</span></Label>
                        <Textarea rows={5} placeholder="What makes this property stand out?" {...text('description')} />
                        <div className="flex justify-between">
                            <ErrorText name="description" />
                            <span className="ml-auto text-xs text-muted-foreground mt-1">{form.description.length}/5000</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Features */}
            <Card>
                <CardHeader>
                    <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="pf-feature-input">Key features</Label>
                        <p className="text-xs text-muted-foreground mb-2">Short selling points shown as highlights, e.g. &ldquo;Ocean views&rdquo;.</p>
                        <div className="flex gap-2">
                            <Input id="pf-feature-input" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add a feature"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addFeature();
                                    }
                                }} />
                            <Button type="button" variant="outline" onClick={addFeature} disabled={!featureInput.trim()}>
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Add feature</span>
                            </Button>
                        </div>
                        {form.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {form.features.map((f) => (
                                    <Badge key={f} variant="secondary" className="gap-1 pr-1">
                                        {f}
                                        <button type="button" onClick={() => set('features', form.features.filter((x) => x !== f))} aria-label={`Remove ${f}`} className="rounded-md p-0.5 hover:bg-muted">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <fieldset>
                        <legend className="text-sm font-medium">Amenities</legend>
                        <p className="text-xs text-muted-foreground mb-2">These power the amenity filters on the public site.</p>
                        <div className="flex flex-wrap gap-2">
                            {Array.from(new Set([...AMENITY_OPTIONS, ...form.amenities])).map((a) => {
                                const on = form.amenities.includes(a);
                                return (
                                    <button key={a} type="button" aria-pressed={on} onClick={() => toggleAmenity(a)}
                                        className={cn('rounded-full border px-3 py-1 text-sm transition-colors', on ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted')}>
                                        {a}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex gap-2 mt-3 max-w-sm">
                            <Input value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)} placeholder="Other amenity" aria-label="Other amenity"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addCustomAmenity();
                                    }
                                }} />
                            <Button type="button" variant="outline" onClick={addCustomAmenity} disabled={!customAmenity.trim()}>Add</Button>
                        </div>
                    </fieldset>
                </CardContent>
            </Card>

            {/* Images */}
            <Card>
                <CardHeader>
                    <CardTitle>Images</CardTitle>
                    <CardDescription>The first image is the cover. Drag to reorder.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ImageUploader
                        images={images}
                        onImagesChange={(imgs) => {
                            setImages(imgs);
                            setDirty(true);
                        }}
                        onImageDelete={(id) => setDeletedImageIds((ids) => [...ids, id])}
                    />
                    <div>
                        <Label htmlFor="pf-image-url">Or add an image link</Label>
                        <div className="flex gap-2 mt-1">
                            <Input id="pf-image-url" value={imageUrl} placeholder="https://images.unsplash.com/photo-…"
                                aria-invalid={Boolean(imageUrlError)}
                                onChange={(e) => {
                                    setImageUrl(e.target.value);
                                    setImageUrlError('');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addImageUrl();
                                    }
                                }} />
                            <Button type="button" variant="outline" onClick={addImageUrl} disabled={!imageUrl.trim()}>
                                <Link2 className="h-4 w-4 mr-1" /> Add
                            </Button>
                        </div>
                        {imageUrlError && <p className="text-xs text-destructive mt-1">{imageUrlError}</p>}
                    </div>
                    {images.length === 0 && (
                        <p className="text-xs text-muted-foreground">No images yet. The listing will show a placeholder until you add one.</p>
                    )}
                </CardContent>
            </Card>

            {/* Agent */}
            <Card>
                <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                    <div className="space-y-1.5">
                        <CardTitle>Listing agent</CardTitle>
                        <CardDescription>Shown on the property page. Turn off to hide the agent card.</CardDescription>
                    </div>
                    <button type="button" role="switch" aria-checked={form.has_agent} aria-label="Show a listing agent"
                        onClick={() => {
                            const on = !form.has_agent;
                            set('has_agent', on);
                            if (!on) setErrors((e) => ({ ...e, agent_name: undefined, agent_phone: undefined, agent_email: undefined, agent_photo_url: undefined }));
                        }}
                        className={cn('relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors', form.has_agent ? 'bg-[var(--color-green-500)]' : 'bg-input')}>
                        <span className={cn('inline-block size-5 rounded-full bg-white shadow transition-transform', form.has_agent ? 'translate-x-[22px]' : 'translate-x-0.5')} />
                    </button>
                </CardHeader>
                {form.has_agent && (
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="pf-agent_name">Name <span className="text-destructive">*</span></Label>
                            <Input autoComplete="off" {...text('agent_name')} />
                            <ErrorText name="agent_name" />
                        </div>
                        <div>
                            <Label htmlFor="pf-agent_phone">Phone <span className="text-destructive">*</span></Label>
                            <Input type="tel" autoComplete="off" placeholder="+92 300 1234567" {...text('agent_phone')} />
                            <ErrorText name="agent_phone" />
                        </div>
                        <div>
                            <Label htmlFor="pf-agent_email">Email <span className="text-destructive">*</span></Label>
                            <Input type="email" autoComplete="off" {...text('agent_email')} />
                            <ErrorText name="agent_email" />
                        </div>
                        <div>
                            <Label htmlFor="pf-agent_photo_url">Photo link <span className="font-normal text-muted-foreground">(optional)</span></Label>
                            <Input placeholder="https://images.unsplash.com/…" {...text('agent_photo_url')} />
                            <ErrorText name="agent_photo_url" />
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* External link */}
            <Card>
                <CardHeader>
                    <CardTitle>External listing</CardTitle>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="pf-zillow_url">External listing link <span className="font-normal text-muted-foreground">(optional)</span></Label>
                    <Input placeholder="https://…" {...text('zillow_url')} />
                    <ErrorText name="zillow_url" />
                </CardContent>
            </Card>

          </div>

            {/* Card preview */}
            <aside className="hidden xl:block sticky top-6 space-y-3" aria-label="Listing card preview">
                <p className="text-sm font-medium">Preview</p>
                <div inert className="pointer-events-none select-none">
                    <PropertyCard property={preview} />
                </div>
                <p className="text-xs text-muted-foreground">How this listing appears in search results. Updates as you type.</p>
            </aside>

            {/* Sticky actions */}
            <div className="fixed bottom-0 inset-x-0 lg:left-64 z-30 border-t bg-background/95 backdrop-blur px-4 py-3">
                <div className="max-w-4xl flex items-center justify-end gap-3">
                    {progress && <span className="mr-auto text-sm text-muted-foreground" aria-live="polite">{progress}</span>}
                    <Button type="button" variant="outline" asChild>
                        <Link href="/admin/properties">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        {mode === 'create' ? 'Create property' : 'Save changes'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
