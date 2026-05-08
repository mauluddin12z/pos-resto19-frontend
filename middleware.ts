import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  const payload = token ? await verifyToken(token) : null;
  const isLoggedIn = !!payload;

  const role = payload?.role;

  const protectedRoutes = [
    "/beranda",
    "/pesanan",
    "/menu",
    "/kategori",
    "/pengguna",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // NOT LOGGED IN → protected route
  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // LOGGED IN → login page
  if (isLoggedIn && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/beranda", req.url));
  }

  // ROLE PROTECTION
  if (
    isLoggedIn &&
    (pathname.startsWith("/pengguna") || pathname.startsWith("/kategori"))
  ) {
    if (role !== "superadmin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/beranda/:path*",
    "/pesanan/:path*",
    "/menu/:path*",
    "/kategori/:path*",
    "/pengguna/:path*",
  ],
};
