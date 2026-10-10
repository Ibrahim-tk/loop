'use client';

import { Toaster } from 'react-hot-toast';
import { CheckCircle, WarningCircle } from '@phosphor-icons/react';
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
                position="bottom-center"
                toastOptions={{
                    duration: 4000,
                    // Soft grey frosted toast, same on every page and theme
                    style: {
                        background: 'rgb(233 233 233 / 0.92)',
                        color: 'var(--color-black, #0a0d12)',
                        border: '1px solid rgb(255 255 255 / 0.7)',
                        borderRadius: '12px',
                        padding: '12px 20px 12px 14px',
                        boxShadow: '0 8px 28px rgba(10, 13, 18, 0.12)',
                        backdropFilter: 'blur(16px) saturate(1.4)',
                        WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
                        fontSize: '14px',
                        fontWeight: '500',
                    },
                    // Large icons: accent green for success, danger red for errors
                    success: { icon: <CheckCircle size={32} weight="fill" color="var(--color-green-500)" className="shrink-0" /> },
                    error: { icon: <WarningCircle size={32} weight="fill" color="var(--text-danger)" className="shrink-0" /> },
                }}
            />
        </div>
    );
}
