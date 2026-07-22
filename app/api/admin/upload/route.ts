import { NextResponse } from "next/server";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { uploadPublicFile } from "@/lib/storage";

// Interactive image upload used by the CMS's rich-text editor (paste, drag,
// or the toolbar's "+ Image" button) — happens mid-edit, before the
// surrounding article form is ever submitted, so it needs its own endpoint
// rather than riding along with saveResource's FormData.
export async function POST(request: Request) {
  // Content tier — every staff role can write resources (see
  // supabase/migrations/0009_staff_role_permissions.sql), so this only needs
  // to confirm an active staff session, not a specific role.
  await requireProfile();

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
  }

  const supabase = await createClient();
  const { url, error } = await uploadPublicFile(supabase, file, "content");
  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ url });
}
