import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase session cookie on every request (required so server
// components see a valid session), and gates /staff, /admin, /cms behind
// authentication. This is a UX convenience — RLS is the real access boundary
// regardless of what this proxy does or doesn't catch.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const publicAuthPages = ["/staff/login", "/staff/forgot-password", "/staff/reset-password"];
  const isPublicAuthPage = publicAuthPages.includes(pathname);
  const isProtected =
    pathname.startsWith("/staff") || pathname.startsWith("/admin") || pathname.startsWith("/cms");

  if (pathname === "/staff/login" && user) {
    return NextResponse.redirect(new URL("/staff", request.url));
  }

  if (isProtected && !isPublicAuthPage && !user) {
    const loginUrl = new URL("/staff/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/staff/:path*", "/admin/:path*", "/cms/:path*"],
};
