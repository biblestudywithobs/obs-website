import type { Metadata } from "next";
import { EventsView } from "@/components/sections/EventsView";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { listPublishedEvents, getEventCalendar } from "@/lib/queries/public-events";

// Statically rendered/ISR'd — see app/(marketing)/page.tsx for why. Also
// bounds how stale the upcoming/past split and calendar month can get.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events — Open Bible School",
  description:
    "Leadership courses, Bible study sessions, conferences, and workshops — where OBS teaching happens live.",
};

export default async function EventsPage() {
  const [{ upcoming, past }, calendar] = await Promise.all([
    listPublishedEvents(),
    getEventCalendar(),
  ]);

  return (
    <>
      <main className="flex-1">
        <EventsView upcoming={upcoming} past={past} calendar={calendar} />
      </main>
      <MinimalFooter />
    </>
  );
}
