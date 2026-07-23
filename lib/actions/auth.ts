"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAuthRecoveryClient } from "@/lib/supabase/auth-recovery-client";

export type SignInState = { error: string | null };

// Real Supabase email/password sign-in, replacing the prototype's goTo()
// stub. Runs server-side so the session cookie is set via the response
// headers middleware/layouts can read on the very next request.
export async function signIn(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/staff");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  redirect(redirectTo);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/staff/login");
}

export type RequestResetState = { status: "idle" | "sent" | "error" };

// Sends a password-reset email via Supabase Auth. Always reports success
// regardless of whether the email exists — this prevents leaking which
// emails have staff accounts to an unauthenticated caller.
export async function requestPasswordReset(
  _prevState: RequestResetState,
  formData: FormData,
): Promise<RequestResetState> {
  const email = String(formData.get("email") ?? "");
  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol =
    hdrs.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");

  const supabase = createAuthRecoveryClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${protocol}://${host}/staff/reset-password`,
  });

  if (error) {
    return { status: "error" };
  }
  return { status: "sent" };
}
