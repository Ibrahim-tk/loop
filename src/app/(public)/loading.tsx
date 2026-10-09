export default function PublicLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--surface-variant)] pt-[var(--header-height)]">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[var(--outline-default)] relative">
                <div className="absolute inset-y-0 left-0 bg-[var(--on-surface-primary)] rounded-full animate-loading-bar" />
            </div>
        </div>
    );
}
