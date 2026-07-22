import { SignOutButton } from "./SignOutButton";

// Slim top bar shared by every staff-portal screen after login: brandmark on
// the left, real signed-in user's avatar + sign-out on the right.
export function PortalHeader({ initials }: { initials: string }) {
  return (
    <div className="border-line flex h-[72px] shrink-0 items-center justify-between border-b px-8">
      <div className="flex items-center gap-2.5">
        <span className="bg-gold font-display flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-[7px] text-[13px] font-bold">
          O
        </span>
        <span className="font-display text-[16px] font-semibold">OBS Staff Portal</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="bg-gold font-display flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold">
          {initials}
        </span>
        <SignOutButton />
      </div>
    </div>
  );
}
