import { UseFormSetValue } from "react-hook-form";
import { IconProps, type Icon } from "@tabler/icons-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
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
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
}

enum VerificationStatus {
  NOT_SUBMITTED = "NOT_SUBMITTED",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
}

export type DocumentType = "identityCard" | "twibbon" | "followIg";

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
  birthDate: Date | null;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CompRegistration = {
  name: string | null;
  id: string;
  userId: string;
  leaderUserId: string;
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
  submissionFileUrl: string | null;
  submissionFileKey: string | null;
  submissionFileCreatedAt: Date | null;
  submissionFileUploaded: boolean | null;
  submissionFileSubmitted: boolean | null;
};

export type Team = {
  id: string;
  status: string | null;
  name: string | null;
  leaderUserId: string | null;
  leaderEmail: string | null;
  leaderName: string | null;
  leaderPhoneNumber: string | null;
  teamInstitution: string | null;
  institution: string | null;
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

export type Verification = {
  id: string;
  userId: string;
  userEmail: string;
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

export type Documents = {
  [K in DocumentType]: Document;
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
    identityCard: string;
    twibbon: string;
    followIg: string;
  }>;
};

export type UploadDialogProps = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ResultTransaction = {
  resultCode: string;
  merchantOrderId: string;
  reference: string;
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
  teams: Team[];
  allTeamsDatas: Team[];
  registeredCompetitions: CompRegistration[];
  teamMembers: TeamMember[];
  allRegisteredTeamDatas: CompRegistration[];
  allTeamMembersDatas: TeamMember[];
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
