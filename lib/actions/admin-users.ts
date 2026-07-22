"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { render } from "@react-email/render";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, EMAIL_FROM } from "@/lib/resend";
import { ADMIN_ONLY_ROLES, type StaffRole } from "@/types/staff";
import { StaffInvite } from "@/emails/StaffInvite";

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let pw = "";
  for (let i = 0; i < 16; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}

export type InviteState = { status: "idle" | "sent" | "error"; message?: string };

// Creates a real Supabase Auth user immediately (not Supabase's magic-link
// invite flow) with a generated password, sets their chosen role, and emails
// them the login credentials directly — matching "a mail of their username
// and a default password" rather than a click-through invite link.
export async function inviteStaffMember(
  _prevState: InviteState,
  formData: FormData,
): Promise<InviteState> {
  try {
    // Page-level gating isn't enough — Server Actions are independently
    // reachable, so the admin check has to happen here too.
    await requireRole(ADMIN_ONLY_ROLES);

    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const role = String(formData.get("role") ?? "scholar") as StaffRole;

    if (!fullName || !email) {
      return { status: "error", message: "Name and email are required." };
    }

    const password = generateTempPassword();
    const admin = createAdminClient();

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (createError || !created.user) {
      return { status: "error", message: createError?.message ?? "Could not create the account." };
    }

    // Set the chosen role via the authenticated (admin) session so RLS + the
    // prevent_role_self_escalation trigger both apply normally — the trigger
    // allows this because the caller's own role is admin.
    const supabase = await createClient();
    await supabase.from("profiles").update({ role }).eq("id", created.user.id);

    const hdrs = await headers();
    const host = hdrs.get("host");
    const protocol =
      hdrs.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
    const loginUrl = `${protocol}://${host}/staff/login`;

    const html = await render(StaffInvite({ fullName, email, password, loginUrl }));
    const { error: sendError } = await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "You've been added to the OBS Staff Portal",
      html,
    });

    revalidatePath("/admin/users");

    if (sendError) {
      // Account exists either way — surface this so the admin can share the
      // password manually if the email didn't go out.
      return {
        status: "error",
        message: `Account created, but the email failed to send. Temporary password: ${password}`,
      };
    }

    return { status: "sent" };
  } catch (err) {
    console.error("inviteStaffMember failed:", err);
    return { status: "error", message: "Unexpected error — check server logs." };
  }
}

export async function updateUserRole(userId: string, formData: FormData) {
  await requireRole(ADMIN_ONLY_ROLES);
  const role = String(formData.get("role") ?? "") as StaffRole;

  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", userId);

  revalidatePath("/admin/users");
}

// Revoking blocks sign-in at two independent layers: the Supabase Auth ban
// (stops new sessions/token refreshes at the source) and profiles.is_active
// (which current_staff_role()/is_staff() now require — see
// supabase/migrations/0010_revoke_flyers_body_html.sql — so RLS cuts the
// user off immediately even if their existing access token hasn't expired
// yet). Reversible: reactivating undoes both.
export async function revokeUser(userId: string) {
  const caller = await requireRole(ADMIN_ONLY_ROLES);
  if (userId === caller.id) return;

  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(userId, { ban_duration: "876000h" });

  const supabase = await createClient();
  await supabase.from("profiles").update({ is_active: false }).eq("id", userId);

  revalidatePath("/admin/users");
}

export async function reactivateUser(userId: string) {
  await requireRole(ADMIN_ONLY_ROLES);

  const admin = createAdminClient();
  await admin.auth.admin.updateUserById(userId, { ban_duration: "none" });

  const supabase = await createClient();
  await supabase.from("profiles").update({ is_active: true }).eq("id", userId);

  revalidatePath("/admin/users");
}
