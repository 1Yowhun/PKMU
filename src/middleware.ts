import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "spbe-auth-cookies";

// Rute publik yang bebas diakses tanpa login
const publicPaths = ["/auth/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const hasSession = Boolean(sessionCookie && sessionCookie.trim() !== "");

  // 1. Jika mengakses root path "/" dan belum ada sesi, langsung kembalikan ke login
  if (pathname === "/") {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    // Jika ada token, biarkan page.tsx memvalidasi keaslian sesi di database
    return NextResponse.next();
  }

  // 2. Cek apakah rute saat ini adalah rute publik
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  // 3. Ketika pengguna belum ada login atau sesi, kembalikan ke login (bukan ke summary)
  if (!hasSession && !isPublic) {
    // Jika request ke API, kembalikan respon 401 Unauthorized
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Jika request ke halaman aplikasi, alihkan langsung ke halaman login
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, and public static assets (.svg, .png, .jpg, .woff, dll)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
};
