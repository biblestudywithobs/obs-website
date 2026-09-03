import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Anonymous, cookie-free Supabase client for public marketing pages.
// lib/supabase/server's createClient() reads cookies() to know who's
// signed in — but touching cookies() forces Next.js to fully server-render
// the whole page on every single request (no static caching, full cold
// Netlify Function invocation each time). Every public query already
// filters status = 'published' explicitly rather than relying on RLS's
// is_staff() bypass, so this client is behaviorally identical for visitors
// and signed-in staff alike, and its absence of cookies() lets these pages
// be statically rendered/ISR'd instead.
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
