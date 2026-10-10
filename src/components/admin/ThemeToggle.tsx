'use client';

import { Moon, Sun, Monitor } from '@/components/admin/icons';
import { useAdminTheme } from './AdminThemeProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
    const { theme, setTheme } = useAdminTheme();

    const options = [
        { value: 'light' as const, icon: Sun, label: 'Light' },
        { value: 'dark' as const, icon: Moon, label: 'Dark' },
        { value: 'system' as const, icon: Monitor, label: 'System' },
    ];

    return (
        <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            {options.map(({ value, icon: Icon, label }) => (
                <Button
                    key={value}
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(value)}
                    className={cn(
                        'h-7 w-7 p-0',
                        theme === value && 'bg-secondary text-foreground'
                    )}
                    title={label}
                >
                    <Icon className="h-3.5 w-3.5" />
                </Button>
            ))}
        </div>
    );
}
