import type { Metadata } from "next";
import { Suspense } from "react";
import { SessionLibrary } from "@/components/sections/SessionLibrary";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { listPublishedSessions } from "@/lib/queries/public-sessions";

export const metadata: Metadata = {
  title: "Class Sessions — Open Bible School",
  description:
    "Every OBS class, recorded and split into sessions. Search by teaching and filter by series.",
};

export default async function SessionsPage() {
  const { sessions, seriesList } = await listPublishedSessions();

  return (
    <>
      <main className="flex-1">
        {/* Suspense boundary required by useSearchParams (?series deep-links). */}
        <Suspense fallback={null}>
          <SessionLibrary sessions={sessions} seriesList={seriesList} />
        </Suspense>
      </main>
      <MinimalFooter />
    </>
  );
}
