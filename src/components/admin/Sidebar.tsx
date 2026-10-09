'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building,
    MessageSquare,
    CalendarClock,
    Settings,
    ChevronLeft,
    Menu,
    ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
    leadsBadge?: number;
    viewingsBadge?: number;
}

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Properties', href: '/admin/properties', icon: Building },
    { label: 'Viewings', href: '/admin/viewings', icon: CalendarClock, badgeKey: 'viewings' as const },
    { label: 'Inquiries', href: '/admin/leads', icon: MessageSquare, badgeKey: 'leads' as const },
];

export function Sidebar({ leadsBadge = 0, viewingsBadge = 0 }: SidebarProps) {
    const pathname = usePathname();
    const { sidebarOpen, toggleSidebar } = useAdminStore();

    const badges: Record<string, number> = {
        leads: leadsBadge,
        viewings: viewingsBadge,
    };

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 flex flex-col',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-5">
                    <Link href="/" className="flex items-center gap-3 flex-1 group">
                        <Image
                            src="/brand/logo-icon.png"
                            alt="Fasana Homes"
                            width={32}
                            height={32}
                            className="object-contain group-hover:scale-105 transition-transform"
                        />
                        <div>
                            <h2 className="text-sm font-semibold">FASANA</h2>
                            <p className="text-xs text-muted-foreground">HOMES</p>
                        </div>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </div>

                <Separator />

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === '/admin'
                                ? pathname === '/admin'
                                : pathname.startsWith(item.href);
                        const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-secondary text-secondary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <span className="flex-1">{item.label}</span>
                                {badgeCount > 0 && (
                                    <Badge variant="secondary" className="h-5 min-w-5 justify-center px-1.5 text-xs">
                                        {badgeCount}
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <Separator />

                {/* Footer */}
                <div className="px-3 py-4 space-y-3">
                    <div className="flex items-center justify-between px-3">
                        <span className="text-xs text-muted-foreground">Theme</span>
                        <ThemeToggle />
                    </div>
                    <Link
                        href="/admin/settings"
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                            pathname === '/admin/settings'
                                ? 'bg-secondary text-secondary-foreground font-medium'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                    <Separator />
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Client Side
                    </Link>
                </div>
            </aside>

            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-30 lg:hidden"
                onClick={toggleSidebar}
            >
                <Menu className="h-5 w-5" />
            </Button>
        </>
    );
}
