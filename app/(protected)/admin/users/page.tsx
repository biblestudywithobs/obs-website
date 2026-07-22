import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireRole } from "@/lib/auth";
import { ADMIN_ONLY_ROLES, staffRoles, staffRoleLabels } from "@/types/staff";
import { listStaff } from "@/lib/queries/admin-users";
import { updateUserRole, revokeUser, reactivateUser } from "@/lib/actions/admin-users";
import { InviteForm } from "./InviteForm";

export default async function UsersPage() {
  const profile = await requireRole(ADMIN_ONLY_ROLES);
  const staff = await listStaff();

  return (
    <div className="flex min-h-screen max-[780px]:flex-col">
      <AdminSidebar
        actualRole={profile.role}
        userName={profile.fullName}
        userInitials={profile.avatarInitials}
      />

      <main className="min-w-0 flex-1">
        <div className="border-line bg-paper sticky top-0 z-10 flex h-[72px] items-center justify-between border-b px-8 max-[780px]:px-5">
          <h1 className="font-display text-[20px] font-semibold">Users</h1>
        </div>

        <div className="max-w-[1000px] p-8 max-[780px]:p-5">
          <div className="mb-7">
            <InviteForm />
          </div>

          <div className="border-line bg-paper rounded-[16px] border">
            {staff.map((member, i) => {
              const updateRole = updateUserRole.bind(null, member.id);
              const revoke = revokeUser.bind(null, member.id);
              const reactivate = reactivateUser.bind(null, member.id);
              return (
                <div
                  key={member.id}
                  className={
                    "flex flex-wrap items-center justify-between gap-3 px-6 py-4" +
                    (i !== staff.length - 1 ? " border-line border-b" : "") +
                    (!member.isActive ? " opacity-60" : "")
                  }
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14.5px] font-semibold">{member.fullName}</span>
                      {!member.isActive && (
                        <span className="border-oxblood/30 bg-oxblood/10 text-oxblood rounded-full border px-2 py-0.5 text-[10.5px] font-bold tracking-[0.04em] uppercase">
                          Revoked
                        </span>
                      )}
                    </div>
                    <div className="text-ink-muted text-[12.5px]">{member.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={updateRole} className="flex items-center gap-2">
                      <select
                        name="role"
                        defaultValue={member.role}
                        disabled={member.id === profile.id}
                        className="border-line bg-paper font-ui rounded-[9px] border px-2.5 py-[9px] text-[13.5px] font-medium disabled:opacity-60"
                      >
                        {staffRoles.map((r) => (
                          <option key={r} value={r}>
                            {staffRoleLabels[r]}
                          </option>
                        ))}
                      </select>
                      {member.id !== profile.id && (
                        <button
                          type="submit"
                          className="border-line text-ink-muted hover:border-gold-deep hover:text-ink rounded-[9px] border px-3 py-[9px] text-[13px] font-semibold transition-colors"
                        >
                          Update
                        </button>
                      )}
                    </form>
                    {member.id !== profile.id && (
                      <form action={member.isActive ? revoke : reactivate}>
                        <button
                          type="submit"
                          className={
                            "rounded-[9px] border px-3 py-[9px] text-[13px] font-semibold transition-colors " +
                            (member.isActive
                              ? "border-oxblood/30 text-oxblood hover:bg-oxblood/10"
                              : "border-line text-ink-muted hover:border-gold-deep hover:text-ink")
                          }
                        >
                          {member.isActive ? "Revoke" : "Reactivate"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
