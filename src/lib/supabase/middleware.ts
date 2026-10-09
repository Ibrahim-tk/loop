import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only run auth checks for routes that actually need them.
    // Public pages (/, /rentals, /services, /about, /contact) skip the
    // Supabase getUser() network call entirely — this was the #1 source of
    // navigation lag because it blocked every single route transition.
    const needsAuth = pathname.startsWith('/admin') || pathname === '/login';
    if (!needsAuth) {
        return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
                    cookiesToSet.forEach(({ name, value }: { name: string; value: string }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) =>
                        supabaseResponse.cookies.set(name, value, {
                            ...options,
                            maxAge: 7 * 24 * 60 * 60, // 7 days
                        })
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        // Verify admin role from profiles table
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }

        // Check Multi-Factor Authentication requirement
        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aalData?.nextLevel === 'aal2' && aalData?.currentLevel !== 'aal2') {
            const url = request.nextUrl.clone();
            url.pathname = '/login/mfa';
            return NextResponse.redirect(url);
        }
    }

    // Redirect logged-in users away from login page
    if (pathname === '/login' && user) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
