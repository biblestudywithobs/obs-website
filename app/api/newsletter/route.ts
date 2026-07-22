import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { newsletterSchema } from "@/lib/validation/forms";
import { isRateLimited, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(`newsletter:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
  }

  // Honeypot tripped: pretend success so bots don't learn they were caught.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: parsed.data.email });

  // 23505 = unique_violation — already subscribed, which is a success from
  // the visitor's point of view, not an error.
  if (error && error.code !== "23505") {
    return NextResponse.json({ ok: false, error: "Could not subscribe." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
