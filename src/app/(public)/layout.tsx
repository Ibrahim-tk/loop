import { createPublicClient } from '@/lib/supabase/server';
import LandingNavbar from '@/components/landing/LandingNavbar';
import Footer from '@/components/marketing/Footer';
import CompareTray from '@/components/listings/CompareTray';

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createPublicClient();

    // Fetch banner setting
    const { data: bannerSetting } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'banner_enabled')
        .single();

    const showBanner = bannerSetting?.value !== 'false';

    return (
        <>
            <LandingNavbar variant="inner" showBanner={showBanner} />
            <main>{children}</main>
            <Footer />
            <CompareTray />
        </>
    );
}
