"use client";

import { useState } from "react";

export type ApplicationRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  area: string;
  role_detail: string | null;
  location: string | null;
  gender: string | null;
  hours_per_week: string | null;
  state: string | null;
  country: string | null;
  church: string | null;
  workforce: string | null;
  bible_study_rating: string | null;
  read_articles: string | null;
  message: string | null;
  created_at: string;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

// Applicant card list — elevated and clickable, opening a full-detail modal
// rather than cramming every field onto the card itself (the admin's own
// feedback: the old single "role · location · gender · hours · …" line was
// too dense to actually read at a glance).
export function ApplicationsList({
  applications,
  areaLabels,
}: {
  applications: ApplicationRow[];
  areaLabels: Record<string, string>;
}) {
  const [selected, setSelected] = useState<ApplicationRow | null>(null);

  return (
    <>
      <div className="flex flex-col gap-4">
        {applications.map((app) => (
          <div
            key={app.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(app)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(app);
              }
            }}
            className="border-line bg-paper shadow-card-hover hover:border-gold-deep cursor-pointer rounded-[16px] border px-6 py-5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-[2px] hover:shadow-[0_26px_48px_-16px_rgba(26,26,26,0.32)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-[16.5px] font-semibold">{app.name}</h3>
                {app.role_detail && (
                  <p className="text-gold-deep mt-1 text-[13px] font-semibold">{app.role_detail}</p>
                )}
              </div>
              <span className="bg-cream text-gold-deep shrink-0 rounded-full px-[11px] py-[5px] text-[11px] font-bold tracking-[0.04em] uppercase">
                {areaLabels[app.area] ?? app.area}
              </span>
            </div>
            <div className="text-ink-muted mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px]">
              <span>{app.email}</span>
              <span>{formatDate(app.created_at)}</span>
              <span className="text-gold-deep ml-auto font-semibold">View full details →</span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <ApplicationDetailModal
          app={selected}
          areaLabel={areaLabels[selected.area] ?? selected.area}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-ink-muted text-[11.5px] font-bold tracking-[0.05em] uppercase">
        {label}
      </div>
      <div className="mt-1 text-[14.5px] font-medium">{value}</div>
    </div>
  );
}

function ApplicationDetailModal({
  app,
  areaLabel,
  onClose,
}: {
  app: ApplicationRow;
  areaLabel: string;
  onClose: () => void;
}) {
  const applyingFrom = [app.state, app.country].filter(Boolean).join(", ");

  return (
    <div
      className="fixed inset-0 z-[400] flex items-start justify-center overflow-y-auto bg-[rgba(26,26,26,0.55)] p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-paper border-line my-8 w-full max-w-[600px] rounded-[18px] border"
      >
        <div className="border-line flex items-start justify-between gap-4 border-b px-7 py-6">
          <div>
            <span className="bg-cream text-gold-deep mb-2 inline-block rounded-full px-[11px] py-[5px] text-[11px] font-bold tracking-[0.04em] uppercase">
              {areaLabel}
            </span>
            <h2 className="font-display text-[22px] font-semibold">{app.name}</h2>
            <p className="text-ink-muted mt-1 text-[13px]">Applied {formatDate(app.created_at)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="border-line hover:border-gold-deep flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M1 1L15 15M15 1L1 15" stroke="#2B2420" strokeWidth="1.6" />
            </svg>
          </button>
        </div>

        <div className="px-7 py-6">
          <div className="mb-6 grid grid-cols-2 gap-x-5 gap-y-4">
            <DetailField label="Email" value={app.email} />
            <DetailField label="Phone" value={app.phone} />
          </div>

          <div className="border-line mb-6 grid grid-cols-2 gap-x-5 gap-y-4 border-t pt-6">
            <DetailField label="Role / Team" value={app.role_detail} />
            <DetailField label="Gender" value={app.gender} />
            <DetailField label="Hours per week" value={app.hours_per_week} />
            <DetailField label="Applying from" value={applyingFrom} />
            <DetailField label="Location" value={app.location} />
            <DetailField label="Church" value={app.church} />
            <DetailField label="Part of the workforce" value={app.workforce} />
            <DetailField label="Bible study / prayer life" value={app.bible_study_rating} />
            <DetailField label="Read our articles" value={app.read_articles} />
          </div>

          {app.message && (
            <div className="border-line border-t pt-6">
              <div className="text-ink-muted mb-2 text-[11.5px] font-bold tracking-[0.05em] uppercase">
                Message
              </div>
              <p className="font-reading text-[14.5px] leading-[1.7]">{app.message}</p>
            </div>
          )}

          <div className="mt-7 flex gap-3">
            <a
              href={`mailto:${app.email}`}
              className="bg-gold text-ink hover:bg-gold-deep rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition-colors"
            >
              Email applicant
            </a>
            {app.phone && (
              <a
                href={`tel:${app.phone}`}
                className="border-line hover:border-gold-deep rounded-full border px-5 py-2.5 text-[13.5px] font-semibold transition-colors"
              >
                Call {app.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
