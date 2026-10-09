'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { authLimiter } from '@/lib/rate-limit';

export async function signIn(formData: FormData) {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    authLimiter.check(ip);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    // Check if user has MFA setup
    const { data: { user } } = await supabase.auth.getUser();
    const enrolledFactors = signInData.user?.factors?.filter(f => f.status === 'verified') || [];
    
    // If they have MFA, we don't let them into /admin natively yet.
    if (enrolledFactors.length > 0) {
        redirect('/login/mfa');
    }

    redirect('/admin');
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}

export async function getUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// ----------------------------------------------------
// MFA (Two-Factor Auth) Actions
// ----------------------------------------------------

export async function setupMfa() {
    const supabase = await createClient();
    // Start enrollment
    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
    });

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Failed to retrieve setup data');
    
    return {
        id: data.id,
        totpSecret: data.totp.secret,
        qrCode: data.totp.qr_code,
        uri: data.totp.uri,
    };
}

export async function verifyMfaSetup(factorId: string, code: string) {
    const supabase = await createClient();
    
    // Challenge the factor
    const challenge = await supabase.auth.mfa.challenge({ factorId });
    if (challenge.error) throw new Error(challenge.error.message);
    if (!challenge.data) throw new Error('Failed to create challenge');
    
    // Verify the code
    const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code,
    });

    if (verify.error) throw new Error(verify.error.message);
    return true;
}

export async function unenrollMfa(factorId: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) throw new Error(error.message);
    return true;
}

export async function initiateMfaLogin() {
    const supabase = await createClient();
    
    // Get verified factors
    const { data: factorsData, error: listError } = await supabase.auth.mfa.listFactors();
    if (listError) throw new Error(listError.message);
    
    const totpFactors = factorsData?.totp?.filter((f: any) => f.status === 'verified') || [];
    if (totpFactors.length === 0) {
        throw new Error('No verified factors found');
    }

    // Use the first verified TOTP factor
    const factorId = totpFactors[0].id;
    
    // Generate a challenge
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) throw new Error(challengeError.message);
    if (!challenge) throw new Error('Failed to create challenge');

    return { factorId: factorId, challengeId: challenge.id };
}

export async function verifyMfaLogin(factorId: string, challengeId: string, code: string) {
    const supabase = await createClient();
    
    // Verify the challenge
    const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code
    });

    if (error) {
        return { error: error.message };
    }
    
    // Once verified, the Supabase server client will automatically upgrade the SSR cookies to AAL2!
    redirect('/admin');
}
