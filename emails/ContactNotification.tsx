import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, InfoBox, textStyles } from "./components/EmailLayout";

export function ContactNotification({
  name,
  email,
  message,
  siteUrl,
}: {
  name: string;
  email: string;
  message: string;
  siteUrl: string;
}) {
  return (
    <EmailLayout previewText={`New contact message from ${name}`}>
      <Text style={textStyles.label}>New contact message</Text>
      <Text style={textStyles.heading}>{name} wrote in</Text>

      <InfoBox>
        <Text style={{ ...textStyles.body, margin: 0 }}>
          <b>{name}</b> ({email})
        </Text>
      </InfoBox>

      <Text style={textStyles.body}>{message}</Text>

      <EmailButton href={`mailto:${email}`}>Reply to {name}</EmailButton>

      <Text style={{ ...textStyles.muted, marginTop: 24 }}>
        Sent from the contact form at {siteUrl}
      </Text>
    </EmailLayout>
  );
}

export default ContactNotification;
