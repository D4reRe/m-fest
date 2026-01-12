import { type UseFormSetValue } from "react-hook-form";
import { type IconProps, type Icon } from "@tabler/icons-react";
import { type ForwardRefExoticComponent, type RefAttributes } from "react";
import { type LucideProps } from "lucide-react";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}
export enum Gender {
  Male = "Male",
  Female = "Female",
}

export enum Education {
  SMA = "SMA",
  SMK = "SMK",
  D3 = "D3",
  S1 = "S1",
}

export enum CompetitionName {
  PDC = "PDC",
  IPPC = "IPPC",
  BCC = "BCC",
  STEM = "STEM",
}

export enum TeamRole {
  Leader = "Leader",
  Member = "Member",
}

export enum DocumentStatus {
  AWAITING_UPLOAD = "AWAITING_UPLOAD",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
}

export enum VerificationStatus {
  NOT_SUBMITTED = "NOT_SUBMITTED",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}

export enum TeamStatus {
  NOT_REGISTERED = "NOT_REGISTERED",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}

export type DocumentType = "identityCard" | "twibbon" | "followIg";

export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean | null;
  image: string | null;
  imageKey: string | null;

  gender: Gender | null;
  phoneNumber: string | null;
  domicile: string | null;
  institution: string | null;
  major: string | null;
  education: Education | null;
  semester: number | null;
  birthDate: Date | null;
  role: Role;

  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CompRegistration = {
  id: string;
  userId: string;
  leaderUserId: string;
  leaderEmail: string;
  leaderName: string;
  leaderPhoneNumber: string;
  teamInstitution: string;
  teamName: string | null;
  teamId: string | null;
  paymentId: string;
  statusOrder: string | null;
  teamStatus: TeamStatus;
  competitionName: CompetitionName;
  submissionFileUrl: string | null;
  submissionFileKey: string | null;
  submissionFileCreatedAt: Date | null;
  submissionFileUploaded: boolean | null;
  submissionFileSubmitted: boolean | null;
  mentor: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Competition = {
  title: string;
  logo: string;
  desc: string;
  regLink: string;
  abbreviation: CompetitionName;
  cover: string;
  isOpen?: boolean;
  prize: number;
  reg1: string;
  reg2: string;
  fee1: number;
  fee2: number;
  guideBook: string;
  icon: string;
  uploadThingRoute: string;
  submissionDeadline: Date | null;
  compOpenCase: Date | null;
};

export type Team = {
  id: string;
  status: string | null;
  teamStatus: TeamStatus;
  name: string | null;
  leaderUserId: string | null;
  leaderEmail: string | null;
  leaderName: string | null;
  leaderPhoneNumber: string | null;
  teamInstitution: string | null;
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
  verified: boolean | null;
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

export type Documents = {
  id: string;
  userId: string;
  IdentityCardImageUrl: string | null;
  twibbonImageUrl: string | null;
  followIgImageUrl: string | null;
  IdentityCardImageKey: string | null;
  twibbonImageKey: string | null;
  followIgImageKey: string | null;
  IdentityCardCreatedAt: Date | null;
  twibbonCreatedAt: Date | null;
  followIgCreatedAt: Date | null;
  IdentityCardStatus: DocumentStatus | null;
  twibbonStatus: DocumentStatus | null;
  followIgStatus: DocumentStatus | null;
  IdentityCardVerified: boolean | null;
  twibbonVerified: boolean | null;
  followIgVerified: boolean | null;
  status: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type Document = {
  id: number;
  title: string;
  type: DocumentType;
  submissionDetail: string;
  acceptedFiles: string[];
  uploadThingRoute: string;
  imageUrl: string | null;
  imageKey: string | null;
  createdAt: Date | null;
  status: "AWAITING_UPLOAD" | "PENDING" | "VERIFIED" | null;
  verified: boolean | null;
};

export type UploadThingRoute = "identityCard" | "twibbon" | "followIg";
export type UploadDocumentProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  title: string;
  type: UploadThingRoute;
  uploadThingRoute: UploadThingRoute;
  setValue: UseFormSetValue<{
    userId: string;
    identityCard: string;
    twibbon: string;
    followIg: string;
  }>;
  userId: string;
};

export type UploadDialogProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
  updateImgUrl: (imgSrc: string) => void;
  updateImgFile: (file: File) => void;
  updateUploadCroppedFile: (file: File) => void;
  isLoading: boolean;
  isProfilePicture?: boolean;
};

export type ImageCropperProps = {
  title: string;
  updateImgUrl: (imgSrc: string) => void;
  updateImgFile: (file: File) => void;
  updateUploadCroppedFile: (file: File) => void;
  isLoading: boolean;
  isUploading: boolean;
  isProfilePicture?: boolean;
};

export type RegisterFormProps = {
  comp: string;
  userTeams: Team[];
  userRegisteredCompetitions: CompRegistration[];
  allTeamsDatas: Team[];
  allRegisteredTeamDatas: CompRegistration[];
  allTeamMembersDatas: TeamMember[];
  userAsLeaderTeams: Team[];
  teamNames: (string | null)[];
  stemTeamNames: (string | null)[];
};

export type NavMainProps = {
  items: (
    | {
        title: string;
        url: string;
        icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
      }
    | {
        title: string;
        url: string;
        icon: ForwardRefExoticComponent<
          Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
        >;
      }
  )[];
};
