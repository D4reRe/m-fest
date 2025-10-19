"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DateInput, NumberInput, Select, SelectItem } from "@heroui/react";
import { educations } from "@/lib/profile";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { CalendarDate } from "@internationalized/date";
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().regex(/^(\+?\d{9,15})$/, "Invalid phone number"),
  domicile: z.string().min(1, "Domicile is required"),
  institution: z.string().min(1, "institution is required"),
  major: z.string().min(1, "Major is required"),
  education: z.enum(["SMP", "SMA", "SMK", "D3", "S1"], "Education is required"),
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
  const { data: session, update } = useSession();
  console.log(session?.user.birthDate, typeof session?.user.birthDate);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<profileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "John Doe",
      phoneNumber: "081234567890",
      domicile: "Bandung",
      institution: "Institut Teknologi Bandung",
      major: "Mechanical Engineering",
      education: "S1",
      semester: 1,
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session?.user?.name as string,
        phoneNumber: session?.user?.phoneNumber || "081234567890",
        domicile: session?.user?.domicile || "Bandung",
        institution: session?.user?.institution || "Institut Teknologi Bandung",
        major: session?.user?.major || "Mechanical Engineering",
        education: session?.user?.education || "S1",
        semester: (session?.user?.semester as unknown as number) || 1,
      });
    }
  }, [session, reset]);

  async function onSubmit(formData: profileSchema) {
    setIsLoading(true);
    toast.loading("Updating profile...", {
      id: "update-profile",
    });
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          birthDate: formData.birthDate?.toISOString(),
          email: session?.user?.email,
        }),
      });

      await update({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        domicile: formData.domicile,
        institution: formData.institution,
        major: formData.major,
        education: formData.education,
        semester: formData.semester,
        birthDate: formData.birthDate?.toISOString(),
      });

      setIsLoading(false);

      if (res.ok) {
        toast.dismiss("update-profile");
        toast.success("Profile updated");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error("Failed to update profile", {
          description: err.message,
        });
        console.log(err.message);
      }

      console.log({
        ...formData,
        birthDate: formData.birthDate?.toISOString(),
      });
    } catch (error) {
      setIsLoading(false);
      toast.dismiss("update-profile");
      toast.error("Failed to update profile", {
        description: (error as Error).message,
      });
    }
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
        <Input disabled placeholder={session?.user?.email as string} />
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
          <Label htmlFor="major" className="text-sm">
            Major
          </Label>
        </div>
        <Input
          {...register("major")}
          placeholder="Bandung"
          className="input sz-md variant-mixed"
        />
        {errors.major && (
          <p className="text-destructive text-sm">{errors.major.message}</p>
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
          label="Education"
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
              minValue={1}
              maxValue={8}
            />
          )}
          rules={{ required: true }}
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
          render={({
            field: { name, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <div className="flex w-full flex-col md:flex-nowrap gap-4">
              <DateInput
                className="w-full"
                label={"Birth date"}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                ref={ref}
                isRequired
                isInvalid={invalid}
                granularity="day"
                errorMessage={error?.message}
                defaultValue={
                  session?.user.birthDate
                    ? new CalendarDate(
                        new Date(session?.user.birthDate).getFullYear(),
                        new Date(session?.user.birthDate).getMonth() + 1,
                        new Date(session?.user.birthDate).getDate()
                      )
                    : undefined
                }
              />
            </div>
          )}
          rules={{ required: true }}
        />
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
