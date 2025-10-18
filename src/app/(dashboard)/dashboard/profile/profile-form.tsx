"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { DatePicker, NumberInput, Select, SelectItem } from "@heroui/react";
import { educations } from "@/lib/profile";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phoneNumber: z
    .string()
    .regex(/^(\+?\d{9,15})$/, "Invalid phone number")
    .optional(),
  domicile: z.string().min(1, "Domicile is required"),
  institution: z.string().min(1, "institution is required"),
  education: z.enum(
    ["SMP", "SMA", "SMK", "D3", "S1", "S2", "S3"],
    "Education is required"
  ),
  semester: z.coerce
    .number<number>()
    .min(1, "Minimum semester is 1")
    .max(8, "Maximum semester is 8"),
  birthDate: z.coerce.date<Date>({
    error: (issue) =>
      issue.input === undefined ? "Required field" : "Invalid date",
  }),
});
type profileSchema = z.infer<typeof profileSchema>;

function ProfileUpdateForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<profileSchema>({ resolver: zodResolver(profileSchema) });
  const router = useRouter();

  async function onSubmit(formData: profileSchema) {
    console.log({
      ...formData,
      birthDate: formData.birthDate?.toISOString(),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-2">
          <Label htmlFor="name" className="block text-sm">
            Name
          </Label>
          <Input {...register("name")} placeholder="John Doe" />
          {errors.name && (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="block text-sm">
          Email
        </Label>
        <Input {...register("email")} placeholder="johndoe@gmail.com" />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="phoneNumber" className="text-sm">
            Phone Number
          </Label>
        </div>
        <Input
          {...register("phoneNumber")}
          placeholder="081234567890"
          className="input sz-md variant-mixed"
        />
        {errors.phoneNumber && (
          <p className="text-destructive text-sm">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="domicile" className="text-sm">
            Domicile
          </Label>
        </div>
        <Input
          {...register("domicile")}
          placeholder="Bandung"
          className="input sz-md variant-mixed"
        />
        {errors.domicile && (
          <p className="text-destructive text-sm">{errors.domicile.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="institution" className="text-sm">
            Institution
          </Label>
        </div>
        <Input
          {...register("institution")}
          placeholder="Bandung"
          className="input sz-md variant-mixed"
        />
        {errors.institution && (
          <p className="text-destructive text-sm">
            {errors.institution.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="education" className="text-sm">
            Current Education
          </Label>
        </div>
        <Select
          className="w-full"
          items={educations}
          label="Last Education"
          placeholder="Select an education"
          {...register("education")}
        >
          {(educations) => <SelectItem>{educations.label}</SelectItem>}
        </Select>
        {errors.education && (
          <p className="text-destructive text-sm">{errors.education.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="semester" className="text-sm">
            Current Semester
          </Label>
        </div>
        <Controller
          name="semester"
          control={control}
          render={({ field }) => (
            <NumberInput
              className="w-full"
              label="Semester"
              placeholder="1"
              {...field}
            />
          )}
          rules={{ required: "Semester is required" }}
        />
        {errors.semester && (
          <p className="text-destructive text-sm">{errors.semester.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="birthDate" className="text-sm">
            Birth Date
          </Label>
        </div>
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <DatePicker className="w-full" label="Birth date" {...field} />
          )}
          rules={{ required: "Birth date is required" }}
        />
        {errors.birthDate && (
          <p className="text-destructive text-sm">{errors.birthDate.message}</p>
        )}
      </div>
      <Button
        className={`w-full ${
          isLoading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? (
          <div className="flex gap-2">
            <span>Updating...</span>
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          "Update"
        )}
      </Button>
    </form>
  );
}

export default ProfileUpdateForm;
