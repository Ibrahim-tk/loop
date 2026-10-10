'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface AdminThemeContextType {
    theme: Theme;
    resolvedTheme: 'light' | 'dark';
    setTheme: (theme: Theme) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
    theme: 'light',
    resolvedTheme: 'light',
    setTheme: () => { },
});

export function useAdminTheme() {
    return useContext(AdminThemeContext);
}

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

    // Load saved theme on mount
    useEffect(() => {
        const saved = localStorage.getItem('admin-theme') as Theme | null;
        if (saved) {
            setThemeState(saved);
        }
    }, []);

    // Resolve and apply theme
    useEffect(() => {
        const resolved = theme === 'system' ? getSystemTheme() : theme;
        setResolvedTheme(resolved);

        // Apply to .admin-theme element
        const el = document.getElementById('admin-root');
        if (el) {
            if (resolved === 'dark') {
                el.classList.add('dark');
            } else {
                el.classList.remove('dark');
            }
        }
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => {
            const resolved = getSystemTheme();
            setResolvedTheme(resolved);
            const el = document.getElementById('admin-root');
            if (el) {
                el.classList.toggle('dark', resolved === 'dark');
            }
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem('admin-theme', newTheme);
    };

    return (
        <AdminThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </AdminThemeContext.Provider>
    );
}
