import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Rental Analysis | Blue Pillar Management',
    description:
        'Get a data-driven report on your rental property\'s value. Discover your property\'s earning potential with Blue Pillar Management.',
};

export default function RentalAnalysisLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
