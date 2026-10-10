'use client';

import { useEffect, useRef, useState } from 'react';

const MIN_MS = 1200; // never flash by too fast
const MAX_MS = 9000; // never block the page on a slow network
const READY_RATIO = 0.6; // share of the video buffered before we let go

/*
 * Full-screen brand-green cover with a huge "Fasana" that fills with white
 * as the hero video buffers, so the video starts smoothly instead of stuttering.
 */
export default function Preloader() {
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const [gone, setGone] = useState(false);
    const target = useRef(0);

    useEffect(() => {
        const start = performance.now();
        const video = document.querySelector<HTMLVideoElement>('section video');
        let ready = false;
        let raf = 0;

        const readBuffer = () => {
            if (!video || !video.duration || !video.buffered.length) return;
            const end = video.buffered.end(video.buffered.length - 1);
            target.current = Math.max(target.current, Math.min(1, end / video.duration / READY_RATIO));
        };
        const markReady = () => {
            ready = true;
            target.current = 1;
        };

        if (!video || video.readyState >= 4) markReady();
        video?.addEventListener('progress', readBuffer);
        video?.addEventListener('canplaythrough', markReady);
        video?.load();

        // Ease the fill toward the real buffer level; creep slowly while waiting so it never looks frozen
        let shown = 0;
        const tick = (now: number) => {
            const elapsed = now - start;
            if (elapsed > MAX_MS) markReady();
            const goal = Math.max(target.current, Math.min(0.9, elapsed / MAX_MS));
            const capped = elapsed < MIN_MS ? Math.min(goal, elapsed / MIN_MS) : goal;
            shown += (capped - shown) * 0.08;
            setProgress(shown);
            if (ready && elapsed >= MIN_MS && shown > 0.995) {
                setProgress(1);
                video?.play().catch(() => {});
                setDone(true);
                return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        document.documentElement.style.overflow = 'hidden';
        return () => {
            cancelAnimationFrame(raf);
            video?.removeEventListener('progress', readBuffer);
            video?.removeEventListener('canplaythrough', markReady);
            document.documentElement.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        if (!done) return;
        document.documentElement.style.overflow = '';
        const t = setTimeout(() => setGone(true), 900);
        return () => clearTimeout(t);
    }, [done]);

    if (gone) return null;

    const pct = Math.round(progress * 100);
    return (
        <div
            role="progressbar"
            aria-label="Loading Fasana"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[var(--color-green-500)] transition-transform [transition-duration:900ms] [transition-timing-function:cubic-bezier(0.83,0,0.17,1)] ${done ? '-translate-y-full pointer-events-none' : 'translate-y-0'}`}
        >
            <div className="relative select-none whitespace-nowrap font-[family-name:var(--font-bricolage-loaded)] font-semibold leading-none tracking-[-0.04em] text-[clamp(96px,26vw,560px)]">
                {/* Dull base */}
                <span className="block text-white/20">Fasana</span>
                {/* White fill, revealed left to right */}
                <span
                    aria-hidden="true"
                    className="absolute inset-0 block text-white"
                    style={{ clipPath: `inset(0 ${100 - progress * 100}% 0 0)` }}
                >
                    Fasana
                </span>
            </div>
        </div>
    );
}
