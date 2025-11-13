import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { UseFormSetValue } from "react-hook-form";

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
enum Gender {
  Male = "Male",
  Female = "Female",
}

enum Education {
  SMA = "SMA",
  SMK = "SMK",
  D3 = "D3",
  S1 = "S1",
}

enum CompetitionName {
  PDC = "PDC",
  IPPC = "PDDC",
  BCC = "BCC",
  STEM = "STEM",
}

enum TeamRole {
  Leader = "Leader",
  Member = "Member",
}

enum DocumentStatus {
  AWAITING_UPLOAD = "AWAITING_UPLOAD",
  UPLOADED = "UPLOADED",
  VERIFIED = "VERIFIED",
}

enum VerificationStatus {
  NOT_SUBMITTED = "NOT_SUBMITTED",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}

export type User = {
  image: string | null;
  name: string | null;
  email: string;
  id: string;
  role: Role;
  emailVerified: Date | null;
  password: string | null;
  imageKey: string | null;
  gender: Gender | null;
  phoneNumber: string | null;
  domicile: string | null;
  institution: string | null;
  major: string | null;
  education: Education | null;
  semester: number | null;
  birthDate: string | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CompRegistration = {
  name: string | null;
  id: string;
  userId: string;
  teamName: string | null;
  teamId: string | null;
  paymentId: string;
  statusOrder: string | null;
  competitionName: CompetitionName;
  gender: Gender | null;
  email: string | null;
  phoneNumber: string | null;
  education: Education | null;
  school: string | null;
  mentor: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Team = {
  id: string;
  status: string | null;
  name: string | null;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  competition: CompetitionName | null;
};

export type TeamMember = {
  name: string | null;
  email: string | null;
  userId: string;
  teamId: string;
  institution: string | null;
  role: TeamRole | null;
  joinDate: Date | null;
};

export type Member = {
  name: string;
  email: string;
  userId: string;
  institution: string;
  role: "Leader" | "Member";
};

export type Invoices = {
  id: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  status: string | null;
  competition: string | null;
  amount: number;
  paymentUrl: string | null;
  referenceDuitku: string | null;
}[];

export type Verification = {
  id: string;
  userId: string;
  userEmail: string;
  IdentityCardImageUrl: string | null;
  twibbonImageUrl: string | null;
  pDDiktiImageUrl: string | null;
  followIgImageUrl: string | null;
  IdentityCardImageKey: string | null;
  twibbonImageKey: string | null;
  pDDiktiImageKey: string | null;
  followIgImageKey: string | null;
  IdentityCardCreatedAt: Date | null;
  twibbonCreatedAt: Date | null;
  pDDiktiCreatedAt: Date | null;
  followIgCreatedAt: Date | null;
  IdentityCardStatus: DocumentStatus | null;
  twibbonStatus: DocumentStatus | null;
  followIgStatus: DocumentStatus | null;
  pDDiktiStatus: DocumentStatus | null;
  IdentityCardVerified: boolean | null;
  twibbonVerified: boolean | null;
  pDDiktiVerified: boolean | null;
  followIgVerified: boolean | null;
  status: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type Documents = {
  id: number;
  title: string;
  type: "identityCard" | "twibbon" | "followIg" | "pDDikti";
  submissionDetail: string;
  acceptedFiles: string[];
  uploadThingRoute: string;
}[];

export type UploadThingRoute =
  | "identityCard"
  | "twibbon"
  | "followIg"
  | "pDDikti";
export type UploadDocumentProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  router: AppRouterInstance;
  id: number;
  title: string;
  user: User;
  type: UploadThingRoute;
  uploadThingRoute: UploadThingRoute;
  setValue: UseFormSetValue<{
    identityCard: string;
    twibbon: string;
    followIg: string;
    pDDikti: string;
  }>;
};

export type UploadDialogProps = {
  user: User;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  router: AppRouterInstance;
};

export type SuccessPageProps = {
  searchParams: Promise<{
    merchantOrderId: string;
    reference: string;
    resultCode: string;
  }>;
};

export type ImageCropperDocumentProps = {
  title: string;
  alt: string;
  updateImgUrl: (imgSrc: string) => void;
  updateImgFile: (file: File) => void;
  updateUploadCroppedFile: (file: File) => void;
  isLoading: boolean;
  isProfilePicture?: boolean;
  user: User;
};

export type ImageCropperProps = {
  title: string;
  alt: string;
  updateImgUrl: (imgSrc: string) => void;
  updateImgFile: (file: File) => void;
  updateUploadCroppedFile: (file: File) => void;
  isLoading: boolean;
  isUploading: boolean;
  isProfilePicture?: boolean;
  user: User;
};

export type RegisterFormProps = {
  comp: string;
  user: User;
  teams: Team[];
  allTeamsDatas: Team[];
  registeredCompetitions: CompRegistration[];
  teamMembers: TeamMember[];
  allRegisteredTeamDatas: CompRegistration[];
  allTeamMembersDatas: TeamMember[];
};
