// middleware.ts
import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();

  console.log(session, "Session data"); // Check terminal for this
  console.log("hi"); // This will show in your server logs

  const { pathname } = req.nextUrl;

  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  if (!session && pathname === "/feed") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed", "/login", "/register"],
};
