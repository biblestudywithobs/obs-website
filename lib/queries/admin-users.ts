import { createClient } from "@/lib/supabase/server";
import type { StaffRole } from "@/types/staff";

export type StaffMember = {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: string;
};

// RLS (profiles_select) already restricts this to admin-only visibility of
// every row; a non-admin caller would just see their own single row back.
export async function listStaff(): Promise<StaffMember[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, is_active, created_at")
    .order("created_at", { ascending: true });

  return (data ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name,
    email: p.email,
    role: p.role,
    isActive: p.is_active,
    createdAt: p.created_at,
  }));
}
