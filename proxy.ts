import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    // Create new headers for proxying
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    // Handle protected user routes
    if (pathname === "/dashboard" || pathname === "/profile") {
        const sessionCookie = getSessionCookie(request);

        if (!sessionCookie) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Handle admin routes (except login)
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const sessionCookie = getSessionCookie(request);
        
        // Check if it's an admin session (you may need to verify admin token here)
        if (!sessionCookie) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    // Proxy the request with updated headers
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        "/dashboard",
        "/profile",
        "/admin/:path*",
    ],
};

