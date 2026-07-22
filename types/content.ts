// Shared content types. These describe the shapes the UI renders; in Phase D
// the same shapes are produced by Supabase queries, so components never change.

export type Resource = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string; // "Article" | "Series" | "Course" | "Devotional" | "Manual" | ...
  meta: string; // "By OBS Faculty", "6 parts", "30 days"
  feature?: boolean;
};

export type Session = {
  slug: string;
  series: string; // "Hermeneutics", "Soteriology", "Leadership Course"
  duration: string; // "42 min"
  title: string; // "Session 4: Genre & Context"
  teacher: string; // "OBS Faculty", "Ife", "Kareem"
  recordedLabel: string; // "Recorded Jul 9"
  waveform: number[]; // bar heights as percentages
  videoUrl?: string | null;
};

export type LatestItem = {
  title: string;
  meta: string; // "Articles · 6 min read"
  href: string;
  imageUrl?: string | null;
};

export type LibraryResource = {
  category: string; // filter category: "Articles" | "Bible Studies" | "Manuals" | "Devotionals" | "Downloads" | "Substack"
  tag: string; // badge label: "Article" | "Series" | "Manual" | "Download" | "Study" | ...
  title: string;
  excerpt: string;
  meta: string; // "OBS Faculty", "6 parts", "PDF · 2 pages"
  cta: string; // "Read →" | "Download →"
  href: string;
  imageUrl?: string | null;
};

export type ReadingPlan = {
  category: string; // "Beginner" | "Topical" | "Book Study" | "Devotional"
  duration: string; // "7 days"
  title: string;
  excerpt: string;
};
