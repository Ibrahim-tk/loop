'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--surface-variant)] px-5">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-[color:var(--on-surface-default)] mb-2">
                    Something went wrong
                </h2>
                <p className="text-[color:var(--on-surface-variant)] mb-6">
                    An unexpected error occurred. Please try again.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 rounded-[6px] bg-[var(--on-surface-primary)] text-white text-sm font-medium hover:bg-[var(--foundation-blue-blue-7)] transition-colors"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-[6px] border border-[var(--outline-default)] text-sm font-medium text-[color:var(--on-surface-default)] hover:bg-[var(--surface-variant)] transition-colors"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
