import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Neutral scale: black → gray (design system)
                primary: {
                    DEFAULT: 'hsl(var(--primary, 0 0% 0%))',
                    50: '#f4f4f4',
                    100: '#e9e9e9',
                    200: '#d9d9d9',
                    300: '#bbc2cc',
                    400: '#2a2a2a',
                    500: '#000000',
                    600: '#040404',
                    700: '#040404',
                    800: '#000000',
                    900: '#000000',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                // Brand green (design system)
                accent: {
                    DEFAULT: 'hsl(var(--accent, 0 0% 96%))',
                    50: '#e8f8ef',
                    100: '#c9eed8',
                    200: '#93ddb2',
                    300: '#4fc282',
                    400: '#0da34e',
                    500: '#0f9549',
                    600: '#0a783a',
                    700: '#085f2e',
                    800: '#064622',
                    900: '#042e16',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                glass: {
                    white: 'rgba(255, 255, 255, 0.08)',
                    border: 'rgba(255, 255, 255, 0.12)',
                    light: 'rgba(255, 255, 255, 0.95)',
                    'light-border': 'rgba(0, 0, 0, 0.08)',
                },
                // Shadcn tokens
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
            },
            fontFamily: {
                sans: ['var(--font-archivo)'],
                serif: ['var(--font-instrument)'],
                display: ['var(--font-pragati)'],
            },
            backdropBlur: {
                glass: '20px',
            },
            boxShadow: {
                glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
                'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.16)',
                'glass-inset': 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
                'card-hover': '0 20px 60px rgba(15, 149, 73, 0.15)',
                'liquid-glow': '0 8px 32px rgba(15, 149, 73, 0.2), 0 0 60px rgba(15, 149, 73, 0.08)',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'slide-in-left': 'slideInLeft 0.6s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(15, 149, 73, 0.2)' },
                    '100%': { boxShadow: '0 0 40px rgba(15, 149, 73, 0.4)' },
                },
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};

export default config;

