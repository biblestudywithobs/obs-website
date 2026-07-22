import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validation/forms";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";
import { getResendClient, EMAIL_FROM, STAFF_NOTIFICATION_EMAIL } from "@/lib/resend";
import { ContactNotification } from "@/emails/ContactNotification";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`contact:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please fill in every field." }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, message } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({ name, email, message });

  if (error) {
    return NextResponse.json({ ok: false, error: "Could not send your message." }, { status: 500 });
  }

  // Best-effort: the message is already saved, so a notification failure
  // shouldn't turn into a user-facing error.
  const siteUrl = new URL(request.url).origin;
  const html = await render(ContactNotification({ name, email, message, siteUrl }));
  const { error: sendError } = await getResendClient().emails.send({
    from: EMAIL_FROM,
    to: STAFF_NOTIFICATION_EMAIL,
    subject: `New contact message from ${name}`,
    html,
  });
  if (sendError) {
    console.error("contact notification email failed:", sendError);
  }

  return NextResponse.json({ ok: true });
}
