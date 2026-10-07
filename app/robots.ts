import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Keep search engines on the public site; dashboards, auth, APIs and draft
// previews stay out of the index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/cms", "/staff", "/api/", "/style-guide", "/reading-plans/preview/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
