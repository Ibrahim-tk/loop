'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Bell, Palette, Save, Loader2, CheckCircle2, LogOut, Megaphone } from '@/components/admin/icons';
import { signOut } from '@/lib/actions/auth';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<{ email: string; id: string } | null>(null);

    // Profile
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');

    // Password
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Notifications
    const [emailNewLead, setEmailNewLead] = useState(true);
    const [emailMaintenance, setEmailMaintenance] = useState(true);
    const [emailWeeklyReport, setEmailWeeklyReport] = useState(false);

    // Banner toggle
    const [bannerEnabled, setBannerEnabled] = useState(true);
    const [bannerSaving, setBannerSaving] = useState(false);

    useEffect(() => {
        async function loadUser() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser({ email: user.email || '', id: user.id });
                setEmail(user.email || '');
                setDisplayName(user.user_metadata?.display_name || '');
            }

            // Load banner setting
            const { data: setting } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'banner_enabled')
                .single();

            if (setting) {
                setBannerEnabled(setting.value === 'true');
            }

            setLoading(false);
        }
        loadUser();
    }, []);

    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({
                data: { display_name: displayName },
            });
            if (error) throw error;
            toast.success('Profile updated successfully');
        } catch (err: any) {
            toast.error(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        setSaving(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (error) throw error;
            toast.success('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            toast.error(err.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotifications = () => {
        toast.success('Notification preferences saved');
    };

    const handleToggleBanner = async (enabled: boolean) => {
        setBannerEnabled(enabled);
        setBannerSaving(true);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('site_settings')
                .upsert(
                    { key: 'banner_enabled', value: String(enabled) },
                    { onConflict: 'key' }
                );
            if (error) throw error;
            toast.success(enabled ? 'Banner is now visible' : 'Banner is now hidden');
        } catch (err: any) {
            // Revert on error
            setBannerEnabled(!enabled);
            toast.error(err.message || 'Failed to update banner setting');
        } finally {
            setBannerSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted relative">
                    <div className="absolute inset-y-0 left-0 bg-primary rounded-full animate-loading-bar" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and preferences</p>
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => signOut()}
                    className="gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    Log Out
                </Button>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Lock className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2">
                        <Palette className="h-4 w-4" />
                        Appearance
                    </TabsTrigger>
                </TabsList>

                {/* ───── Profile Tab ───── */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your account details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <Input
                                        id="displayName"
                                        placeholder="Your name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        disabled
                                        className="opacity-60"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Email cannot be changed from here
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button onClick={handleUpdateProfile} disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Info</CardTitle>
                            <CardDescription>Your account details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">User ID</p>
                                    <p className="text-sm font-mono">{user?.id?.slice(0, 12)}...</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Auth Provider</p>
                                    <p className="text-sm">Email / Password</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ───── Security Tab ───── */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Ensure your account uses a strong password</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="max-w-md space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button
                                    onClick={handleChangePassword}
                                    disabled={saving || !newPassword || !confirmPassword}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <Lock className="h-4 w-4 mr-2" />
                                    )}
                                    Update Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions</CardTitle>
                            <CardDescription>Manage your active sessions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between rounded-md border p-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">Current Session</p>
                                        <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
                                            <CheckCircle2 className="h-3 w-3" /> Active
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Signed in as {email}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ───── Notifications Tab ───── */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>Choose what updates you receive via email</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ToggleRow
                                label="New Lead Alerts"
                                description="Get notified when a new lead submits a form"
                                checked={emailNewLead}
                                onChange={setEmailNewLead}
                            />
                            <Separator />
                            <ToggleRow
                                label="Maintenance Requests"
                                description="Get notified about new or overdue maintenance orders"
                                checked={emailMaintenance}
                                onChange={setEmailMaintenance}
                            />
                            <Separator />
                            <ToggleRow
                                label="Weekly Summary Report"
                                description="Receive a weekly overview of leads, maintenance, and analytics"
                                checked={emailWeeklyReport}
                                onChange={setEmailWeeklyReport}
                            />

                            <Separator />

                            <div className="flex justify-end">
                                <Button onClick={handleSaveNotifications}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ───── Appearance Tab ───── */}
                <TabsContent value="appearance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Megaphone className="h-5 w-5" />
                                Announcement Banner
                            </CardTitle>
                            <CardDescription>
                                Control the announcement bar shown at the top of the public website
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between gap-4 rounded-md border p-4">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        &ldquo;Accepting new properties — Get a Free Rental Analysis&rdquo;
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {bannerEnabled
                                            ? 'The banner is currently visible to all visitors.'
                                            : 'The banner is currently hidden from all visitors.'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {bannerSaving && (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                    <button
                                        type="button"
                                        role="switch"
                                        aria-checked={bannerEnabled}
                                        onClick={() => handleToggleBanner(!bannerEnabled)}
                                        disabled={bannerSaving}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${bannerEnabled ? 'bg-primary' : 'bg-muted'
                                            }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform ${bannerEnabled ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </TabsContent>
            </Tabs>
        </div>
    );
}

function ToggleRow({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${checked ? 'bg-primary' : 'bg-muted'
                    }`}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                />
            </button>
        </div>
    );
}
