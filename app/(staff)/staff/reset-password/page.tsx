"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StaffButton } from "@/components/staff/StaffButton";

type Stage = "checking" | "ready" | "invalid" | "saving" | "done" | "error";

// Client-rendered because the recovery session only exists in the browser:
// Supabase's reset-password email link either sets it via a URL hash
// (#access_token=...&type=recovery, auto-detected by the browser client on
// load) or a ?code= param (PKCE, exchanged explicitly below) — a server
// component/middleware request never sees either.
export default function ResetPasswordPage() {
  const [stage, setStage] = useState<Stage>("checking");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function establishSession() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        setStage(error ? "invalid" : "ready");
        return;
      }

      // Implicit flow: the browser client auto-detects the #access_token
      // hash on creation. Give it a tick, then check.
      const { data } = await supabase.auth.getSession();
      setStage(data.session ? "ready" : "invalid");
    }

    establishSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStage("saving");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStage("error");
      return;
    }
    await supabase.auth.signOut();
    setStage("done");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-10">
      <div className="w-full max-w-[380px]">
        <h1 className="font-display mb-2 text-[28px] font-semibold">Set a new password</h1>

        {stage === "checking" && (
          <p className="text-ink-muted text-[14px]">Verifying your reset link…</p>
        )}

        {stage === "invalid" && (
          <>
            <p className="text-ink-muted mb-6 text-[14px]">
              This reset link is invalid or has expired.
            </p>
            <Link
              href="/staff/forgot-password"
              className="text-gold-deep text-[13px] font-semibold"
            >
              Request a new link
            </Link>
          </>
        )}

        {stage === "done" && (
          <>
            <p className="text-ink-muted mb-6 text-[14px]">Your password has been updated.</p>
            <StaffButton href="/staff/login" className="w-full justify-center">
              Continue to sign in
            </StaffButton>
          </>
        )}

        {(stage === "ready" || stage === "saving" || stage === "error") && (
          <form onSubmit={handleSubmit}>
            {stage === "error" && (
              <div className="border-oxblood/30 bg-oxblood/10 text-oxblood mb-[18px] rounded-[10px] border px-3.5 py-3 text-[13px]">
                Couldn&apos;t update your password. Please try again.
              </div>
            )}
            <div className="mb-[22px]">
              <label htmlFor="password" className="mb-[7px] block text-[12.5px] font-semibold">
                New password
              </label>
              <input
                type="password"
                id="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
              />
            </div>
            <StaffButton
              type="submit"
              disabled={stage === "saving"}
              className="w-full justify-center"
            >
              {stage === "saving" ? "Saving…" : "Update password"}
            </StaffButton>
          </form>
        )}
      </div>
    </div>
  );
}
