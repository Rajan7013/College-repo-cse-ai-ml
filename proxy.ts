import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/admin(.*)',
    '/search(.*)',      // Protect search page
    '/library(.*)',     // Protect library page (if exists)
    '/resources(.*)',   // Protect resource viewing
    '/viewer(.*)',      // Protect PDF viewer
    '/projects(.*)',    // Protect projects page
    '/profile(.*)',     // Protect profile page
    '/settings(.*)',    // Protect settings page
]);

export default clerkMiddleware(async (auth, req) => {
    // Protect dashboard and admin routes
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
