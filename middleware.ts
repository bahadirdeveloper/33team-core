import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/token";

// Paths that require authentication
const PROTECTED_PATHS = ["/admin", "/projects", "/market", "/hub", "/my-tasks", "/my-areas"];

// Paths that are public
const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/seed", "/api/health"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if path is protected
    const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));

    if (isProtected) {
        const token = request.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Verify token validity
        const payload = await verifyJWT(token);
        if (!payload) {
            // Invalid token
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Force Password Change Check
        // We need to fetch user from DB or add this flag to JWT. 
        // To avoid DB call in middleware (perf), let's add it to JWT during login.
        // Assuming payload has 'mustChangePassword' boolean.

        // HOWEVER, for now, if we didn't add it to JWT yet, we might skip or do a lightweight check?
        // Let's rely on Client-Side check or add to JWT in login route.

        // Actually, let's update login route to include this in token.
        if (payload.mustChangePassword && pathname !== "/change-password") {
            return NextResponse.redirect(new URL("/change-password", request.url));
        }

        // Optional: Check role for /admin
        if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
            // Redirect non-admins trying to access admin
            return NextResponse.redirect(new URL("/", request.url)); // or a 403 page
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
