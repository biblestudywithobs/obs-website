import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { StaffRole } from "@/types/staff";

export type CurrentProfile = {
  id: string;
  fullName: string;
  avatarInitials: string;
  role: StaffRole;
};

// Signed-in user + their profile row, or null if not authenticated. Reads
// from the server Supabase client, so this reflects the real session cookie
// — not anything the client could fake.
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_initials, role, is_active")
    .eq("id", user.id)
    .single();

  // A revoked profile is treated as signed out immediately, rather than
  // waiting for their access token to expire and the ban to bite on refresh.
  if (!profile || !profile.is_active) return null;

  return {
    id: profile.id,
    fullName: profile.full_name,
    avatarInitials: profile.avatar_initials || initialsFrom(profile.full_name),
    role: profile.role,
  };
}

function initialsFrom(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Redirects to /staff/login if not signed in. Use at the top of any
// server-rendered staff/admin/cms page or layout that needs a session.
export async function requireProfile(redirectTo = "/staff/login"): Promise<CurrentProfile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect(redirectTo);
  return profile;
}

// Redirects to /staff/login if not signed in, or to /staff if signed in but
// not one of the allowed roles. RLS enforces the real boundary regardless —
// this is the page-level guard so under-privileged users see a clean
// redirect instead of an empty/broken screen.
export async function requireRole(allowed: StaffRole[]): Promise<CurrentProfile> {
  const profile = await requireProfile();
  if (!allowed.includes(profile.role)) redirect("/staff");
  return profile;
}
