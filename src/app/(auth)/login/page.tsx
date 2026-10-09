'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter your email address');
            return;
        }
        if (!password.trim()) {
            toast.error('Please enter your password');
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                if (authError.message.includes('Invalid login credentials')) {
                    toast.error('Invalid email or password. Please try again.');
                } else if (authError.message.includes('Email not confirmed')) {
                    toast.error('Please verify your email before signing in.');
                } else if (authError.message.includes('Too many requests')) {
                    toast.error('Too many login attempts. Please wait a moment.');
                } else {
                    toast.error(authError.message);
                }
                return;
            }

            toast.success('Welcome back! Redirecting to dashboard...');

            setIsRedirecting(true);
            // Allow Supabase to fully commit session cookies before navigating.
            // A hard navigation ensures the middleware sees the authenticated user.
            router.refresh();
            await new Promise((r) => setTimeout(r, 300));
            window.location.href = '/admin';
        } catch {
            toast.error('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--surface-variant)] flex items-center justify-center p-4">
            {isRedirecting && (
                <div className="fixed top-0 left-0 right-0 z-50">
                    <div className="h-1.5 w-full overflow-hidden bg-white/20">
                        <div className="h-full bg-[var(--on-surface-primary)] w-1/3 animate-loading-bar" />
                    </div>
                </div>
            )}
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-6">
                        <img
                            src="/brand/logo-dark.png"
                            alt="Fasana Homes"
                            className="h-[36px] sm:h-[40px] w-auto object-contain mx-auto"
                        />
                    </Link>
                    <h1 className="text-[length:var(--typeface-heading-h3)] font-normal text-[color:var(--on-surface-default)]">
                        Welcome back
                    </h1>
                    <p className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-variant)] mt-2">
                        Sign in to manage your properties
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-[8px] border border-[var(--outline-default)] p-8 sm:p-10 shadow-sm">
                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-[6px] border border-[var(--outline-default)] bg-white text-[length:var(--typeface-paragraph-text)] text-[color:var(--on-surface-default)] placeholder:text-[color:var(--on-surface-variant)] placeholder:opacity-50 focus:outline-none focus:border-[var(--on-surface-primary)] focus:ring-1 focus:ring-[var(--on-surface-primary)] transition-colors"
                                placeholder="admin@fasanahomes.com"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[length:var(--typeface-paragraph-text)] font-light text-[color:var(--on-surface-default)] leading-6">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 rounded-[6px] border border-[var(--outline-default)] bg-white text-[length:var(--typeface-paragraph-text)] text-[color:var(--on-surface-default)] placeholder:text-[color:var(--on-surface-variant)] placeholder:opacity-50 focus:outline-none focus:border-[var(--on-surface-primary)] focus:ring-1 focus:ring-[var(--on-surface-primary)] transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface-default)] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || isRedirecting}
                            className="w-full flex items-center justify-center gap-2 px-[22.5px] py-[15px] rounded-[6px] bg-[var(--on-surface-primary)] text-white text-[length:var(--typeface-paragraph-text-s)] font-medium leading-normal hover:bg-[var(--foundation-blue-blue-7)] transition-colors disabled:opacity-50 min-h-[50px]"
                        >
                            {loading || isRedirecting ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-[length:var(--typeface-paragraph-text-s)] font-light text-[color:var(--on-surface-variant)] mt-8 opacity-60">
                    &copy; {new Date().getFullYear()} Fasana Homes
                </p>
            </div>
        </div>
    );
}
