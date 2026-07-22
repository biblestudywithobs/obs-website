import { signOut } from "@/lib/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-ink-muted hover:text-ink text-[12.5px] font-semibold transition-colors"
      >
        Sign out
      </button>
    </form>
  );
}
