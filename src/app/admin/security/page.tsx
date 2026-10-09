import SecuritySettings from '@/components/admin/SecuritySettings';

export const metadata = {
    title: 'Security Settings | Blue Pillar Management',
};

export default function SecurityPage() {
    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white">
                    Security Settings
                </h2>
                <p className="text-zinc-400 mt-1">Manage your Two-Factor Authentication</p>
            </div>
            
            <SecuritySettings />
        </div>
    );
}
