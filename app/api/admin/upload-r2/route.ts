import { NextResponse } from "next/server";
import { requireProfile } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";

// Interactive file upload used by the Class Sessions and Resources admin
// editors — lets staff upload audio/PDF files straight from the portal
// instead of using the Cloudflare dashboard. Files are buffered in memory
// before upload (via file.arrayBuffer()), so this is fine for typical
// session recordings and PDFs but isn't the most memory-efficient path for
// very large files (several hundred MB+) — acceptable for now, but a true
// streaming upload would need a raw multipart parser rather than the
// standard FormData API.
export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_BYTES = 300 * 1024 * 1024; // 300MB

export async function POST(request: Request) {
  // Content tier — every staff role can write resources/class_sessions.
  await requireProfile();

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (folder !== "class-sessions" && folder !== "resources") {
    return NextResponse.json({ error: "Invalid upload target." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large — max ${MAX_BYTES / (1024 * 1024)}MB.` },
      { status: 413 },
    );
  }

  const { url, error } = await uploadToR2(file, folder);
  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ url });
}
