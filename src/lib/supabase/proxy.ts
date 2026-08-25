import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseConfig } from "@/config/supabase";

function redirectWithSession(response: NextResponse, destination: URL) {
  const redirectResponse = NextResponse.redirect(destination);

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = response.headers.get(header);
    if (value) redirectResponse.headers.set(header, value);
  }

  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseConfig();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([name, value]) => {
          supabaseResponse.headers.set(name, value);
        });
      },
    },
  });

  // Supabase recomienda no ejecutar lógica entre la creación del cliente y
  // getClaims(), para evitar sesiones que se refrescan de forma inconsistente.
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (error || !claims?.sub) {
    const loginUrl = new URL("/ingresar", request.url);
    loginUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return redirectWithSession(supabaseResponse, loginUrl);
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", claims.sub)
      .maybeSingle();

    if (
      profileError ||
      !profile ||
      !["admin", "superadmin"].includes(profile.role)
    ) {
      return redirectWithSession(
        supabaseResponse,
        new URL("/dashboard", request.url),
      );
    }
  }

  return supabaseResponse;
}
