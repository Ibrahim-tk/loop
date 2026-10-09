import CompareTray from '@/components/listings/CompareTray';

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="min-h-screen bg-white text-[var(--text-primary)] overflow-x-clip"
        >
            {children}
            <CompareTray />
        </div>
    );
}
