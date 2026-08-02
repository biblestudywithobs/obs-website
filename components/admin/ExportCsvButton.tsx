"use client";

import { toCsv } from "@/lib/csv";
import type { ApplicationRow } from "@/components/admin/ApplicationsList";

const HEADERS = [
  "Name",
  "Email",
  "Phone",
  "Area",
  "Role / Team",
  "Gender",
  "Hours per week",
  "State",
  "Country",
  "Location",
  "Church",
  "Part of the workforce",
  "Bible study / prayer life",
  "Read our articles",
  "Message",
  "Applied",
];

// Exports whatever's currently visible (already filtered by area/role on
// the server) as a CSV — opens straight in Google Sheets, Excel, or Numbers
// via File > Import, no Google API credentials or OAuth needed.
export function ExportCsvButton({
  applications,
  areaLabels,
  filename,
}: {
  applications: ApplicationRow[];
  areaLabels: Record<string, string>;
  filename: string;
}) {
  function handleExport() {
    const rows = applications.map((app) => [
      app.name,
      app.email,
      app.phone,
      areaLabels[app.area] ?? app.area,
      app.role_detail,
      app.gender,
      app.hours_per_week,
      app.state,
      app.country,
      app.location,
      app.church,
      app.workforce,
      app.bible_study_rating,
      app.read_articles,
      app.message,
      new Date(app.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    ]);

    const csv = toCsv(HEADERS, rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={applications.length === 0}
      className="border-line hover:border-gold-deep font-ui flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-50"
    >
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 3v10m0 0l-4-4m4 4l4-4M4 16.5h12"
          stroke="#2B2420"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Export CSV
    </button>
  );
}
