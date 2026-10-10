'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CalendarClock, Check, CheckCheck, Loader2, Mail, Phone, Search, X } from '@/components/admin/icons';
import { createClient } from '@/lib/supabase/client';
import { updateViewingStatus } from '@/lib/actions/viewings';
import { formatSlot, formatViewingDate, toDateKey } from '@/lib/viewings';
import type { Viewing, ViewingStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type Row = Viewing & { property: { id: string; title: string; city: string } | null };

const STATUS_STYLES: Record<ViewingStatus, string> = {
    PENDING: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    CONFIRMED: 'bg-green-500/10 text-green-600 dark:text-green-400',
    COMPLETED: 'bg-slate-500/10 text-slate-600 dark:text-slate-300',
    CANCELLED: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
};
const STATUS_LABELS: Record<ViewingStatus, string> = { PENDING: 'Pending', CONFIRMED: 'Confirmed', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };

const selectClass =
    'h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

export default function AdminViewingsPage() {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [when, setWhen] = useState<'upcoming' | 'past' | 'all'>('upcoming');
    const [status, setStatus] = useState<ViewingStatus | ''>('');
    const [search, setSearch] = useState('');

    const load = async () => {
        setLoading(true);
        setLoadError(false);
        const { data, error } = await createClient()
            .from('viewings')
            .select('*, property:properties(id, title, city)')
            .order('viewing_date')
            .order('time_slot');
        if (error) setLoadError(true);
        else setRows((data as Row[]) ?? []);
        setLoading(false);
    };

    useEffect(() => {
        load();
    }, []);

    const today = toDateKey(new Date());
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        const list = rows.filter((r) => {
            if (when === 'upcoming' && r.viewing_date < today) return false;
            if (when === 'past' && r.viewing_date >= today) return false;
            if (status && r.status !== status) return false;
            if (q && ![r.name, r.email, r.phone, r.property?.title].some((v) => v?.toLowerCase().includes(q))) return false;
            return true;
        });
        return when === 'past' ? list.reverse() : list;
    }, [rows, when, status, search, today]);

    const pendingCount = rows.filter((r) => r.status === 'PENDING' && r.viewing_date >= today).length;

    const setRowStatus = async (row: Row, next: ViewingStatus) => {
        setBusyId(row.id);
        const result = await updateViewingStatus(row.id, next);
        setBusyId(null);
        if (!result.ok) {
            toast.error(result.error ?? 'Could not update the viewing.');
            return;
        }
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: next } : r)));
        toast.success(`Viewing ${STATUS_LABELS[next].toLowerCase()} for ${row.name}`);
    };

    const hasFilters = Boolean(status || search) || when !== 'upcoming';

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
                <p className="text-muted-foreground text-sm">
                    {loading ? 'Loading…' : `${pendingCount} upcoming ${pendingCount === 1 ? 'request needs' : 'requests need'} confirming`}
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-md border p-0.5" role="radiogroup" aria-label="Date range">
                    {(['upcoming', 'past', 'all'] as const).map((w) => (
                        <button key={w} type="button" role="radio" aria-checked={when === w} onClick={() => setWhen(w)}
                            className={`px-3 h-8 rounded-md text-sm capitalize ${when === w ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                            {w}
                        </button>
                    ))}
                </div>
                <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as ViewingStatus | '')} className={selectClass}>
                    <option value="">All statuses</option>
                    {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="search" aria-label="Search viewings" placeholder="Search name, email, property…" value={search} onChange={(e) => setSearch(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12" aria-busy="true">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                    ) : loadError ? (
                        <div className="text-center py-12 space-y-3">
                            <p className="text-muted-foreground">Viewings couldn&apos;t be loaded.</p>
                            <Button variant="outline" size="sm" onClick={load}>Try again</Button>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground space-y-3">
                            <CalendarClock className="h-12 w-12 mx-auto opacity-30" />
                            <p>{rows.length === 0 ? 'No viewing requests yet. They appear here when visitors book from a property page.' : 'No viewings match these filters.'}</p>
                            {hasFilters && rows.length > 0 && (
                                <Button variant="outline" size="sm" onClick={() => { setWhen('all'); setStatus(''); setSearch(''); }}>Show all viewings</Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>When</TableHead>
                                        <TableHead>Property</TableHead>
                                        <TableHead>Visitor</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((r) => {
                                        const busy = busyId === r.id;
                                        const isPast = r.viewing_date < today;
                                        return (
                                            <TableRow key={r.id} className={busy ? 'opacity-60' : undefined}>
                                                <TableCell className="whitespace-nowrap">
                                                    <p className="text-sm font-medium">{formatViewingDate(r.viewing_date, 'short')}</p>
                                                    <p className="text-xs text-muted-foreground">{formatSlot(r.time_slot)}</p>
                                                </TableCell>
                                                <TableCell className="min-w-[180px]">
                                                    {r.property ? (
                                                        <Link href={`/rentals/${r.property.id}`} target="_blank" className="text-sm hover:underline">{r.property.title}</Link>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">Deleted property</span>
                                                    )}
                                                    {r.property?.city && <p className="text-xs text-muted-foreground">{r.property.city}</p>}
                                                </TableCell>
                                                <TableCell className="min-w-[200px]">
                                                    <p className="text-sm font-medium">{r.name}</p>
                                                    <div className="flex flex-col text-xs text-muted-foreground">
                                                        <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 hover:text-foreground"><Mail className="h-3 w-3" />{r.email}</a>
                                                        {r.phone && <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 hover:text-foreground"><Phone className="h-3 w-3" />{r.phone}</a>}
                                                    </div>
                                                    {r.notes && <p className="text-xs mt-1 max-w-[260px] line-clamp-2" title={r.notes}>“{r.notes}”</p>}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_STYLES[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {busy && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                                                        {r.status === 'PENDING' && !isPast && (
                                                            <Button size="sm" variant="outline" disabled={busy} onClick={() => setRowStatus(r, 'CONFIRMED')}>
                                                                <Check className="h-4 w-4" /> Confirm
                                                            </Button>
                                                        )}
                                                        {r.status === 'CONFIRMED' && (
                                                            <Button size="sm" variant="outline" disabled={busy} onClick={() => setRowStatus(r, 'COMPLETED')}>
                                                                <CheckCheck className="h-4 w-4" /> Mark done
                                                            </Button>
                                                        )}
                                                        {(r.status === 'PENDING' || r.status === 'CONFIRMED') && (
                                                            <Button size="sm" variant="ghost" disabled={busy} onClick={() => setRowStatus(r, 'CANCELLED')} className="text-destructive hover:text-destructive">
                                                                <X className="h-4 w-4" /> Cancel
                                                            </Button>
                                                        )}
                                                        {r.status === 'CANCELLED' && !isPast && (
                                                            <Button size="sm" variant="ghost" disabled={busy} onClick={() => setRowStatus(r, 'PENDING')}>Reopen</Button>
                                                        )}
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
