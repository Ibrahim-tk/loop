import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--surface-variant)] px-5">
            <div className="text-center max-w-md">
                <h1 className="text-[80px] font-bold text-[color:var(--on-surface-primary)] leading-none mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-normal text-[color:var(--on-surface-default)] mb-2">
                    Page not found
                </h2>
                <p className="text-[color:var(--on-surface-variant)] mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-[6px] bg-[var(--on-surface-primary)] text-white text-sm font-medium hover:bg-[var(--foundation-blue-blue-7)] transition-colors"
                    >
                        Go home
                    </Link>
                    <Link
                        href="/properties"
                        className="px-6 py-3 rounded-[6px] border border-[var(--outline-default)] text-sm font-medium text-[color:var(--on-surface-default)] hover:bg-[var(--surface-variant)] transition-colors"
                    >
                        Browse properties
                    </Link>
                </div>
            </div>
        </div>
    );
}
