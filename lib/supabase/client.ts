import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Browser-side Supabase client (Client Components only). Reads the public
// publishable key — safe to expose, RLS is what actually gates access.
//
// flowType: "implicit" — this app has no OAuth/magic-link sign-in, so the
// only place a Supabase auth *link* ever matters is password recovery. The
// default PKCE flow requires the reset link to be opened in the same
// browser that requested it (it needs a locally-stored secret), which fails
// for the completely normal case of requesting on desktop and opening the
// email on a phone. Implicit flow embeds everything the link needs in the
// URL itself, so it works across devices.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { flowType: "implicit" } },
  );
}
