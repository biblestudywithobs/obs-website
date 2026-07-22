import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Unit tests only — pure business logic (validation, slug generation,
// duration/dedup matching, email content selection). No React rendering,
// no Supabase/Next.js runtime, so no need for a jsdom/browser environment.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
  },
});
