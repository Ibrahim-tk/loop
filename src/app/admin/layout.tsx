import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminThemeProvider } from '@/components/admin/AdminThemeProvider';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();

    // Fetch badge counts
    const today = new Date().toISOString().slice(0, 10);
    const [{ count: unreadLeads }, { count: pendingViewings }] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('viewings').select('*', { count: 'exact', head: true }).eq('status', 'PENDING').gte('viewing_date', today),
    ]);

    return (
        <AdminThemeProvider>
            <div id="admin-root" className="min-h-screen admin-theme dark">
                <Sidebar
                    leadsBadge={unreadLeads || 0}
                    viewingsBadge={pendingViewings || 0}
                />
                <main className="lg:pl-64 min-h-screen">
                    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </AdminThemeProvider>
    );
}
