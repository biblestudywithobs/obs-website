import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { createClient } from "@/lib/supabase/server";
import { communitySchema } from "@/lib/validation/forms";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";
import { getResendClient, EMAIL_FROM, STAFF_NOTIFICATION_EMAIL } from "@/lib/resend";
import { CommunityApplicationNotification } from "@/emails/CommunityApplicationNotification";
import {
  CommunityApplicationConfirmation,
  communityConfirmationSubject,
} from "@/emails/CommunityApplicationConfirmation";

const areaLabels: Record<string, string> = {
  volunteer: "Volunteer Opportunities",
  bible_study_partner: "Bible Study Partners",
  internship: "Internships",
  community_group: "Community Groups",
  team: "Join the OBS Team",
  partnership: "Partnerships",
};

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`community:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = communitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please fill in every field." }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const {
    name,
    email,
    phone,
    area,
    roleDetail,
    location,
    gender,
    hoursPerWeek,
    state,
    country,
    church,
    workforce,
    bibleStudyRating,
    readArticles,
    message,
  } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("community_applications").insert({
    name,
    email,
    phone,
    area,
    role_detail: roleDetail || null,
    location: location || null,
    gender: gender || null,
    hours_per_week: hoursPerWeek || null,
    state: state || null,
    country: country || null,
    church: church || null,
    workforce: workforce || null,
    bible_study_rating: bibleStudyRating || null,
    read_articles: readArticles || null,
    message: message || null,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Could not submit your application." },
      { status: 500 },
    );
  }

  const applicantLocation = [state, country].filter(Boolean).join(", ");
  const detailLine = [
    roleDetail,
    location,
    gender,
    hoursPerWeek,
    applicantLocation,
    church && `Church: ${church}`,
    workforce && `Workforce: ${workforce}`,
    bibleStudyRating && `Bible study/prayer life: ${bibleStudyRating}`,
    readArticles && `Read our articles: ${readArticles}`,
  ]
    .filter(Boolean)
    .join(" · ");
  const siteUrl = new URL(request.url).origin;
  const resend = getResendClient();

  const staffHtml = await render(
    CommunityApplicationNotification({
      name,
      email,
      phone,
      area,
      detail: detailLine || undefined,
      message: message || undefined,
      siteUrl,
    }),
  );
  const applicantHtml = await render(CommunityApplicationConfirmation({ area }));

  const [staffResult, applicantResult] = await Promise.all([
    resend.emails.send({
      from: EMAIL_FROM,
      to: STAFF_NOTIFICATION_EMAIL,
      subject: `New application from ${name}: ${areaLabels[area] ?? area}`,
      html: staffHtml,
    }),
    resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: communityConfirmationSubject(area),
      html: applicantHtml,
    }),
  ]);

  if (staffResult.error) {
    console.error("community application notification email failed:", staffResult.error);
  }
  if (applicantResult.error) {
    console.error("community application confirmation email failed:", applicantResult.error);
  }

  return NextResponse.json({ ok: true });
}
