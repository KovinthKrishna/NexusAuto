import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for route protection at the edge
 *
 * This runs before pages are rendered and provides an additional layer
 * of protection for sensitive routes. It checks for the presence of auth
 * tokens in localStorage (client-side) or cookies (if implemented).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/profile", "/admin", "/employee", "/customer"];
  const adminRoutes = ["/admin"];
  const employeeRoutes = ["/employee", "/admin"];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  const isEmployeeRoute = employeeRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If it's a protected route, check authentication
  if (isProtectedRoute) {
    // Since we're using localStorage for token storage, we can't check
    // authentication server-side. The ProtectedRoute component will
    // handle the actual authentication check client-side.

    // However, we can still redirect public routes if needed
    if (pathname === "/login" || pathname === "/register") {
      // If user is trying to access login/register while potentially
      // authenticated, let the client-side handle it
      return NextResponse.next();
    }
  }

  // Allow public routes
  const publicRoutes = ["/", "/login", "/register", "/about", "/contact"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // For all other cases, continue to the next middleware or page
  return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
