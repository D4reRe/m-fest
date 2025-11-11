export const documents: {
  id: number;
  type: "identityCard" | "twibbon" | "followIg" | "pDDikti";
  title: string;
  submissionDetail: string;
  acceptedFiles: string[];
  uploadThingRoute: string;
}[] = [
  {
    id: 0,
    type: "identityCard",
    title: "Identity Card",
    submissionDetail:
      "Every participant must upload identity card scan file either KTM/KTP/KK/SIM or Student Card",
    acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
    uploadThingRoute: "identityCard",
  },
  {
    id: 1,
    type: "twibbon",
    title: "Twibbon",
    submissionDetail: ` Twibbon is uploaded to the Instagram account of each team participant in the form of an Instagram post by tagging the official M-FEST 2026 account @mfestitb. Instagram accounts must not be in private mode. Participants may not delete Instagram posts until the competition series is finished. Captions on Instagram posts follow the template format. 
      `,
    acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
    uploadThingRoute: "twibbon",
  },
  {
    id: 2,
    type: "followIg",
    title: "Follow Ig",
    submissionDetail:
      "Participants are required to have an Instagram account and must follow social media @mfestitb and upload proof on the registration form provided.",
    acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
    uploadThingRoute: "followIg",
  },
  {
    id: 3,
    type: "pDDikti",
    title: "PDDikti",
    submissionDetail:
      "Participants are required to take a screenshot of their data as an active college student in PDDikti and upload it on the registration form provided for IPPC, BCC, and PDC competitions.",
    acceptedFiles: [".png", ".jpeg", ".jpg", ".webp"],
    uploadThingRoute: "pDDikti",
  },
];
