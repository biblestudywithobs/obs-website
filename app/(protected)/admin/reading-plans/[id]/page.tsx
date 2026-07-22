import { notFound } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BackLink } from "@/components/staff/BackLink";
import { requireProfile } from "@/lib/auth";
import { getReadingPlanById } from "@/lib/queries/admin-reading-plans";
import { ReadingPlanEditorForm } from "../ReadingPlanEditorForm";

export default async function EditReadingPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireProfile();
  const plan = await getReadingPlanById(id);
  if (!plan) notFound();

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center gap-4 border-b px-8 max-[780px]:px-5">
          <BackLink href="/admin/reading-plans">Back to reading plans</BackLink>
          <h1 className="font-display truncate text-[19px] font-semibold">{plan.title}</h1>
        </div>
        <div className="p-8 max-[780px]:p-5">
          <ReadingPlanEditorForm plan={plan} />
        </div>
      </main>
    </div>
  );
}
