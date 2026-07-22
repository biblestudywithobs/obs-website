import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Privileged client using the service-role key — bypasses RLS entirely.
// Server-only (never import from a Client Component). Reserved for actions
// that must run outside a user's own permissions, e.g. issuing a certificate
// once a course is complete. Guard every call site with its own authorization
// check before using this.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
