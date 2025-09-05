import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/auth/confirm", "/unauthorized"];

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      (route.endsWith("/:path*") &&
        request.nextUrl.pathname.startsWith(route.replace("/:path*", ""))),
  );

  // Check if user is trying to access the login page
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Check if the route is an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  // For public routes (excluding login page), we only need to update the session cookies
  if (isPublicRoute && !isAdminRoute && !isLoginPage) {
    const response = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // Refresh session to ensure cookies are up to date
    await supabase.auth.getUser();

    return response;
  }

  // Special handling for login page
  if (isLoginPage) {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options: _options }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // Check if user is already authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If user is authenticated, redirect to homepage
    if (user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";

      const redirectResponse = NextResponse.redirect(redirectUrl);

      // Copy cookies from supabaseResponse to maintain session consistency
      for (const cookie of supabaseResponse.cookies.getAll()) {
        redirectResponse.cookies.set(cookie);
      }

      return redirectResponse;
    }

    // If user is not authenticated, allow access to login page
    return supabaseResponse;
  }

  // For protected routes, we need to validate authentication
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options: _options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Get user and session data
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Handle authentication errors
  if (error) {
    console.error("Authentication error:", error);
  }

  // Redirect unauthenticated users to login
  if (!user) {
    console.log("Middleware: User not authenticated, redirecting to login");
    // Create a redirect response without page flickering
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);

    const redirectResponse = NextResponse.redirect(redirectUrl);

    // Copy cookies from supabaseResponse to maintain session consistency
    for (const cookie of supabaseResponse.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }

    return redirectResponse;
  }

  // For authenticated users, return the response with updated cookies
  return supabaseResponse;
}
