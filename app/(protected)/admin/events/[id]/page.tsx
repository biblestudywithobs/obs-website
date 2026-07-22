import { notFound } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BackLink } from "@/components/staff/BackLink";
import { requireRole } from "@/lib/auth";
import { EDITOR_TIER_ROLES } from "@/types/staff";
import { getEventById } from "@/lib/queries/admin-events";
import { EventEditorForm } from "../EventEditorForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireRole(EDITOR_TIER_ROLES);
  const event = await getEventById(id);
  if (!event) notFound();

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center gap-4 border-b px-8 max-[780px]:px-5">
          <BackLink href="/admin/events">Back to events</BackLink>
          <h1 className="font-display truncate text-[19px] font-semibold">{event.title}</h1>
        </div>
        <div className="p-8 max-[780px]:p-5">
          <EventEditorForm event={event} />
        </div>
      </main>
    </div>
  );
}
