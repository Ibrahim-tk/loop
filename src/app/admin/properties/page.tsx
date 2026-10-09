'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Building, Search, Eye, Trash2, Pencil, Star, ExternalLink, Loader2, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { deleteProperty as deletePropertyAction, updateProperty } from '@/lib/actions/properties';
import { Property, PropertyStatus } from '@/lib/types';
import { formatListingPrice, LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/lib/properties';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAdminTheme } from '@/components/admin/AdminThemeProvider';

const STATUS_LABELS: Record<string, string> = {
    AVAILABLE: 'Available',
    PENDING: 'Pending',
    RENTED: 'Rented',
    SOLD: 'Sold',
    SHOWCASE: 'Showcase',
    RENOVATION: 'Off market',
    UNDER_MANAGEMENT: 'Onboarding',
    UNLISTED: 'Unlisted',
};

const selectClass =
    'h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [listing, setListing] = useState('');
    const [type, setType] = useState('');
    const [featuredOnly, setFeaturedOnly] = useState(false);
    const { resolvedTheme } = useAdminTheme();

    const fetchProperties = async () => {
        setLoading(true);
        setLoadError(false);
        const { data, error } = await createClient()
            .from('properties')
            .select('*, property_images(storage_url, display_order)')
            .order('created_at', { ascending: false });
        if (error) {
            setLoadError(true);
            toast.error('Failed to load properties');
        } else {
            setProperties((data as Property[]) || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return properties.filter((p) => {
            if (q && ![p.title, p.address, p.city, p.agent_name].some((v) => v?.toLowerCase().includes(q))) return false;
            if (status && p.status !== status) return false;
            if (listing && p.listing_type !== listing) return false;
            if (type && p.property_type !== type) return false;
            if (featuredOnly && !p.featured) return false;
            return true;
        });
    }, [properties, search, status, listing, type, featuredOnly]);

    const hasFilters = Boolean(search || status || listing || type || featuredOnly);
    const clearFilters = () => {
        setSearch('');
        setStatus('');
        setListing('');
        setType('');
        setFeaturedOnly(false);
    };

    const patch = (id: string, changes: Partial<Property>) =>
        setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));

    const handleDelete = async (prop: Property) => {
        setDeletingId(prop.id);
        try {
            await deletePropertyAction(prop.id);
            setProperties((prev) => prev.filter((p) => p.id !== prop.id));
            toast.success(`Deleted “${prop.title}”. It's no longer on the public site.`);
        } catch {
            toast.error('Could not delete the property. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    const toggleFeatured = async (prop: Property) => {
        patch(prop.id, { featured: !prop.featured });
        try {
            await updateProperty(prop.id, { featured: !prop.featured });
            toast.success(prop.featured ? 'Removed from featured' : 'Marked as featured');
        } catch {
            patch(prop.id, { featured: prop.featured });
            toast.error('Failed to update');
        }
    };

    const changeStatus = async (prop: Property, next: string) => {
        patch(prop.id, { status: next as PropertyStatus });
        try {
            await updateProperty(prop.id, { status: next as PropertyStatus });
            toast.success(`Status changed to ${STATUS_LABELS[next]}`);
        } catch {
            patch(prop.id, { status: prop.status });
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
                    <p className="text-muted-foreground text-sm" aria-live="polite">
                        {loading ? 'Loading…' : hasFilters ? `${filtered.length} of ${properties.length} properties` : `${properties.length} properties`}
                    </p>
                </div>
                <Button asChild size="sm">
                    <Link href="/admin/properties/new">
                        <Plus className="h-4 w-4" />
                        Add property
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        aria-label="Search properties"
                        placeholder="Search title, address, city, agent…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
                <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                    <option value="">All statuses</option>
                    {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <select aria-label="Listing type" value={listing} onChange={(e) => setListing(e.target.value)} className={selectClass}>
                    <option value="">Sale &amp; rent</option>
                    <option value="SALE">For sale</option>
                    <option value="RENT">For rent</option>
                </select>
                <select aria-label="Property type" value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                    <option value="">All types</option>
                    {Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="h-4 w-4" />
                    Featured only
                </label>
                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4" /> Clear
                    </Button>
                )}
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12" aria-busy="true">
                            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted relative"><div className="absolute inset-y-0 left-0 bg-primary rounded-full animate-loading-bar" /></div>
                        </div>
                    ) : loadError ? (
                        <div className="text-center py-12 space-y-3">
                            <p className="text-muted-foreground">Properties couldn&apos;t be loaded.</p>
                            <Button variant="outline" size="sm" onClick={fetchProperties}>Try again</Button>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground space-y-3">
                            <Building className="h-12 w-12 mx-auto opacity-30" />
                            <p>{hasFilters ? 'No properties match these filters.' : 'No properties yet.'}</p>
                            {hasFilters ? (
                                <Button variant="outline" size="sm" onClick={clearFilters}>Clear filters</Button>
                            ) : (
                                <Button asChild size="sm"><Link href="/admin/properties/new">Add your first property</Link></Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Views</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((prop) => {
                                        const img = [...(prop.property_images ?? [])].sort((a, b) => a.display_order - b.display_order)[0]?.storage_url;
                                        const price = formatListingPrice(prop);
                                        return (
                                            <TableRow key={prop.id} className={deletingId === prop.id ? 'opacity-50' : undefined}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3 min-w-[220px]">
                                                        <div className="relative h-10 w-14 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                                                            {img && <Image src={img} alt="" fill className="object-cover" sizes="56px" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm flex items-center gap-1.5">
                                                                {prop.title}
                                                                {prop.featured && <Star className="h-3 w-3 fill-current text-amber-500" aria-label="Featured" />}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{prop.address}, {prop.city}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm whitespace-nowrap">
                                                    {PROPERTY_TYPE_LABELS[prop.property_type]}
                                                    <span className="block text-xs text-muted-foreground">{LISTING_TYPE_LABELS[prop.listing_type]}</span>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium whitespace-nowrap">
                                                    {price.amount}
                                                    {price.suffix && <span className="text-muted-foreground font-normal"> {price.suffix}</span>}
                                                </TableCell>
                                                <TableCell>
                                                    <select
                                                        aria-label={`Status for ${prop.title}`}
                                                        value={prop.status}
                                                        onChange={(e) => changeStatus(prop, e.target.value)}
                                                        className={selectClass}
                                                    >
                                                        {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                                    </select>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                                        <Eye className="h-3 w-3" />{prop.view_count}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button variant="ghost" size="icon" onClick={() => toggleFeatured(prop)} aria-label={prop.featured ? 'Remove from featured' : 'Mark as featured'} title="Toggle featured">
                                                            <Star className={`h-4 w-4 ${prop.featured ? 'fill-foreground text-foreground' : 'text-muted-foreground'}`} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/rentals/${prop.id}`} target="_blank" aria-label={`View ${prop.title} on the public site`} title="View on site">
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <Link href={`/admin/properties/${prop.id}/edit`} aria-label={`Edit ${prop.title}`} title="Edit">
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" disabled={deletingId === prop.id} aria-label={`Delete ${prop.title}`} title="Delete">
                                                                    {deletingId === prop.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className={`admin-theme ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete “{prop.title}”?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        It will be removed from the public site straight away, along with its images and viewing requests. This can&apos;t be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(prop)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                        Delete property
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
