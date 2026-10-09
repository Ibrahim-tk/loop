import { NextResponse } from 'next/server';
import { runBuildiumSync } from '@/lib/buildium/sync';
import { requireAdmin } from '@/lib/supabase/server';

export async function POST() {
    try {
        await requireAdmin();
        const result = await runBuildiumSync();
        return NextResponse.json(result);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown sync error';
        const isAuthError = message.toLowerCase().includes('auth') || message.toLowerCase().includes('admin');

        return NextResponse.json(
            {
                ok: false,
                error: message,
            },
            { status: isAuthError ? 401 : 500 }
        );
    }
}