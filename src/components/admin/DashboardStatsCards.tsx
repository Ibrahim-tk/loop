'use client';

import Link from 'next/link';

import {
    Building,
    Eye,
    MessageSquare,
    DollarSign,
    TrendingUp,
    Home,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface DashboardStats {
    totalProperties: number;
    activeListings: number;
    totalViews: number;
    totalLeads: number;
    leadsThisMonth: number;
    totalMonthlyRent: number;
    avgRent: number;
}

interface DashboardStatsCardsProps {
    stats: DashboardStats;
    loading: boolean;
}

export function OverviewStatsCards({ stats, loading }: DashboardStatsCardsProps) {
    const occupancyRate = stats.totalProperties > 0
        ? Math.round(((stats.totalProperties - stats.activeListings) / stats.totalProperties) * 100)
        : 0;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/properties">
                <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '—' : stats.totalProperties}</div>
                        <p className="text-xs text-muted-foreground">{occupancyRate}% occupancy rate</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/admin/properties">
                <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '—' : stats.activeListings}</div>
                        <p className="text-xs text-muted-foreground">Available for rent</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/admin/leads">
                <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '—' : stats.leadsThisMonth}</div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center rounded-sm bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                This Month
                            </span>
                            <p className="text-xs text-muted-foreground">{stats.totalLeads} total</p>
                        </div>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/admin/properties">
                <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? '—' : stats.totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across all properties</p>
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}

export function AnalyticsStatsCards({ stats }: { stats: DashboardStats }) {
    return (
        <div className="grid gap-4 sm:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Rent Income</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${stats.totalMonthlyRent.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">From rented properties</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Across all properties</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rent</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${Math.round(stats.avgRent).toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Per rented property</p>
                </CardContent>
            </Card>
        </div>
    );
}
