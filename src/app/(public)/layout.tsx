import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/marketing/Footer';
import CompareTray from '@/components/listings/CompareTray';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <LandingNavbar variant="inner" />
            <main>{children}</main>
            <Footer />
            <CompareTray />
        </>
    );
}
