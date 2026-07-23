import { Text } from "@react-email/components";
import { EmailLayout, textStyles } from "./components/EmailLayout";

// Copy provided directly by OBS — preserved verbatim, not paraphrased.
const CONTENT = {
  volunteer: {
    subject: "Thank you for applying to volunteer with OBS",
    paragraphs: [
      "Thank you for taking the time to apply to volunteer with Open Bible School (OBS). We are deeply grateful for your willingness to serve Christ and His Church through this ministry.",
      "At OBS, we are persuaded that faithful ministry is not merely about filling roles—it is about stewarding the gifts God has graciously given His people for the building up of His Church (1 Peter 4:10). Your desire to serve is both a gift and an encouragement to us.",
      "We have successfully received your application and our team will prayerfully review it over the coming days. As we consider each application, we are seeking not only skill and experience, but also hearts that desire to know Christ more deeply and faithfully serve His people.",
      "Should you be selected for the next stage of our volunteer process, we will reach out to you with further details regarding interviews, onboarding, and your potential area of service.",
      "In the meantime, we encourage you to continue pursuing Christ faithfully—in His Word, in prayer, and within your local church community. Whether or not one's service is visible, every act of faithful obedience matters to God.",
      "Thank you once again for considering serving alongside us. We are grateful that the Lord continues to gather people who are passionate about helping others understand the Scriptures in a simple, clear, and faithful way.",
      "May the Lord strengthen, guide, and keep you.",
    ],
  },
  bible_study_partner: {
    subject: "Thank you for applying to the Bible Accountability Partner programme",
    paragraphs: [
      "Thank you for applying to be a part of the Open Bible School Bible Accountability Partner programme. We are truly grateful for your desire to grow in God's Word alongside other believers.",
      "The Christian life was never meant to be lived alone. God has graciously given us His Word, His Spirit, and His people that we might encourage one another to know Christ more deeply and faithfully follow Him. It is our prayer that this programme would become one of the many means through which the Lord strengthens your love for His Word and your delight in Christ.",
      "We have successfully received your application and our team will prayerfully review it. As we consider every application, we seek to thoughtfully pair participants in ways that encourage meaningful fellowship, accountability, and spiritual growth.",
      "Please note that the matching process may take some time as we carefully review responses and prayerfully make pairings. We ask for your patience as we do so.",
      "While you wait, we encourage you not to postpone your pursuit of God. Continue reading the Scriptures, praying faithfully, and serving within your local church community. Spiritual growth does not begin when you are matched with a partner—it begins in faithfully seeking Christ today.",
      "We are grateful that God is gathering a community of believers who desire not only to read His Word, but to treasure it, obey it, and help one another walk faithfully in its light.",
      "May the Lord establish you in His truth and cause His Word to dwell richly in your heart.",
    ],
  },
  community_group: {
    subject: "Thank you for applying to join an OBS Community Group",
    paragraphs: [
      "Thank you for applying to join an Open Bible School Community Group. We are grateful for your desire to gather with other believers to study God's Word, grow in Christ, and faithfully walk together in the life He has called us to.",
      "At OBS, we believe that learning the Scriptures is not merely an intellectual exercise—it is an invitation to know Christ more deeply and to be transformed by His Word in the context of faithful Christian community. God has not called us to grow alone, but to encourage, serve, and build one another up as members of His Church.",
      "We have successfully received your application and our team will prayerfully review it. We are currently considering group placements based on location and availability to help foster meaningful fellowship and fruitful discussions.",
      "Should there be a Community Group available in your area, we will reach out to you with the next steps and any additional information you may need.",
      "As you wait, we encourage you to continue pursuing Christ faithfully through the study of His Word, prayer, and active participation in your local church community. Our prayer is that every Community Group would be a place where believers are equipped to understand the Scriptures in a simple, clear, and faithful way, and are encouraged to live in joyful obedience to Christ.",
      "Thank you once again for your interest in joining us. We look forward to what the Lord will do through His people as we learn, grow, and serve together.",
      "May the Lord establish you in His truth and grant you grace to delight in His Word each day.",
    ],
  },
  partnership: {
    subject: "Thank you for your interest in partnering with OBS",
    paragraphs: [
      "Thank you for reaching out about partnering with Open Bible School (OBS). We are grateful for your desire to stand with us as we help people understand the Scriptures in a simple, clear, and faithful way.",
      "The Lord has used the generosity and partnership of faithful believers throughout history to advance the preaching and teaching of His Word (Philippians 4:15-17), and we do not take your interest in partnering with us lightly.",
      "We have received your inquiry, and a member of our team will be in touch with you personally to discuss how we might partner together — whether through financial support, resource collaboration, or another way the Lord has laid on your heart.",
      "Thank you for considering this step. We pray the Lord would continue to multiply the fruit of every gift and partnership for the sake of His Church.",
      "May the Lord bless you richly for your generosity and willingness to serve alongside us.",
    ],
  },
} as const;

// internship and team reuse the volunteer letter — OBS hasn't written
// dedicated copy for those two yet.
const AREA_TO_CONTENT: Record<string, keyof typeof CONTENT> = {
  volunteer: "volunteer",
  internship: "volunteer",
  team: "volunteer",
  bible_study_partner: "bible_study_partner",
  community_group: "community_group",
  partnership: "partnership",
};

export function communityConfirmationSubject(area: string): string {
  const key = AREA_TO_CONTENT[area] ?? "volunteer";
  return CONTENT[key].subject;
}

export function CommunityApplicationConfirmation({ area }: { area: string }) {
  const key = AREA_TO_CONTENT[area] ?? "volunteer";
  const { subject, paragraphs } = CONTENT[key];

  return (
    <EmailLayout previewText={subject}>
      <Text style={textStyles.body}>Dear Friend,</Text>
      <Text style={textStyles.body}>
        Grace and peace to you in the name of our Lord Jesus Christ.
      </Text>
      {paragraphs.map((p, i) => (
        <Text key={i} style={textStyles.body}>
          {p}
        </Text>
      ))}
      <Text style={{ ...textStyles.body, marginTop: 8, marginBottom: 0 }}>In Christ,</Text>
      <Text style={{ ...textStyles.body, fontWeight: 700, margin: 0 }}>
        The Open Bible School Team
      </Text>
    </EmailLayout>
  );
}

export default CommunityApplicationConfirmation;
