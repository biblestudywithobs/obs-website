import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, InfoBox, textStyles } from "./components/EmailLayout";

export function StaffInvite({
  fullName,
  email,
  password,
  loginUrl,
}: {
  fullName: string;
  email: string;
  password: string;
  loginUrl: string;
}) {
  return (
    <EmailLayout previewText="You've been added to the OBS Staff Portal">
      <Text style={textStyles.label}>Welcome to the team</Text>
      <Text style={textStyles.heading}>Hi {fullName},</Text>
      <Text style={textStyles.body}>
        An account has been created for you on the OBS Staff Portal.
      </Text>

      <InfoBox>
        <Text style={{ ...textStyles.label, margin: "0 0 2px" }}>Email</Text>
        <Text style={{ ...textStyles.body, margin: "0 0 14px" }}>{email}</Text>
        <Text style={{ ...textStyles.label, margin: "0 0 2px" }}>Temporary password</Text>
        <Text style={{ ...textStyles.body, margin: 0, fontFamily: "monospace", fontSize: 15 }}>
          {password}
        </Text>
      </InfoBox>

      <Text style={textStyles.body}>Sign in and change your password as soon as you can.</Text>

      <EmailButton href={loginUrl}>Sign in to the Staff Portal</EmailButton>
    </EmailLayout>
  );
}

export default StaffInvite;
