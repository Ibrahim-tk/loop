'use client';

export default function PublicError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
            <div className="max-w-md space-y-6">
                <div className="text-6xl font-bold text-[var(--foundation-blue-blue-6)]">Oops</div>
                <h1 className="text-2xl font-semibold text-[var(--on-surface-default)]">
                    Something went wrong
                </h1>
                <p className="text-[var(--on-surface-variant)]">
                    {error.message || 'An unexpected error occurred. Please try again.'}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 rounded-xl bg-[var(--foundation-blue-blue-6)] text-white font-medium transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                        Try Again
                    </button>
                    <a
                        href="/"
                        className="px-6 py-3 rounded-xl border border-[var(--outline-default)] text-[var(--on-surface-default)] font-medium transition-all hover:bg-[var(--surface-variant)]"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    );
}
