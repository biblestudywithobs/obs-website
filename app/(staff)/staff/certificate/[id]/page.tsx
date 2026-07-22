import { notFound } from "next/navigation";
import { PortalHeader } from "@/components/staff/PortalHeader";
import { BackLink } from "@/components/staff/BackLink";
import { StaffButton } from "@/components/staff/StaffButton";
import { requireProfile } from "@/lib/auth";
import { getOrIssueCertificate } from "@/lib/queries/onboarding";

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireProfile();
  // A certificate only exists once the course is actually completed — there
  // is no client-side "preview" of an unearned certificate.
  const cert = await getOrIssueCertificate(profile.id, profile.fullName, id);
  if (!cert) notFound();

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <PortalHeader initials={profile.avatarInitials} />

      <div className="flex flex-1 flex-col items-center px-6 pt-12 pb-[100px]">
        <div className="mb-[26px] flex w-full max-w-[920px] items-center justify-between">
          <BackLink href="/staff">Back to dashboard</BackLink>
        </div>

        <div className="border-gold bg-paper aspect-[1.55/1] w-full max-w-[920px] rounded-[6px] border-2 p-3.5 max-[640px]:aspect-auto">
          <div className="border-gold-deep flex h-full flex-col items-center justify-center rounded-[2px] border px-10 py-10 text-center max-[640px]:px-[26px]">
            <span className="bg-gold font-display mb-3.5 flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-[12px] text-[22px] font-bold">
              O
            </span>
            <span className="text-gold-deep text-[12px] font-bold tracking-[0.18em] uppercase">
              Certificate of Completion
            </span>
            <h1 className="font-display mt-3.5 text-[clamp(26px,3.4vw,38px)] font-semibold">
              Open Bible School
            </h1>
            <p className="font-reading text-ink-muted mt-[18px] text-[14px]">This certifies that</p>
            <span className="border-gold font-display mt-2 inline-block border-b-[1.5px] pb-2 text-[clamp(28px,3.6vw,40px)] font-semibold italic">
              {cert.recipientName}
            </span>
            <p className="font-reading text-ink-muted mt-[22px] max-w-[44ch] text-[14.5px] leading-[1.6]">
              has successfully completed the{" "}
              <b className="text-ink font-semibold">{cert.courseTitle}</b>.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-[60px] max-[640px]:gap-[30px]">
              <div className="text-center">
                <div className="border-ink-muted mb-1.5 w-[150px] border-b" />
                <div className="text-[12.5px] font-semibold">Ife</div>
                <div className="text-ink-muted text-[11px]">Co-Director, OBS</div>
              </div>
              <div className="text-center">
                <div className="border-ink-muted mb-1.5 w-[150px] border-b" />
                <div className="text-[12.5px] font-semibold">Kareem</div>
                <div className="text-ink-muted text-[11px]">Co-Director, OBS</div>
              </div>
            </div>
            <p className="text-ink-muted mt-6 text-[11.5px]">
              Certificate No. {cert.certificateNumber} · Issued{" "}
              {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <StaffButton>Download PDF</StaffButton>
          <StaffButton variant="secondary">Share</StaffButton>
        </div>
      </div>
    </div>
  );
}
