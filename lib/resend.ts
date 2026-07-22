import { Resend } from "resend";

// biblestudywithobs.com is verified with Resend — real delivery to any
// recipient, no more sandbox restriction.
export const EMAIL_FROM = "BibleStudyWithOBS <hello@biblestudywithobs.com>";

// Where staff-facing notifications (contact form, community applications) get
// sent.
export const STAFF_NOTIFICATION_EMAIL = "openbiblehouse@gmail.com";

export function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY!);
}
