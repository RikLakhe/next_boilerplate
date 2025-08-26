import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is a protected route (not starting with /auth/)
  const isAuthPath = pathname.startsWith("/auth");
  const isApiAuthPath = pathname.startsWith("/api/auth/");

  // If it's an auth route, no need to check for authentication
  if (isAuthPath || isApiAuthPath) {
    return NextResponse.next();
  }

  // For all other routes, check if the user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-me",
  });

  // If the user is not authenticated, redirect to login
  if (!token) {
    const url = new URL("/auth", request.url);
    // Add the current path as callback URL to redirect after login
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // If the user is authenticated, allow access to protected routes
  return NextResponse.next();
}

// Configure which paths should be processed by the middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
