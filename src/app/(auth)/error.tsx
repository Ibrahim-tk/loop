'use client';

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-500 px-6">
            <div className="max-w-sm w-full text-center space-y-6">
                <h1 className="text-xl font-semibold text-white">Authentication Error</h1>
                <p className="text-white/60 text-sm">
                    {error.message || 'Something went wrong during authentication.'}
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-5 py-2.5 rounded-lg bg-white text-primary-500 font-medium text-sm hover:bg-white/90 transition-colors"
                    >
                        Try Again
                    </button>
                    <a
                        href="/login"
                        className="px-5 py-2.5 rounded-lg border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors"
                    >
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}
