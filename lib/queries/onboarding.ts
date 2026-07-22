import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ModuleOverview = {
  id: string;
  moduleNumber: number;
  title: string;
  metaLabel: string;
  totalLessons: number;
  doneLessons: number;
  percent: number;
  status: "done" | "active" | "locked";
  firstIncompleteLessonId: string | null;
};

export type OnboardingOverview = {
  courseId: string;
  courseTitle: string;
  modules: ModuleOverview[];
  overallPercent: number;
  remainingModules: number;
  allDone: boolean;
};

const ONBOARDING_COURSE_SLUG = "staff-onboarding";

// Real onboarding state for the dashboard: course modules in order, each
// module's lesson completion, and sequential unlocking (a module only
// becomes "active" once every module before it is fully done — modules with
// no lessons yet are vacuously complete, since there's nothing to finish).
export async function getOnboardingOverview(userId: string): Promise<OnboardingOverview | null> {
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("slug", ONBOARDING_COURSE_SLUG)
    .single();
  if (!course) return null;

  const { data: modules } = await supabase
    .from("course_modules")
    .select("id, module_number, title, meta_label, sort_order")
    .eq("course_id", course.id)
    .order("sort_order");
  if (!modules || modules.length === 0) return null;

  const moduleIds = modules.map((m) => m.id);
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, module_id, sort_order")
    .in("module_id", moduleIds);

  const lessonIds = (lessons ?? []).map((l) => l.id);
  const { data: progressRows } =
    lessonIds.length > 0
      ? await supabase
          .from("lesson_progress")
          .select("lesson_id, status")
          .eq("user_id", userId)
          .in("lesson_id", lessonIds)
      : { data: [] as { lesson_id: string; status: string }[] };

  const doneSet = new Set(
    (progressRows ?? []).filter((p) => p.status === "done").map((p) => p.lesson_id),
  );

  let sequenceLocked = false;
  const moduleOverviews: ModuleOverview[] = modules.map((mod) => {
    const modLessons = (lessons ?? [])
      .filter((l) => l.module_id === mod.id)
      .sort((a, b) => a.sort_order - b.sort_order);
    const total = modLessons.length;
    const doneCount = modLessons.filter((l) => doneSet.has(l.id)).length;
    const isModuleDone = total === 0 || doneCount === total;

    let status: ModuleOverview["status"];
    if (sequenceLocked) status = "locked";
    else if (isModuleDone) status = "done";
    else {
      status = "active";
      sequenceLocked = true;
    }

    const firstIncomplete = modLessons.find((l) => !doneSet.has(l.id)) ?? null;

    return {
      id: mod.id,
      moduleNumber: mod.module_number,
      title: mod.title,
      metaLabel: mod.meta_label,
      totalLessons: total,
      doneLessons: doneCount,
      percent: total === 0 ? 100 : Math.round((doneCount / total) * 100),
      status,
      firstIncompleteLessonId: firstIncomplete?.id ?? null,
    };
  });

  const totalOverall = moduleOverviews.reduce((s, m) => s + m.totalLessons, 0);
  const doneOverall = moduleOverviews.reduce((s, m) => s + m.doneLessons, 0);
  const remainingModules = moduleOverviews.filter((m) => m.status !== "done").length;

  return {
    courseId: course.id,
    courseTitle: course.title,
    modules: moduleOverviews,
    overallPercent: totalOverall === 0 ? 100 : Math.round((doneOverall / totalOverall) * 100),
    remainingModules,
    allDone: remainingModules === 0,
  };
}

export type LessonNavEntry = {
  id: string;
  label: string;
  status: "done" | "current" | "upcoming";
};

export type LessonDetail = {
  id: string;
  title: string;
  lessonNumber: number;
  lessonCount: number;
  moduleNumber: number;
  moduleTitle: string;
  body: { type: string; text: string }[];
  nav: LessonNavEntry[];
  previousLessonId: string | null;
};

