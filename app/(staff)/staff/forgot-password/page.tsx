import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-10">
      <div className="w-full max-w-[380px]">
        <h1 className="font-display mb-2 text-[28px] font-semibold">Reset your password</h1>
        <p className="text-ink-muted mb-8 text-[14px]">
          Enter the email on your OBS staff account and we&apos;ll send a link to reset your
          password.
        </p>
        <ForgotPasswordForm />
        <p className="text-ink-muted mt-[26px] text-center text-[13px]">
          <Link href="/staff/login" className="text-gold-deep font-semibold">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
