'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
    Legend,
} from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

const tooltipStyle = {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const tooltipLabelStyle = {
    color: 'hsl(var(--foreground))',
    fontWeight: 500,
    marginBottom: '4px',
};

const tooltipItemStyle = {
    color: 'hsl(var(--foreground))',
};

interface OverviewChartsProps {
    leadsByMonth: { month: string; count: number }[];
    propertyStatusData: { name: string; value: number }[];
}

interface AnalyticsChartsProps {
    viewsByProperty: { name: string; views: number; clicks: number }[];
}

export function OverviewCharts({ leadsByMonth, propertyStatusData }: OverviewChartsProps) {
    return (
        <div className="grid gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
                <CardHeader>
                    <CardTitle>Leads Overview</CardTitle>
                    <CardDescription>Monthly inquiries</CardDescription>
                </CardHeader>
                <CardContent className="h-[280px]">
                    {leadsByMonth.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={leadsByMonth} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.15} />
                                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} cursor={false} />
                                <Bar dataKey="count" name="Leads" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} maxBarSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No lead data yet</div>
                    )}
                </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                    <CardTitle>Property Status</CardTitle>
                    <CardDescription>Current distribution</CardDescription>
                </CardHeader>
                <CardContent className="h-[280px]">
                    {propertyStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={propertyStatusData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={6}
                                >
                                    {propertyStatusData.map((_, i) => (
                                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
                                <Legend wrapperStyle={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No properties yet</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export function AnalyticsCharts({ viewsByProperty }: AnalyticsChartsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Property Performance</CardTitle>
                <CardDescription>Views and clicks across your top properties</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
                {viewsByProperty.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={viewsByProperty} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Area type="monotone" dataKey="views" stroke="hsl(var(--chart-1))" fill="url(#viewsGrad)" strokeWidth={2} />
                            <Area type="monotone" dataKey="clicks" stroke="hsl(var(--chart-2))" fill="url(#clicksGrad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No property data yet</div>
                )}
            </CardContent>
        </Card>
    );
}
