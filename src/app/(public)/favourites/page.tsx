import type { Metadata } from 'next';
import FavouritesClient from './FavouritesClient';

export const metadata: Metadata = {
    title: 'Saved properties',
    description: 'Properties you have saved.',
};

export default function FavouritesPage() {
    return <FavouritesClient />;
}
