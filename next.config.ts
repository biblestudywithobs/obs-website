import type { NextConfig } from "next";

// Deliberately NOT output: "standalone" — deploying to Netlify, whose
// Next.js Runtime packages the standard .next build output into its own
// serverless functions and doesn't expect the pruned standalone bundle
// that setting produces. If self-hosting via the Dockerfile ever comes
// back into play, re-add `output: "standalone"` here first — it copies
// from .next/standalone, which only exists with that flag set.
const nextConfig: NextConfig = {};

export default nextConfig;
