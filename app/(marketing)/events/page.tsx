import type { Metadata } from "next";
import { EventsView } from "@/components/sections/EventsView";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { listPublishedEvents, getEventCalendar } from "@/lib/queries/public-events";

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
