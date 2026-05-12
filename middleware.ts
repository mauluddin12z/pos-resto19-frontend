import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    return payload;
  } catch {
    return null;
  }
}

const PROTECTED_ROUTES = [
  "/beranda",
  "/pesanan",
  "/menu",
  "/kategori",
  "/pengguna",
];

const ADMIN_ROUTES = ["/kategori", "/pengguna"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;

  const payload = token ? await verifyToken(token) : null;

  const isLoggedIn = Boolean(payload);
  const role = payload?.role as string | undefined;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/beranda", req.url));
  }

  if (isLoggedIn && isAdminRoute && role !== "superadmin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
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
