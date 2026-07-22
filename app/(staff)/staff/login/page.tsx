import { LoginForm } from "./LoginForm";

export default async function StaffLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirect ?? "/staff";

  return (
    <div className="flex min-h-screen w-full max-[840px]:block">
      <div className="bg-ink relative flex flex-1 flex-col justify-between overflow-hidden p-12 max-[840px]:hidden">
        <div className="flex items-center gap-2.5">
          <span className="bg-gold font-display flex h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-[8px] text-[15px] font-bold">
            O
          </span>
          <span className="font-display text-cream text-[18px] font-semibold">
            OBS Staff Portal
          </span>
        </div>
        <div>
          <p className="font-display text-cream max-w-[22ch] text-[clamp(24px,2.6vw,34px)] leading-[1.3] font-medium italic">
            &ldquo;We help people understand the Scriptures in a simple, clear, and faithful
            way.&rdquo;
          </p>
          <p className="text-cream/60 mt-4 text-[13px]">— OBS Mission Statement</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-10">
        <div className="w-full max-w-[380px]">
          <h1 className="font-display mb-2 text-[28px] font-semibold">Welcome back</h1>
          <p className="text-ink-muted mb-8 text-[14px]">Sign in to your OBS staff account.</p>
          <LoginForm redirectTo={redirectTo} />
          <p className="text-ink-muted mt-[26px] text-center text-[13px]">
            New to the team?{" "}
            <a href="#" className="text-gold-deep font-semibold">
              Request an invite
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
