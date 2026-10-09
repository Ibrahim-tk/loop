'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Building, CalendarClock, CheckCircle2, Home, MessageSquare, Plus, Star, type LucideIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OverviewCharts, AnalyticsCharts } from '@/components/admin/DashboardCharts';
import { formatListingPrice, LISTING_TYPE_LABELS } from '@/lib/properties';
import { formatSlot, formatViewingDate, toDateKey } from '@/lib/viewings';
import type { ListingType, PropertyStatus } from '@/lib/types';

interface PropertyRow {
    id: string;
    title: string;
    city: string;
    status: PropertyStatus;
    featured: boolean;
    listing_type: ListingType;
    rent_price: number;
    view_count: number;
    click_count: number;
    created_at: string;
}
interface LeadRow {
    id: string;
    name: string;
    message: string;
    created_at: string;
    property: { id: string; title: string } | null;
}
interface ViewingRow {
    id: string;
    name: string;
    viewing_date: string;
    time_slot: string;
    status: string;
    property: { id: string; title: string } | null;
}

interface DashboardData {
    properties: PropertyRow[];
    recentLeads: LeadRow[];
    leadsThisMonth: number;
    upcomingViewings: ViewingRow[];
    pendingViewings: number;
    leadDates: string[];
}

const timeAgo = (iso: string) => {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

function StatCard({ title, value, hint, icon: Icon, href, loading }: { title: string; value: number; hint: string; icon: LucideIcon; href: string; loading: boolean }) {
    return (
        <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
            <Card className="hover:bg-muted/50 transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{loading ? '—' : value}</div>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                </CardContent>
            </Card>
        </Link>
    );
}

function ListCard({ title, href, linkLabel, empty, loading, children }: { title: string; href: string; linkLabel: string; empty: string; loading: boolean; children: React.ReactNode[] }) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base">{title}</CardTitle>
                <Link href={href} className="text-xs text-muted-foreground hover:text-foreground underline">{linkLabel}</Link>
            </CardHeader>
            <CardContent className="flex-1">
                {loading ? (
                    <div className="space-y-3" aria-busy="true">
                        {[0, 1, 2].map((i) => <div key={i} className="h-10 rounded bg-muted animate-pulse" />)}
                    </div>
                ) : children.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6 text-center">{empty}</p>
                ) : (
                    <ul className="divide-y">{children}</ul>
                )}
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState(false);

    const load = useCallback(async () => {
        setError(false);
        const supabase = createClient();
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const today = toDateKey(new Date());

        const [props, leads, leadCount, viewings, pendingCount, leadDates] = await Promise.all([
            supabase.from('properties').select('id, title, city, status, featured, listing_type, rent_price, view_count, click_count, created_at').order('created_at', { ascending: false }),
            supabase.from('leads').select('id, name, message, created_at, property:properties(id, title)').order('created_at', { ascending: false }).limit(5),
            supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
            supabase.from('viewings').select('id, name, viewing_date, time_slot, status, property:properties(id, title)').gte('viewing_date', today).neq('status', 'CANCELLED').order('viewing_date').order('time_slot').limit(5),
            supabase.from('viewings').select('*', { count: 'exact', head: true }).eq('status', 'PENDING').gte('viewing_date', today),
            supabase.from('leads').select('created_at').order('created_at'),
        ]);

        if (props.error) {
            setError(true);
            return;
        }
        setData({
            properties: (props.data as PropertyRow[]) ?? [],
            recentLeads: (leads.data as unknown as LeadRow[]) ?? [],
            leadsThisMonth: leadCount.count ?? 0,
            upcomingViewings: (viewings.data as unknown as ViewingRow[]) ?? [],
            pendingViewings: pendingCount.count ?? 0,
            leadDates: (leadDates.data ?? []).map((l) => l.created_at as string),
        });
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const loading = !data && !error;
    const props = data?.properties ?? [];
    const count = (fn: (p: PropertyRow) => boolean) => props.filter(fn).length;
    const sold = count((p) => p.status === 'SOLD');
    const rented = count((p) => p.status === 'RENTED');

    const statusChart = Object.entries(
        props.reduce<Record<string, number>>((acc, p) => ({ ...acc, [p.status]: (acc[p.status] ?? 0) + 1 }), {})
    ).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

    const leadsByMonth = Object.entries(
        (data?.leadDates ?? []).reduce<Record<string, number>>((acc, iso) => {
            const d = new Date(iso);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            return { ...acc, [key]: (acc[key] ?? 0) + 1 };
        }, {})
    )
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([key, c]) => {
            const [y, m] = key.split('-');
            return { month: new Date(+y, +m - 1).toLocaleString('en-US', { month: 'short' }), count: c };
        });

    const viewsByProperty = [...props]
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 6)
        .map((p) => ({ name: p.title.length > 18 ? `${p.title.slice(0, 18)}…` : p.title, views: p.view_count || 0, clicks: p.click_count || 0 }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Your catalogue, inquiries and viewings at a glance.</p>
                </div>
                <Button asChild size="sm">
                    <Link href="/admin/properties/new"><Plus className="h-4 w-4" /> Add property</Link>
                </Button>
            </div>

            {error && (
                <div role="alert" className="flex items-center justify-between gap-4 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm">
                    <span className="text-destructive">The dashboard couldn&apos;t load.</span>
                    <Button variant="outline" size="sm" onClick={load}>Try again</Button>
                </div>
            )}

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        <StatCard title="Total properties" value={props.length} hint={`${count((p) => p.listing_type === 'SALE')} for sale · ${count((p) => p.listing_type === 'RENT')} for rent`} icon={Building} href="/admin/properties" loading={loading} />
                        <StatCard title="Available" value={count((p) => p.status === 'AVAILABLE')} hint="On the market now" icon={Home} href="/admin/properties" loading={loading} />
                        <StatCard title="Sold / rented" value={sold + rented} hint={`${sold} sold · ${rented} rented`} icon={CheckCircle2} href="/admin/properties" loading={loading} />
                        <StatCard title="Featured" value={count((p) => p.featured)} hint="Shown first on the site" icon={Star} href="/admin/properties" loading={loading} />
                        <StatCard title="Viewings to confirm" value={data?.pendingViewings ?? 0} hint="Upcoming, still pending" icon={CalendarClock} href="/admin/viewings" loading={loading} />
                        <StatCard title="Inquiries" value={data?.leadsThisMonth ?? 0} hint="This month" icon={MessageSquare} href="/admin/leads" loading={loading} />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <ListCard title="Recent additions" href="/admin/properties" linkLabel="All properties" empty="No properties yet." loading={loading}>
                            {props.slice(0, 5).map((p) => {
                                const price = formatListingPrice(p);
                                return (
                                    <li key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <Link href={`/admin/properties/${p.id}/edit`} className="block text-sm font-medium truncate hover:underline">{p.title}</Link>
                                            <p className="text-xs text-muted-foreground">{LISTING_TYPE_LABELS[p.listing_type]} · {p.city} · {timeAgo(p.created_at)}</p>
                                        </div>
                                        <span className="text-sm whitespace-nowrap">{price.amount}<span className="text-muted-foreground text-xs">{price.suffix}</span></span>
                                    </li>
                                );
                            })}
                        </ListCard>

                        <ListCard title="Recent inquiries" href="/admin/leads" linkLabel="All inquiries" empty="No inquiries yet." loading={loading}>
                            {(data?.recentLeads ?? []).map((l) => (
                                <li key={l.id} className="py-2.5">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-sm font-medium truncate">{l.name}</span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(l.created_at)}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{l.property?.title ? `${l.property.title} · ` : ''}{l.message}</p>
                                </li>
                            ))}
                        </ListCard>

                        <ListCard title="Upcoming viewings" href="/admin/viewings" linkLabel="All viewings" empty="No upcoming viewings." loading={loading}>
                            {(data?.upcomingViewings ?? []).map((v) => (
                                <li key={v.id} className="py-2.5 flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{v.property?.title ?? 'Deleted property'}</p>
                                        <p className="text-xs text-muted-foreground">{formatViewingDate(v.viewing_date, 'short')} · {formatSlot(v.time_slot)} · {v.name}</p>
                                    </div>
                                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${v.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                                        {v.status === 'CONFIRMED' ? 'Confirmed' : 'Pending'}
                                    </span>
                                </li>
                            ))}
                        </ListCard>
                    </div>

                    <OverviewCharts leadsByMonth={leadsByMonth} propertyStatusData={statusChart} />
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <AnalyticsCharts viewsByProperty={viewsByProperty} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
