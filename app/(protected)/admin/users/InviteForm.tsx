"use client";

import { useActionState } from "react";
import { staffRoles, staffRoleLabels } from "@/types/staff";
import { inviteStaffMember, type InviteState } from "@/lib/actions/admin-users";

const initialState: InviteState = { status: "idle" };

export function InviteForm() {
  const [state, formAction, pending] = useActionState(inviteStaffMember, initialState);

  return (
    <div className="border-line bg-paper rounded-[16px] border px-6 py-[22px]">
      <h3 className="font-display mb-4 text-[17px] font-semibold">Invite staff</h3>

      {state.status === "sent" && (
        <div className="border-line bg-cream text-ink mb-4 rounded-[10px] border px-3.5 py-3 text-[13.5px]">
          Invite sent — they&apos;ll receive their login email and a temporary password.
        </div>
      )}
      {state.status === "error" && (
        <div className="border-oxblood/30 bg-oxblood/10 text-oxblood mb-4 rounded-[10px] border px-3.5 py-3 text-[13px]">
          {state.message}
        </div>
      )}

      <form action={formAction} className="grid grid-cols-3 gap-3 max-[900px]:grid-cols-1">
        <input
          type="text"
          name="fullName"
          required
          placeholder="Full name"
          className="border-line bg-cream font-ui focus:border-gold-deep rounded-[10px] border px-3.5 py-2.5 text-[14px] focus:outline-none"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email address"
          className="border-line bg-cream font-ui focus:border-gold-deep rounded-[10px] border px-3.5 py-2.5 text-[14px] focus:outline-none"
        />
        <div className="flex gap-2">
          <select
            name="role"
            defaultValue="scholar"
            className="border-line bg-cream font-ui focus:border-gold-deep flex-1 rounded-[10px] border px-3.5 py-2.5 text-[14px] focus:outline-none"
          >
            {staffRoles.map((r) => (
              <option key={r} value={r}>
                {staffRoleLabels[r]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={pending}
            className="bg-ink text-paper shrink-0 rounded-[10px] px-4 py-2.5 text-[13.5px] font-medium transition-colors hover:bg-black disabled:opacity-60"
          >
            {pending ? "Inviting…" : "Invite"}
          </button>
        </div>
      </form>
    </div>
  );
}
