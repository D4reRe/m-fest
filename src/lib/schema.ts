import * as z from "zod";

export const profileSchema = z.object({
  name: z.string().min(5),
  gender: z.enum(["Male", "Female"]),
  phoneNumber: z.string().regex(/^(\+?\d{9,15})$/, "Invalid phone number"),
  domicile: z.string().min(1, "Domicile is required"),
  institution: z.string().min(1, "institution is required"),
  major: z.string().min(1, "Major is required"),
  education: z.enum(["SMA", "SMK", "D3", "S1"]),
  semester: z.coerce
    .number<number>()
    .min(1, "Minimum semester is 1")
    .max(8, "Maximum semester is 8"),
  birthDate: z.coerce.date<Date>(),
  image: z.string(),
});

export type profileSchema = z.infer<typeof profileSchema>;

// all field should be filled of that type image Url
export const documentsSchema = z.object({
  userId: z.string().min(1, "Target User id is required"),
  identityCard: z.string().min(1, "Identity Card photo is required to upload"),
  twibbon: z.string().min(1, "Twibbon photo is required to upload"),
  followIg: z.string().min(1, "Follow IG screenshot proof is required"),
});

export type documentsSchema = z.infer<typeof documentsSchema>;

export const submitFileSchema = z.object({
  fileUrl: z.string().min(1, "File is required"),
  competitionName: z.string().min(1, "Competition name is required"),
  leaderUserId: z.string().min(1, "Leader user id is required"),
});

export type submitFileSchema = z.infer<typeof submitFileSchema>;

export const stemRegisterSchema = z.object({
  name: z.string().min(5),
  gender: z.enum(["Male", "Female"]),
  school: z.string().min(5),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phoneNumber: z.string().regex(/^(\+?\d{9,15})$/, "Invalid phone number"),
  education: z.enum(["SMA", "SMK", "D3", "S1"]),
  mentor: z.string().min(1),
  competitionName: z.enum(["STEM"]),
});

export type stemRegisterSchema = z.infer<typeof stemRegisterSchema>;
