import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Browser-side Supabase client (Client Components only). Reads the public
// publishable key — safe to expose, RLS is what actually gates access.
//
// Password recovery does NOT use this client — @supabase/ssr hardcodes
// flowType: "pkce" here with no way to override it, which breaks the
// cross-device reset-link case. See lib/supabase/auth-recovery-client.ts.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
