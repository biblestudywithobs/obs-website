import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

// Server-side Supabase client (Server Components, Route Handlers, Server
// Actions) — carries the caller's session via cookies, so RLS evaluates
// against the real signed-in user. Used by Phase E's auth + role guards.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      // Must match the browser client (lib/supabase/client.ts) — this is the
      // client that actually issues the password-reset email via
      // resetPasswordForEmail(), so its flowType decides whether the link
      // Supabase sends is a same-device-only PKCE code or a portable
      // implicit-flow token. See the comment there for why implicit.
      auth: { flowType: "implicit" },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render — middleware refreshes
            // the session cookie instead, so this can be safely ignored.
          }
        },
      },
    },
  );
}
