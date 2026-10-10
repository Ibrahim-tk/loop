import { LucideIcon } from '@/components/admin/icons';
import Link from 'next/link';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    badge?: number;
    badgeColor?: 'accent' | 'red' | 'amber' | 'emerald';
    href?: string;
    subtitle?: string;
}

export default function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    badge,
    badgeColor = 'accent',
    href,
    subtitle,
}: MetricCardProps) {
    const badgeColors = {
        accent: 'bg-accent-500 text-white',
        red: 'bg-red-500 text-white',
        amber: 'bg-amber-500 text-white',
        emerald: 'bg-emerald-500 text-white',
    };

    const content = (
        <div className="glass-card p-6 group hover:border-accent-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/5 relative overflow-hidden">
            {/* Background gradient effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-sm text-white/40 mb-1 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-white/30 mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <p className={`text-xs mt-2 font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                            {trend}
                        </p>
                    )}
                </div>
                <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-accent-500/10 text-accent-400 group-hover:bg-accent-500/20 group-hover:scale-110 transition-all duration-300">
                        <Icon className="h-6 w-6" />
                    </div>
                    {badge !== undefined && badge > 0 && (
                        <span className={`absolute -top-2 -right-2 min-w-[22px] h-[22px] flex items-center justify-center rounded-full text-xs font-bold ${badgeColors[badgeColor]} shadow-lg animate-pulse`}>
                            {badge > 99 ? '99+' : badge}
                        </span>
                    )}
                </div>
            </div>

            {/* Click indicator */}
            {href && (
                <div className="absolute bottom-3 right-3 text-white/20 group-hover:text-white/40 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            )}
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}
