"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createAuthRecoveryClient } from "@/lib/supabase/auth-recovery-client";
import { StaffButton } from "@/components/staff/StaffButton";

type Stage = "checking" | "ready" | "invalid" | "saving" | "done" | "error";

// Client-rendered because the recovery session only exists in the browser:
// the reset email's link carries an #access_token=...&type=recovery hash,
// auto-detected by this client on creation (a server component/middleware
// request never sees a URL hash at all — it's not sent to the server).
// Uses the same non-SSR recovery client as requestPasswordReset — see
// lib/supabase/auth-recovery-client.ts for why the normal @supabase/ssr
// client can't be used here. One instance for the whole page (not
// recreated per handler) so there's no doubt it's the same session.
export default function ResetPasswordPage() {
  const [stage, setStage] = useState<Stage>("checking");
  const [password, setPassword] = useState("");
  const supabaseRef = useRef(createAuthRecoveryClient());

  useEffect(() => {
    async function establishSession() {
      // Give the client's own hash auto-detection (triggered on creation)
      // a chance to finish — getSession() internally awaits that.
      const { data } = await supabaseRef.current.auth.getSession();
      setStage(data.session ? "ready" : "invalid");
    }

    establishSession();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStage("saving");
    const { error } = await supabaseRef.current.auth.updateUser({ password });
    if (error) {
      setStage("error");
      return;
    }
    await supabaseRef.current.auth.signOut();
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
