import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authEmail = req.cookies.get("auth_email");
  if (!authEmail) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/home"],
};
