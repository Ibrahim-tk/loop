import { useId } from 'react';
import { cn } from '@/lib/utils';

export type Icon3DName = 'heart' | 'search' | 'scales' | 'warning' | 'check' | 'calendar';


/** Flat shapes per icon. `body` gets the light clay, `ink` the darker inset details. */
function shapes(name: Icon3DName) {
    switch (name) {
        case 'heart':
            return {
                body: <path d="M60 102 C22 76 10 56 16 38 C22 20 46 16 60 34 C74 16 98 20 104 38 C110 56 98 76 60 102 Z" />,
            };
        case 'search':
            return {
                body: (
                    <>
                        <path fillRule="evenodd" d="M50 14a34 34 0 1 1 0 68a34 34 0 1 1 0-68Zm0 12a22 22 0 1 0 0 44a22 22 0 1 0 0-44Z" />
                        <rect x="70" y="74" width="40" height="15" rx="7.5" transform="rotate(45 70 74)" />
                    </>
                ),
                glass: <circle cx="50" cy="48" r="22" />,
            };
        case 'scales':
            return {
                body: (
                    <>
                        <rect x="34" y="92" width="52" height="16" rx="8" />
                        <rect x="53" y="26" width="14" height="72" rx="7" />
                        <rect x="12" y="26" width="96" height="14" rx="7" />
                        <circle cx="60" cy="22" r="10" />
                        <rect x="21" y="34" width="8" height="32" rx="4" />
                        <rect x="91" y="34" width="8" height="32" rx="4" />
                        <path d="M4 62h42a21 17 0 0 1-42 0Z" />
                        <path d="M74 62h42a21 17 0 0 1-42 0Z" />
                    </>
                ),
            };
        case 'warning':
            return {
                body: <path d="M60 14c4 0 7 2 9.5 6.5l36 64c4.5 8 -0.5 17.5 -9.5 17.5h-72c-9 0-14-9.5-9.5-17.5l36-64C53 16 56 14 60 14Z" />,
                ink: (
                    <>
                        <rect x="54" y="40" width="12" height="34" rx="6" />
                        <circle cx="60" cy="87" r="7" />
                    </>
                ),
            };
        case 'calendar':
            return {
                body: (
                    <>
                        <rect x="14" y="24" width="92" height="82" rx="16" />
                        <rect x="34" y="12" width="12" height="24" rx="6" />
                        <rect x="74" y="12" width="12" height="24" rx="6" />
                    </>
                ),
                ink: (
                    <>
                        <rect x="14" y="24" width="92" height="22" rx="11" />
                        <circle cx="40" cy="64" r="6" />
                        <circle cx="60" cy="64" r="6" />
                        <circle cx="80" cy="64" r="6" />
                        <circle cx="40" cy="84" r="6" />
                        <circle cx="60" cy="84" r="6" />
                    </>
                ),
            };
        case 'check':
            return {
                body: <circle cx="60" cy="58" r="44" />,
                ink: <path d="M40 60l14 14l28-30" fill="none" style={{ stroke: "var(--ink)" }} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />,
            };
    }
}

/**
 * Soft, colorless 3D "clay" icon for empty, error and success states.
 * An SVG lighting filter inflates each flat shape, so new icons only need a silhouette.
 */
export default function Icon3D({ name, size = 96, className }: { name: Icon3DName; size?: number; className?: string }) {
    const id = useId().replace(/:/g, '');
    const { body, ink, glass } = shapes(name) as { body: React.ReactNode; ink?: React.ReactNode; glass?: React.ReactNode };

    return (
        <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true" className={cn('overflow-visible', className)}>
            <defs>
                {/* Body: --gradient-page (light brand green → neutral). Details: --gradient-brand. */}
                <linearGradient id={`body-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" style={{ stopColor: 'var(--gradient-page-start)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--gradient-page-end)' }} />
                </linearGradient>
                <linearGradient id={`ink-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" style={{ stopColor: 'var(--gradient-brand-start)' }} />
                    <stop offset="54.18%" style={{ stopColor: 'var(--gradient-brand-mid)' }} />
                    <stop offset="100%" style={{ stopColor: 'var(--gradient-brand-end)' }} />
                </linearGradient>
                <filter id={`clay-${id}`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="9" result="blur" />
                    <feDiffuseLighting in="blur" surfaceScale="6" diffuseConstant="1.05" lightingColor="#fff" result="diffuseRaw">
                        <feDistantLight azimuth="235" elevation="48" />
                    </feDiffuseLighting>
                    {/* Ambient fill so the shaded side stays a soft grey instead of going dark */}
                    <feComponentTransfer in="diffuseRaw" result="diffuse">
                        <feFuncR type="linear" slope="0.4" intercept="0.62" />
                        <feFuncG type="linear" slope="0.4" intercept="0.62" />
                        <feFuncB type="linear" slope="0.4" intercept="0.62" />
                    </feComponentTransfer>
                    <feSpecularLighting in="blur" surfaceScale="6" specularConstant="0.16" specularExponent="10" lightingColor="#fff" result="spec">
                        <feDistantLight azimuth="235" elevation="58" />
                    </feSpecularLighting>
                    <feBlend in="SourceGraphic" in2="diffuse" mode="multiply" result="lit" />
                    <feComposite in="spec" in2="lit" operator="arithmetic" k2="1" k3="1" result="shine" />
                    <feComposite in="shine" in2="SourceAlpha" operator="in" />
                </filter>
                <filter id={`shadow-${id}`} x="-50%" y="-200%" width="200%" height="500%">
                    <feGaussianBlur stdDeviation="4" />
                </filter>
            </defs>

            <ellipse cx="60" cy="112" rx="36" ry="5" fill="#0a0d12" opacity="0.14" filter={`url(#shadow-${id})`} />
            <g fill={`url(#body-${id})`} filter={`url(#clay-${id})`}>{body}</g>
            {glass && <g fill="#ffffff" opacity="0.55" filter={`url(#clay-${id})`}>{glass}</g>}
            {ink && <g fill={`url(#ink-${id})`} style={{ ['--ink' as string]: `url(#ink-${id})` }} filter={`url(#clay-${id})`}>{ink}</g>}
        </svg>
    );
}
