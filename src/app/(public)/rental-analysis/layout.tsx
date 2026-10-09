import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Free Rental Analysis | Fasana Homes',
    description:
        'Get a data-driven report on your rental property\'s value. Discover your property\'s earning potential with Fasana Homes.',
};

export default function RentalAnalysisLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
