export const documents: {
  title: string;
  submissionDetail: string;
  acceptedFiles: string[];
  uploadThingRoute: string;
}[] = [
  {
    title: "Identity Card",
    submissionDetail:
      "Every participant must upload identity card scan file either KTM/KTP/KK/SIM or Student Card",
    acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
    uploadThingRoute: "uploadIdentityCard",
  },
  {
    title: "Twibbon",
    submissionDetail: ` Twibbon is uploaded to the Instagram account of each team participant in the form of an Instagram post by tagging the official M-FEST 2026 account @mfestitb. Instagram accounts must not be in private mode. Participants may not delete Instagram posts until the competition series is finished. Captions on Instagram posts follow the template format. 
      `,
    acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
    uploadThingRoute: "uploadTwibbon",
  },
  {
    title: "Follow Instagram",
    submissionDetail:
      "Participants are required to have an Instagram account and must follow social media @mfestitb and upload proof on the registration form provided.",
    acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
    uploadThingRoute: "uploadFollowIg",
  },
  {
    title: "PDDikti",
    submissionDetail:
      "Participants are required to take a screenshot of their data as an active college student in PDDikti and upload it on the registration form provided for IPPC, BCC, and PDC competitions.",
    acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
    uploadThingRoute: "uploadPDDikti",
  },
];
