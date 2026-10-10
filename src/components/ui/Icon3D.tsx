import { useId } from 'react';
import { cn } from '@/lib/utils';

export type Icon3DName =
    | 'star' | 'heart' | 'search' | 'scales' | 'warning' | 'check' | 'calendar'
    | 'minar' | 'faisal-mosque' | 'mazar-quaid' | 'clock-tower' | 'khyber-gate' | 'city'
    | 'house' | 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'studio' | 'plot' | 'commercial';


/** Flat shapes per icon. `body` gets the light clay, `ink` the darker inset details. */
function shapes(name: Icon3DName) {
    switch (name) {
        // Brand-tinted so a row of them reads as a filled rating
        case 'star':
            return {
                body: null,
                ink: <path d="M60 10c3 0 5 2 6.5 5l11 23l25 3.5c6 1 8.5 8 4 12.5l-18 18l4.5 25c1 6-5.5 10.5-11 7.5L60 93l-22 11.5c-5.5 3-12-1.5-11-7.5l4.5-25l-18-18c-4.5-4.5-2-11.5 4-12.5l25-3.5l11-23C55 12 57 10 60 10Z" />,
            };
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
        // Lahore: Minar-e-Pakistan — flared base platform, tapering shaft, domed crown
        case 'minar':
            return {
                body: (
                    <>
                        <path d="M30 106l8-26h44l8 26Z" />
                        <path d="M52 82l4-58h8l4 58Z" />
                        <rect x="49" y="24" width="22" height="7" rx="3.5" />
                        <path d="M53 24c0-7 3-11 7-13c4 2 7 6 7 13Z" />
                    </>
                ),
                ink: (
                    <>
                        <rect x="44" y="90" width="32" height="6" rx="3" />
                        <rect x="51" y="56" width="18" height="5" rx="2.5" />
                    </>
                ),
            };
        // Islamabad: Faisal Mosque — tent-like prayer hall flanked by four pencil minarets
        case 'faisal-mosque':
            return {
                body: (
                    <>
                        <path d="M30 98l30-56l30 56Z" />
                        {[12, 24, 92, 104].map((x) => (
                            <g key={x}>
                                <rect x={x - 3} y="32" width="6" height="74" rx="3" />
                                <path d={`M${x - 3} 33l3-16l3 16Z`} />
                            </g>
                        ))}
                        <rect x="22" y="96" width="76" height="10" rx="4" />
                    </>
                ),
                ink: <path d="M52 98l8-20l8 20Z" />,
            };
        // Karachi: Mazar-e-Quaid — square white base with arched openings under a single dome
        case 'mazar-quaid':
            return {
                body: (
                    <>
                        <rect x="12" y="96" width="96" height="10" rx="4" />
                        <rect x="22" y="56" width="76" height="44" rx="4" />
                        <path d="M30 58c0-24 13-36 30-36s30 12 30 36Z" />
                        <rect x="58" y="12" width="4" height="12" rx="2" />
                    </>
                ),
                ink: (
                    <>
                        {[34, 54, 74].map((x) => <path key={x} d={`M${x} 98v-20a6 6 0 0 1 12 0v20Z`} />)}
                    </>
                ),
            };
        // Rawalpindi: colonial-era clock tower
        case 'clock-tower':
            return {
                body: (
                    <>
                        <rect x="40" y="38" width="40" height="68" rx="6" />
                        <path d="M36 40l24-28l24 28Z" />
                    </>
                ),
                ink: (
                    <>
                        <circle cx="60" cy="56" r="11" />
                        <rect x="52" y="82" width="16" height="24" rx="5" />
                    </>
                ),
            };
        // Peshawar: Bab-e-Khyber — crenellated gate with a central arch
        case 'khyber-gate':
            return {
                body: (
                    <>
                        <path d="M14 106V34h12v-8h10v8h12v-8h24v8h12v-8h10v8h12v72Z" />
                    </>
                ),
                ink: <path d="M44 106V74a16 16 0 0 1 32 0v32Z" />,
            };
        case 'city':
            return {
                body: (
                    <>
                        <rect x="14" y="54" width="28" height="52" rx="5" />
                        <rect x="46" y="22" width="30" height="84" rx="5" />
                        <rect x="80" y="44" width="26" height="62" rx="5" />
                    </>
                ),
                ink: (
                    <>
                        {[34, 50, 66].map((y) => <rect key={y} x="54" y={y} width="14" height="8" rx="2" />)}
                        <rect x="22" y="66" width="12" height="8" rx="2" />
                        <rect x="87" y="56" width="12" height="8" rx="2" />
                    </>
                ),
            };
        case 'house':
            return {
                body: (
                    <>
                        <path d="M60 14l46 40c4 4 1 10-4 10H18c-5 0-8-6-4-10Z" />
                        <rect x="24" y="56" width="72" height="50" rx="8" />
                        <rect x="78" y="22" width="12" height="28" rx="5" />
                    </>
                ),
                ink: (
                    <>
                        <rect x="50" y="74" width="20" height="32" rx="6" />
                        <rect x="32" y="70" width="12" height="12" rx="3" />
                        <rect x="76" y="70" width="12" height="12" rx="3" />
                    </>
                ),
            };
        case 'apartment':
            return {
                body: <rect x="28" y="10" width="64" height="96" rx="10" />,
                ink: (
                    <>
                        {[24, 44, 64].flatMap((y) => [40, 66].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="14" height="12" rx="3" />))}
                        <rect x="51" y="86" width="18" height="20" rx="5" />
                    </>
                ),
            };
        case 'villa':
            return {
                body: (
                    <>
                        <path d="M10 56l34-24l34 24Z" />
                        <rect x="16" y="52" width="56" height="54" rx="8" />
                        <path d="M64 70l24-16l24 16Z" />
                        <rect x="68" y="66" width="40" height="40" rx="8" />
                    </>
                ),
                ink: (
                    <>
                        <rect x="34" y="78" width="20" height="28" rx="10" />
                        <rect x="80" y="78" width="16" height="14" rx="4" />
                        <rect x="26" y="62" width="10" height="10" rx="3" />
                        <rect x="52" y="62" width="10" height="10" rx="3" />
                    </>
                ),
            };
        case 'townhouse':
            return {
                body: (
                    <>
                        {[8, 42, 76].map((x) => (
                            <g key={x}>
                                <path d={`M${x} 42l18-22l18 22Z`} />
                                <rect x={x} y="38" width="36" height="68" rx="6" />
                            </g>
                        ))}
                    </>
                ),
                ink: (
                    <>
                        {[8, 42, 76].map((x) => (
                            <g key={x}>
                                <rect x={x + 12} y="84" width="12" height="22" rx="4" />
                                <rect x={x + 11} y="54" width="14" height="14" rx="3" />
                            </g>
                        ))}
                    </>
                ),
            };
        case 'penthouse':
            return {
                body: (
                    <>
                        <rect x="30" y="34" width="60" height="72" rx="8" />
                        <rect x="40" y="14" width="40" height="26" rx="6" />
                        <rect x="24" y="30" width="72" height="10" rx="5" />
                    </>
                ),
                ink: (
                    <>
                        <rect x="46" y="20" width="28" height="12" rx="3" />
                        {[50, 70].flatMap((y) => [40, 66].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="14" height="12" rx="3" />))}
                        <rect x="51" y="88" width="18" height="18" rx="5" />
                    </>
                ),
            };
        case 'studio':
            return {
                body: (
                    <>
                        <rect x="14" y="70" width="92" height="22" rx="10" />
                        <rect x="14" y="48" width="30" height="30" rx="10" />
                        <rect x="20" y="88" width="8" height="18" rx="4" />
                        <rect x="92" y="88" width="8" height="18" rx="4" />
                    </>
                ),
                ink: <rect x="48" y="56" width="54" height="18" rx="9" />,
            };
        case 'plot':
            return {
                body: <path d="M20 66l40-22l40 22l-40 24Z" />,
                ink: (
                    <>
                        <rect x="57" y="20" width="6" height="50" rx="3" />
                        <path d="M63 22l26 10l-26 10Z" />
                    </>
                ),
            };
        case 'commercial':
            return {
                body: (
                    <>
                        <rect x="16" y="44" width="88" height="62" rx="8" />
                        <path d="M12 30h96v18c0 7-8 10-16 6c-6 4-12 4-16 0c-6 4-12 4-16 0c-6 4-12 4-16 0c-6 4-12 4-16 0c-8 4-16 1-16-6Z" />
                    </>
                ),
                ink: (
                    <>
                        <rect x="26" y="66" width="34" height="24" rx="4" />
                        <rect x="70" y="66" width="22" height="40" rx="5" />
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
