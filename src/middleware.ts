import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: [
        // Only run on admin, login, API routes, and auth callbacks — not public pages
        '/admin/:path*',
        '/login',
        '/api/:path*',
        '/auth/:path*',
    ],
};
