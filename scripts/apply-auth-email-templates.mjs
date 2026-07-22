// Pushes branded HTML into Supabase Auth's built-in email templates
// (password reset, email confirmation, invite, email change) via the
// Management API. Supabase renders these server-side with Go-template
// tokens ({{ .ConfirmationURL }} etc.) substituted at send time — this
// script only needs to embed those tokens literally in the HTML.
//
// Run with: node scripts/apply-auth-email-templates.mjs
// Requires SUPABASE_ACCESS_TOKEN + the project ref in .env.local.

import { readFileSync } from "fs";

const envPath = new URL("../.env.local", import.meta.url);
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1)];
    }),
);

const PROJECT_REF = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];

const colors = {
  gold: "#FEBE52",
  goldDeep: "#D89A2E",
  cream: "#F9ECC9",
  paper: "#F4E9D6",
  ink: "#2B2420",
  inkMuted: "#5C4F3E",
  line: "#D9C7A0",
};

function wrap({ heading, bodyHtml, buttonLabel, buttonUrl, footnote }) {
  return `
<div style="background-color:#EFE6D3;padding:32px 16px;">
  <div style="max-width:560px;margin:0 auto;background-color:${colors.paper};border-radius:16px;overflow:hidden;border:1px solid ${colors.line};">
    <div style="background-color:${colors.ink};padding:22px 32px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="width:34px;height:34px;border-radius:8px;background:${colors.gold};text-align:center;vertical-align:middle;font-family:Georgia,serif;font-weight:700;font-size:16px;color:${colors.ink};">O</td>
        <td style="padding-left:10px;font-family:Georgia,serif;font-weight:600;font-size:17px;color:${colors.cream};">Open Bible School</td>
      </tr></table>
    </div>
    <div style="padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <h2 style="font-family:Georgia,serif;font-weight:600;font-size:22px;color:${colors.ink};margin:0 0 16px;">${heading}</h2>
      <div style="font-size:14.5px;line-height:1.6;color:${colors.ink};margin:0 0 20px;">${bodyHtml}</div>
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="border-radius:100px;background-color:${colors.gold};">
          <a href="${buttonUrl}" style="display:inline-block;padding:12px 24px;font-weight:500;font-size:14.5px;color:${colors.ink};text-decoration:none;">${buttonLabel}</a>
        </td>
      </tr></table>
      ${footnote ? `<p style="font-size:13px;color:${colors.inkMuted};margin-top:24px;">${footnote}</p>` : ""}
    </div>
    <hr style="border-color:${colors.line};margin:0;" />
    <div style="padding:20px 32px;">
      <p style="font-size:12px;color:${colors.inkMuted};margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">© ${new Date().getFullYear()} Open Bible School. All rights reserved.</p>
    </div>
  </div>
</div>`.trim();
}

const templates = {
  mailer_templates_recovery_content: wrap({
    heading: "Reset your password",
    bodyHtml:
      "We received a request to reset your password. Follow the link below to choose a new one.",
    buttonLabel: "Reset password",
    buttonUrl: "{{ .ConfirmationURL }}",
    footnote: "If you didn't request this, you can safely ignore this email.",
  }),
  mailer_templates_confirmation_content: wrap({
    heading: "Confirm your email address",
    bodyHtml: "Follow the link below to confirm this email address and finish signing up.",
    buttonLabel: "Confirm email address",
    buttonUrl: "{{ .ConfirmationURL }}",
  }),
  mailer_templates_invite_content: wrap({
    heading: "You've been invited",
    bodyHtml: "You've been invited to join the OBS Staff Portal. Follow the link below to accept.",
    buttonLabel: "Accept invitation",
    buttonUrl: "{{ .ConfirmationURL }}",
  }),
  mailer_templates_email_change_content: wrap({
    heading: "Confirm your new email address",
    bodyHtml: "Follow the link below to confirm {{ .NewEmail }} as your new email address.",
    buttonLabel: "Confirm new email address",
    buttonUrl: "{{ .ConfirmationURL }}",
    footnote: "If you didn't request this change, you can safely ignore this email.",
  }),
};

const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${env.SUPABASE_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(templates),
});

const data = await res.json();
if (!res.ok) {
  console.error("Failed:", data);
  process.exit(1);
}
console.log("Applied branded templates:", Object.keys(templates).join(", "));
