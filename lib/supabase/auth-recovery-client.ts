import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// A plain (non-SSR) Supabase client, used only for the password-recovery
// flow (requestPasswordReset action + the reset-password page). @supabase/ssr's
// createServerClient/createBrowserClient hardcode flowType: "pkce" with no
// way to override it — which (a) requires the reset link to be opened in
// the same browser/session that requested it, since a secret has to survive
// via cookies until the link is clicked, and (b) actively throws
// "Not a valid PKCE flow url" if it ever sees an implicit-flow hash instead.
// A plain client with flowType: "implicit" sidesteps both: the recovery
// email embeds everything the link needs directly in the URL, so there's no
// stored secret and no same-device requirement.
export function createAuthRecoveryClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { flowType: "implicit" } },
  );
}
