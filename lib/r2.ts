import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Cloudflare R2 (S3-compatible) — used for admin-portal uploads (class
// session audio, resource PDFs) so staff never have to touch the Cloudflare
// dashboard directly. Separate from lib/storage.ts (Supabase Storage), which
// handles event flyers and inline CMS content images.
function getR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

const BUCKET = "obs-admin-uploads";

export async function uploadToR2(
  file: File,
  folder: "class-sessions" | "resources",
): Promise<{ url: string | null; error: string | null }> {
  const publicBase = process.env.R2_PUBLIC_BASE_URL;
  if (!publicBase) {
    return { url: null, error: "R2_PUBLIC_BASE_URL is not configured." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const client = getR2Client();
    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: bytes,
        ContentType: file.type || undefined,
      }),
    );
    return { url: `${publicBase}/${key}`, error: null };
  } catch (err) {
    return { url: null, error: err instanceof Error ? err.message : "Upload failed." };
  }
}
