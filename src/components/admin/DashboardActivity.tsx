'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface DashboardActivityProps {
    recentLeads: any[];
    leadsThisMonth: number;
    loading: boolean;
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export function DashboardActivity({ recentLeads, leadsThisMonth, loading }: DashboardActivityProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
                <CardDescription>{leadsThisMonth > 0 ? `${leadsThisMonth} new this month` : 'Latest inquiries'}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {recentLeads.map((lead) => (
                        <div key={lead.id} className="flex items-center gap-4">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="text-xs">
                                    {lead.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium leading-none">{lead.name}</p>
                                        <Badge variant={lead.type === 'OWNER' ? 'default' : 'secondary'} className="text-[10px]">{lead.type}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">{timeAgo(lead.created_at)}</p>
                            </div>
                        </div>
                    ))}
                    {recentLeads.length === 0 && !loading && (
                        <p className="text-sm text-muted-foreground text-center py-4">No leads yet</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
