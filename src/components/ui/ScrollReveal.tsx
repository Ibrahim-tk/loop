'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Blocks that blur + fade in from below as they scroll into view
const TARGETS = 'section > *, footer > *, [data-reveal]';
const EXCLUDE = '[data-no-reveal], [role="dialog"]';
const HIDDEN = { opacity: 0, filter: 'blur(10px)', transform: 'translateY(28px)' };
const SHOWN = { opacity: 1, filter: 'blur(0px)', transform: 'none' };

/*
 * Hides targets with an injected stylesheet and reveals them with the Web Animations API,
 * so React-owned attributes (className etc.) are never touched and hydration stays clean.
 */
export default function ScrollReveal() {
    const pathname = usePathname();

    useEffect(() => {
        // Landing page only
        if (pathname !== '/') return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const style = document.createElement('style');
        style.textContent = `:is(${TARGETS}):not(${EXCLUDE}) { opacity: 0; }`;
        document.head.appendChild(style);

        const show = (el: Element, duration: number) =>
            el.animate([HIDDEN, SHOWN], {
                duration,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'forwards',
            });

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    show(entry.target, 800);
                    io.unobserve(entry.target);
                }
            },
            // Threshold 0 so blocks taller than the viewport still trigger
            { rootMargin: '0px 0px -8% 0px', threshold: 0 }
        );

        const bound = new WeakSet<Element>();
        const scan = () => {
            document.querySelectorAll(TARGETS).forEach((el) => {
                if (bound.has(el) || el.closest(EXCLUDE)) return;
                bound.add(el);
                // Fixed/sticky chrome like navbars and trays shows immediately
                const pos = getComputedStyle(el).position;
                if (pos === 'fixed' || pos === 'sticky') show(el, 0);
                else io.observe(el);
            });
        };

        scan();
        // Pick up content rendered after load (client fetches, pagination)
        const mo = new MutationObserver(scan);
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            io.disconnect();
            mo.disconnect();
            style.remove();
            document.querySelectorAll(TARGETS).forEach((el) =>
                el.getAnimations().forEach((a) => a.cancel())
            );
        };
    }, [pathname]);

    return null;
}
