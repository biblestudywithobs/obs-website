import type { Metadata } from "next";
import { ResourceLibrary } from "@/components/sections/ResourceLibrary";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { listLibraryResources } from "@/lib/queries/public-resources";

export const metadata: Metadata = {
  title: "Resources — Open Bible School",
  description:
    "Articles, teaching manuals, devotionals, and downloads — everything OBS has taught, organized in one place.",
};

export default async function ResourcesPage() {
  const resources = await listLibraryResources();

  return (
    <>
      <main className="flex-1">
        <ResourceLibrary resources={resources} />
      </main>
      <MinimalFooter />
    </>
  );
}
