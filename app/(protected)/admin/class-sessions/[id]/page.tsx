import { notFound } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BackLink } from "@/components/staff/BackLink";
import { requireProfile } from "@/lib/auth";
import { getClassSessionById } from "@/lib/queries/admin-class-sessions";
import { ClassSessionEditorForm } from "../ClassSessionEditorForm";

export default async function EditClassSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfile();
  const session = await getClassSessionById(id);
  if (!session) notFound();

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center gap-4 border-b px-8 max-[780px]:px-5">
          <BackLink href="/admin/class-sessions">Back to class sessions</BackLink>
          <h1 className="font-display truncate text-[19px] font-semibold">{session.title}</h1>
        </div>
        <div className="p-8 max-[780px]:p-5">
          <ClassSessionEditorForm session={session} />
        </div>
      </main>
    </div>
  );
}
