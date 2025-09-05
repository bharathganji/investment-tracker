import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match only protected routes to optimize performance:
     * - Dashboard and related pages
     * - Portfolio management
     * - Trade entry and history
     * - Analytics and goals
     * - Profile and settings
     * - Admin routes (role-based access control)
     * - Login page (to redirect authenticated users)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/trade-entry/:path*",
    "/trade-history/:path*",
    "/analytics/:path*",
    "/goals/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
  ],
};
