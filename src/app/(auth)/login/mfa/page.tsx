'use client';

import { useState, useEffect } from 'react';
import { initiateMfaLogin, verifyMfaLogin } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';

export default function MfaVerificationPage() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [challengeData, setChallengeData] = useState<{factorId: string, challengeId: string} | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // As soon as this page loads, fetch the user's factor and trigger a challenge
        const startChallenge = async () => {
            try {
                const data = await initiateMfaLogin();
                setChallengeData(data);
            } catch (err: any) {
                setError(err.message || 'Failed to start MFA challenge');
            }
        };
        startChallenge();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!challengeData) return;
        
        setIsVerifying(true);
        setError('');

        try {
            const res = await verifyMfaLogin(challengeData.factorId, challengeData.challengeId, code);
            if (res && res.error) {
                setError(res.error);
                setIsVerifying(false);
            } else {
                // verifyMfaLogin will internally redirect to /admin on success
            }
        } catch (err: any) {
            setError(err.message || 'Invalid code. Please try again.');
            setIsVerifying(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
                <h1 className="text-2xl font-bold text-white mb-2 text-center">Two-Factor Authentication</h1>
                <p className="text-zinc-400 text-sm mb-8 text-center">
                    Enter the 6-digit code from your authenticator app to continue.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <input
                        type="text"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="000000"
                        className="bg-zinc-800 border-zinc-700 text-white px-4 py-3 rounded-lg w-full tracking-[1em] text-center text-2xl font-mono mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    
                    <button
                        type="submit"
                        disabled={code.length !== 6 || !challengeData || isVerifying}
                        className="w-full bg-blue-600 disabled:bg-blue-600/50 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        {isVerifying ? 'Verifying...' : 'Verify Code'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => router.push('/login')}
                        className="mt-4 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                    >
                        Cancel and return to login
                    </button>
                </form>
            </div>
        </div>
    );
}
