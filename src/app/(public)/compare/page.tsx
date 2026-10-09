import type { Metadata } from 'next';
import CompareClient from './CompareClient';

export const metadata: Metadata = {
    title: 'Compare properties',
    description: 'Compare price, size, features and amenities side by side.',
};

export default function ComparePage() {
    return <CompareClient />;
}
