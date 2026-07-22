"use client";

import { useState } from "react";

// Text input + file picker combo used on Class Sessions (audio) and
// Resources (PDF downloads): staff can paste a URL directly, or pick a file
// to upload straight to Cloudflare R2 (via /api/admin/upload-r2), which
// fills the field in automatically once it's done.
export function FileUploadField({
  name,
  folder,
  defaultValue,
  accept,
  label,
  placeholder,
}: {
  name: string;
  folder: "class-sessions" | "resources";
  defaultValue?: string | null;
  accept: string;
  label: string;
  placeholder?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/admin/upload-r2", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setUrl(data.url);
    } catch {
      setError("Upload failed — check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-semibold">{label}</label>
      <div className="flex flex-col gap-2">
        <input
          type="url"
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
        <label className="border-line bg-paper text-ink-muted hover:border-gold-deep hover:text-ink flex w-full cursor-pointer items-center justify-center rounded-[10px] border px-4 py-2.5 text-[13px] font-semibold transition-colors">
          {uploading ? "Uploading…" : "Upload a file"}
          <input
            type="file"
            accept={accept}
            disabled={uploading}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {error && <p className="text-oxblood mt-1.5 text-[12.5px]">{error}</p>}
    </div>
  );
}
