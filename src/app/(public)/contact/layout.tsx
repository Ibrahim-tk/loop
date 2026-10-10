import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description:
        'Get in touch with Fasana Homes for property management inquiries, renovation quotes, or rental questions. We respond within 24 hours.',
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
