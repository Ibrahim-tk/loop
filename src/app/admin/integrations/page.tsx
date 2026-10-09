'use client';

import { useState } from 'react';
import {
    Plug,
    ExternalLink,
    CheckCircle2,
    ArrowRight,
    Building2,
    Users,
    FileText,
    Wrench,
    Shield,
    Zap,
    Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const BUILDIUM_FEATURES = [
    {
        icon: Building2,
        title: 'Property Sync',
        description: 'Automatically sync property listings, units, and availability between Blue Pillar and Buildium.',
    },
    {
        icon: Users,
        title: 'Tenant Management',
        description: 'Import tenant records, lease agreements, and communication history directly from Buildium.',
    },
    {
        icon: FileText,
        title: 'Accounting & Invoicing',
        description: 'Pull rent payments, invoices, and financial reports into your dashboard for unified tracking.',
    },
    {
        icon: Wrench,
        title: 'Maintenance Requests',
        description: 'Sync maintenance work orders and vendor assignments bidirectionally with Buildium.',
    },
];

export default function IntegrationsPage() {
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState<string | null>(null);
    const [lastSyncSummary, setLastSyncSummary] = useState<string | null>(null);

    const runManualSync = async () => {
        setIsSyncing(true);
        setSyncError(null);
        setLastSyncSummary(null);

        try {
            const response = await fetch('/api/buildium/manual-sync', {
                method: 'POST',
            });
            const payload = await response.json();

            if (!response.ok || !payload?.ok) {
                throw new Error(payload?.error || 'Failed to run Buildium sync.');
            }

            const stats = payload?.stats;
            const mode = payload?.mode || 'UNKNOWN';
            setLastSyncSummary(
                `Mode: ${mode}. Synced ${stats?.upserted ?? 0} listings, skipped ${stats?.skipped ?? 0}, replaced ${stats?.imagesReplaced ?? 0} images, deleted ${stats?.deleted ?? 0} stale Buildium listings.`
            );
        } catch (error) {
            setSyncError(error instanceof Error ? error.message : 'Failed to run Buildium sync.');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
                <p className="text-muted-foreground text-sm">
                    Connect external services to streamline your property management workflow
                </p>
            </div>

            {/* Buildium Integration Card */}
            <Card className="relative overflow-hidden border-border/60">
                {/* Subtle gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400" />

                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-sky-400/15 border border-blue-500/20 shadow-sm">
                                <svg
                                    viewBox="0 0 40 40"
                                    className="h-8 w-8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect width="40" height="40" rx="8" fill="url(#buildium-grad)" />
                                    <path
                                        d="M12 14h6v4h-6zM12 20h6v4h-6zM20 14h8v10h-8zM12 26h16v2h-16z"
                                        fill="white"
                                        fillOpacity="0.9"
                                    />
                                    <defs>
                                        <linearGradient id="buildium-grad" x1="0" y1="0" x2="40" y2="40">
                                            <stop stopColor="#2563eb" />
                                            <stop offset="1" stopColor="#0ea5e9" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-lg">Buildium</CardTitle>
                                <CardDescription className="mt-0.5">
                                    Property management software &mdash; buildium.com
                                </CardDescription>
                            </div>
                        </div>
                        <Badge
                            variant="outline"
                            className="border-emerald-500/30 text-emerald-500 gap-1 shrink-0"
                        >
                            <Zap className="h-3 w-3" />
                            Live
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Connect your Buildium account to unlock one-way listing synchronization.
                        Buildium acts as the source of truth and Blue Pillar mirrors listing and status updates.
                        The integration uses Buildium&apos;s REST API for scheduled and manual sync runs.
                    </p>

                    <Separator />

                    {/* Feature Grid */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            What you&apos;ll get
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {BUILDIUM_FEATURES.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="group flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-4 transition-all hover:bg-muted/60 hover:border-border"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                                        <feature.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{feature.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Manual Sync Controls */}
                    <div className="rounded-lg border border-border/60 bg-muted/20 p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium">Manual Buildium Sync</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Run a one-time sync immediately. Daily cron still runs automatically.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                onClick={runManualSync}
                                disabled={isSyncing}
                                className="shrink-0 gap-2"
                            >
                                {isSyncing ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Syncing...
                                    </>
                                ) : (
                                    <>
                                        Run Sync Now
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </>
                                )}
                            </Button>
                        </div>
                        {lastSyncSummary ? (
                            <p className="text-xs text-emerald-600">{lastSyncSummary}</p>
                        ) : null}
                        {syncError ? (
                            <p className="text-xs text-destructive">{syncError}</p>
                        ) : null}
                    </div>

                    {/* CTA Section */}
                    <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-5">
                        {!emailSubmitted ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium">
                                        Interested in early access?
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        We&apos;ll notify you as soon as the Buildium integration is ready.
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => setEmailSubmitted(true)}
                                    className="shrink-0 gap-2"
                                >
                                    Notify Me
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-emerald-500">
                                        You&apos;re on the list!
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        We&apos;ll send you an update when the integration launches.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Link */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Plug className="h-3.5 w-3.5" />
                            Integration via REST API &bull; OAuth 2.0 authentication
                        </div>
                        <a
                            href="https://www.buildium.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Visit Buildium
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
