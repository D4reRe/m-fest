import { auth } from "@/server/auth/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const protectedPaths = [
    "/dashboard",
    "/dashboard/competitions",
    "/dashboard/competitions/register",
    "/admin",
  ];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/admin/:path*"],
};
