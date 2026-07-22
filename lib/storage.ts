import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Uploads a file to the public "uploads" bucket (see
// supabase/migrations/0010_revoke_flyers_body_html.sql) under the given
// folder, returning its public URL. Every write requires an authenticated
// staff session — enforced by the bucket's own RLS policies, not by this
// helper — so this is safe to call from any Server Action already behind a
// requireProfile()/requireRole() guard.
export async function uploadPublicFile(
  supabase: SupabaseClient<Database>,
  file: File,
  folder: "events" | "content",
): Promise<{ url: string | null; error: string | null }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("uploads").upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