export async function getLessonForUser(
  lessonId: string,
  userId: string,
): Promise<LessonDetail | null> {
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, module_id, lesson_number, title, body, sort_order")
    .eq("id", lessonId)
    .single();
  if (!lesson) return null;

  const { data: mod } = await supabase
    .from("course_modules")
    .select("module_number, title")
    .eq("id", lesson.module_id)
    .single();

  const { data: siblings } = await supabase
    .from("lessons")
    .select("id, title, sort_order")
    .eq("module_id", lesson.module_id)
    .order("sort_order");

  const siblingIds = (siblings ?? []).map((l) => l.id);
  const { data: progressRows } =
    siblingIds.length > 0
      ? await supabase
          .from("lesson_progress")
          .select("lesson_id, status")
          .eq("user_id", userId)
          .in("lesson_id", siblingIds)
      : { data: [] as { lesson_id: string; status: string }[] };

  const doneSet = new Set(
    (progressRows ?? []).filter((p) => p.status === "done").map((p) => p.lesson_id),
  );

  const orderedSiblings = siblings ?? [];
  const currentIndex = orderedSiblings.findIndex((l) => l.id === lessonId);

  return {
    id: lesson.id,
    title: lesson.title,
    lessonNumber: lesson.lesson_number,
    lessonCount: orderedSiblings.length,
    moduleNumber: mod?.module_number ?? 0,
    moduleTitle: mod?.title ?? "",
    body: Array.isArray(lesson.body) ? (lesson.body as { type: string; text: string }[]) : [],
    nav: orderedSiblings.map((l) => ({
      id: l.id,
      label: l.title,
      status: l.id === lessonId ? "current" : doneSet.has(l.id) ? "done" : "upcoming",
    })),
    previousLessonId: currentIndex > 0 ? orderedSiblings[currentIndex - 1].id : null,
  };
}

export type CertificateDetail = {
  certificateNumber: string;
  issuedAt: string;
  recipientName: string;
  courseTitle: string;
};

// Returns the certificate if the user has actually completed every lesson in
// the course, issuing it on first eligible visit. Uses the admin (service
// role) client for the insert — RLS deliberately has no client insert policy
// on certificates, so issuance can only happen through this server-side path.
export async function getOrIssueCertificate(
  userId: string,
  recipientName: string,
  courseSlug: string = ONBOARDING_COURSE_SLUG,
): Promise<CertificateDetail | null> {
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("slug", courseSlug)
    .single();
  if (!course) return null;

  const { data: modules } = await supabase
    .from("course_modules")
    .select("id")
    .eq("course_id", course.id);
  const moduleIds = (modules ?? []).map((m) => m.id);

  const { data: lessons } =
    moduleIds.length > 0
      ? await supabase.from("lessons").select("id").in("module_id", moduleIds)
      : { data: [] as { id: string }[] };
  const lessonIds = (lessons ?? []).map((l) => l.id);

  if (lessonIds.length === 0) return null;

  const { data: progressRows } = await supabase
    .from("lesson_progress")
    .select("lesson_id, status")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);

  const doneCount = (progressRows ?? []).filter((p) => p.status === "done").length;
  if (doneCount < lessonIds.length) return null;

  const { data: existing } = await supabase
    .from("certificates")
    .select("certificate_number, issued_at")
    .eq("user_id", userId)
    .eq("course_id", course.id)
    .maybeSingle();

  if (existing) {
    return {
      certificateNumber: existing.certificate_number,
      issuedAt: existing.issued_at,
      recipientName,
      courseTitle: course.title,
    };
  }

  const certificateNumber = `OBS-${courseSlug.toUpperCase()}-${userId.slice(0, 8).toUpperCase()}`;
  const admin = createAdminClient();
  const { data: issued, error } = await admin
    .from("certificates")
    .insert({ user_id: userId, course_id: course.id, certificate_number: certificateNumber })
    .select("certificate_number, issued_at")
    .single();

  if (error || !issued) return null;

  return {
    certificateNumber: issued.certificate_number,
    issuedAt: issued.issued_at,
    recipientName,
    courseTitle: course.title,
  };
}
