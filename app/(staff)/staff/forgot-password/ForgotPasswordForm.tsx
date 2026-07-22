"use client";

import { useActionState } from "react";
import { StaffButton } from "@/components/staff/StaffButton";
import { requestPasswordReset, type RequestResetState } from "@/lib/actions/auth";

const initialState: RequestResetState = { status: "idle" };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state.status === "sent") {
    return (
      <div className="border-line bg-cream text-ink rounded-[10px] border px-3.5 py-3 text-[13.5px]">
        If an account exists for that email, a password reset link is on its way. Check your inbox
        (and spam folder).
      </div>
    );
  }

  return (
    <form action={formAction}>
      {state.status === "error" && (
        <div className="border-oxblood/30 bg-oxblood/10 text-oxblood mb-[18px] rounded-[10px] border px-3.5 py-3 text-[13px]">
          Something went wrong sending the reset email. Please try again.
        </div>
      )}
      <div className="mb-[18px]">
        <label htmlFor="email" className="mb-[7px] block text-[12.5px] font-semibold">
          Email address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@biblestudywithobs.com"
          required
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>
      <StaffButton type="submit" disabled={pending} className="w-full justify-center">
        {pending ? "Sending…" : "Send reset link"}
      </StaffButton>
    </form>
  );
}
