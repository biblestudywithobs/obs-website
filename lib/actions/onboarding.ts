"use server";

import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Marks a lesson done for the signed-in user and returns to the dashboard.
// RLS (lesson_progress_own) already restricts this to the caller's own rows
// regardless of what lessonId is passed in.
export async function markLessonComplete(lessonId: string) {
  const profile = await requireProfile();
  const supabase = await createClient();

  await supabase.from("lesson_progress").upsert(
    {
      user_id: profile.id,
      lesson_id: lessonId,
      status: "done",
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );

  redirect("/staff");
}
