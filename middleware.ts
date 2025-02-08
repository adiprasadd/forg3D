import { withClerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default withClerkMiddleware((req: NextRequest) => {
  return NextResponse.next();
});

export const config = {
  // Protects all routes, including api/trpc
  // See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your matcher
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!static|.*\\..*|_next|favicon.ico).*)",
    "/"
  ],
};
