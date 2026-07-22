import { Text } from "@react-email/components";
import { EmailLayout, EmailButton, InfoBox, textStyles } from "./components/EmailLayout";

const areaLabels: Record<string, string> = {
  volunteer: "Volunteer Opportunities",
  bible_study_partner: "Bible Study Partners",
  internship: "Internships",
  community_group: "Community Groups",
  team: "Join the OBS Team",
};

export function CommunityApplicationNotification({
  name,
  email,
  phone,
  area,
  detail,
  message,
  siteUrl,
}: {
  name: string;
  email: string;
  phone: string;
  area: string;
  detail?: string;
  message?: string;
  siteUrl: string;
}) {
  const areaLabel = areaLabels[area] ?? area;

  return (
    <EmailLayout previewText={`New application from ${name}: ${areaLabel}`}>
      <Text style={textStyles.label}>New application</Text>
      <Text style={textStyles.heading}>
        {name} applied for {areaLabel}
      </Text>

      <InfoBox>
        <Text style={{ ...textStyles.body, margin: "0 0 6px" }}>
          <b>Email:</b> {email}
        </Text>
        <Text style={{ ...textStyles.body, margin: "0 0 6px" }}>
          <b>Phone:</b> {phone}
        </Text>
        {detail && (
          <Text style={{ ...textStyles.body, margin: 0 }}>
            <b>Details:</b> {detail}
          </Text>
        )}
      </InfoBox>

      {message && <Text style={textStyles.body}>{message}</Text>}

      <EmailButton href={`${siteUrl}/admin/applications?area=${area}`}>
        Review in Applications
      </EmailButton>

      <Text style={{ ...textStyles.muted, marginTop: 24 }}>
        Submitted via the {areaLabel} application form at {siteUrl}
      </Text>
    </EmailLayout>
  );
}

export default CommunityApplicationNotification;
