import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BackLink } from "@/components/staff/BackLink";
import { requireProfile } from "@/lib/auth";
import { ClassSessionEditorForm } from "../ClassSessionEditorForm";

export default async function NewClassSessionPage() {
  const profile = await requireProfile();

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
          <h1 className="font-display text-[19px] font-semibold">New class session</h1>
        </div>
        <div className="p-8 max-[780px]:p-5">
          <ClassSessionEditorForm session={null} />
        </div>
      </main>
    </div>
  );
}
