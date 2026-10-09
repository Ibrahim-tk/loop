'use client';

import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export function AppToaster() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Read initial state
        const saved = localStorage.getItem('admin-theme');
        if (saved === 'dark') setTheme('dark');
        else if (saved === 'light') setTheme('light');
        else {
            setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        }

        // Set up mutation observer to precisely track #admin-root
        const el = document.getElementById('admin-root');
        if (el) {
            setTheme(el.classList.contains('dark') ? 'dark' : 'light');
            
            const observer = new MutationObserver(() => {
                setTheme(el.classList.contains('dark') ? 'dark' : 'light');
            });
            
            observer.observe(el, { attributes: true, attributeFilter: ['class'] });
            return () => observer.disconnect();
        }

        // If not in admin-root, just track system changes
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
            const currentSaved = localStorage.getItem('admin-theme');
            if (!currentSaved || currentSaved === 'system') {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        <div className={`admin-theme ${theme === 'dark' ? 'dark' : ''}`}>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'hsl(var(--background))',
                        color: 'hsl(var(--foreground))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 20px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                    success: {
                        iconTheme: {
                            primary: 'hsl(var(--primary))',
                            secondary: 'hsl(var(--primary-foreground))',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: 'hsl(var(--destructive))',
                            secondary: 'hsl(var(--destructive-foreground))',
                        },
                    },
                }}
            />
        </div>
    );
}
