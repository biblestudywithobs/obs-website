import { Body, Container, Head, Hr, Html, Preview, Section, Text } from "@react-email/components";

// Design tokens, copied verbatim from app/globals.css — email clients can't
// read CSS custom properties, so these are the same hex values inlined.
export const colors = {
  gold: "#FEBE52",
  goldDeep: "#D89A2E",
  cream: "#F9ECC9",
  paper: "#F4E9D6",
  ink: "#2B2420",
  inkMuted: "#5C4F3E",
  line: "#D9C7A0",
};

// Fraunces/Lora don't render in most email clients even via @font-face, so
// these fall back to close web-safe equivalents (serif for display type,
// system sans for UI text) rather than silently rendering as Times/Arial.
export const displayFont = '"Fraunces", Georgia, "Times New Roman", serif';
export const uiFont = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

function Brandmark() {
  return (
    <table role="presentation" cellPadding={0} cellSpacing={0}>
      <tr>
        <td
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: colors.gold,
            textAlign: "center",
            verticalAlign: "middle",
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 16,
            color: colors.ink,
          }}
        >
          O
        </td>
        <td
          style={{
            paddingLeft: 10,
            fontFamily: displayFont,
            fontWeight: 600,
            fontSize: 17,
            color: colors.cream,
          }}
        >
          Open Bible School
        </td>
      </tr>
    </table>
  );
}

export function EmailLayout({
  previewText,
  children,
}: {
  previewText: string;
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: "#EFE6D3", margin: 0, padding: "32px 16px" }}>
        <Container
          style={{
            maxWidth: 560,
            margin: "0 auto",
            backgroundColor: colors.paper,
            borderRadius: 16,
            overflow: "hidden",
            border: `1px solid ${colors.line}`,
          }}
        >
          <Section style={{ backgroundColor: colors.ink, padding: "22px 32px" }}>
            <Brandmark />
          </Section>

          <Section style={{ padding: "32px" }}>{children}</Section>

          <Hr style={{ borderColor: colors.line, margin: 0 }} />
          <Section style={{ padding: "20px 32px" }}>
            <Text
              style={{
                fontFamily: uiFont,
                fontSize: 12,
                color: colors.inkMuted,
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} Open Bible School. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const textStyles = {
  heading: {
    fontFamily: displayFont,
    fontWeight: 600,
    fontSize: 22,
    color: colors.ink,
    margin: "0 0 16px",
  },
  body: {
    fontFamily: uiFont,
    fontSize: 14.5,
    lineHeight: "1.6",
    color: colors.ink,
    margin: "0 0 12px",
  },
  muted: {
    fontFamily: uiFont,
    fontSize: 13,
    color: colors.inkMuted,
    margin: "0 0 4px",
  },
  label: {
    fontFamily: uiFont,
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: colors.goldDeep,
    margin: "0 0 4px",
  },
};

export function EmailButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <table role="presentation" cellPadding={0} cellSpacing={0} style={{ marginTop: 8 }}>
      <tr>
        <td
          style={{
            borderRadius: 100,
            backgroundColor: colors.gold,
          }}
        >
          <a
            href={href}
            style={{
              display: "inline-block",
              padding: "12px 24px",
              fontFamily: uiFont,
              fontWeight: 500,
              fontSize: 14.5,
              color: colors.ink,
              textDecoration: "none",
            }}
          >
            {children}
          </a>
        </td>
      </tr>
    </table>
  );
}

export function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <Section
      style={{
        backgroundColor: colors.cream,
        border: `1px solid ${colors.line}`,
        borderRadius: 12,
        padding: "16px 18px",
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      {children}
    </Section>
  );
}
