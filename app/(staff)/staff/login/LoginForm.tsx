"use client";

import { useActionState } from "react";
import Link from "next/link";
import { StaffButton } from "@/components/staff/StaffButton";
import { signIn, type SignInState } from "@/lib/actions/auth";

const initialState: SignInState = { error: null };

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {state.error && (
        <div className="border-oxblood/30 bg-oxblood/10 text-oxblood mb-[18px] rounded-[10px] border px-3.5 py-3 text-[13px]">
          {state.error}
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
      <div className="mb-[18px]">
        <label htmlFor="password" className="mb-[7px] block text-[12.5px] font-semibold">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          required
          className="border-line bg-paper font-ui focus:border-gold-deep w-full rounded-[10px] border px-3.5 py-3 text-[14px] focus:outline-none"
        />
      </div>
      <div className="mb-[22px] flex items-center justify-between">
        <label className="text-ink-muted flex items-center gap-[7px] text-[13px]">
          <input type="checkbox" /> Remember me
        </label>
        <Link href="/staff/forgot-password" className="text-gold-deep text-[13px] font-semibold">
          Forgot password?
        </Link>
      </div>
      <StaffButton type="submit" disabled={pending} className="mt-1 w-full justify-center">
        {pending ? "Signing in…" : "Sign in"}
      </StaffButton>
    </form>
  );
}
