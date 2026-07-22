// Wraps /admin and /cms. No auth guard yet — Phase E adds a server-side
// session + role check here (redirecting unauthenticated/under-privileged
// requests) backed by Supabase Auth + RLS.
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
