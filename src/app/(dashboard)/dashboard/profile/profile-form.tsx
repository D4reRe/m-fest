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
import { UploadButton } from "@/utils/uploadthing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { User } from "@prisma/client";

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
  // ktm: z.url().optional(),
  // pDDikti: z.url().optional(),
  // followIg: z.url().optional(),
  // twibbon: z.url().optional(),
  birthDate: z.coerce.date<Date>({
    error: (issue) =>
      issue.input === undefined ? "Required field" : "Invalid date",
  }),
});

type profileSchema = z.infer<typeof profileSchema>;

function ProfileUpdateForm({ user }: { user: User }) {
  const { data: session, update } = useSession();
  console.log(session);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
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
        name: user?.name as string,
        phoneNumber: user?.phoneNumber || "081234567890",
        domicile: user?.domicile || "Bandung",
        institution: user?.institution || "Institut Teknologi Bandung",
        major: user?.major || "Mechanical Engineering",
        education: user?.education || "S1",
        semester: (user?.semester as unknown as number) || 1,
      });
    }
  }, [session?.user, reset, user]);

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
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <section>
        <div className="mt-12 mb-12">
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="">
              {user.image ? (
                <Image
                  src={user.image as string}
                  alt={user.name as string}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
              ) : (
                <>
                  <Avatar className="w-24 h-24 border-2 border-primary/50">
                    <AvatarImage
                      src={user.image as string}
                      alt={user.name as string}
                    />
                    <AvatarFallback className="animate-pulse"></AvatarFallback>
                  </Avatar>
                </>
              )}
            </div>
            <div>
              <UploadButton
                className="ut-button:bg-transparent ut-button:hover:bg-white/25 transition-all "
                endpoint={"updateProfilePicture"}
                onUploadBegin={() => {
                  toast.loading("Waiting to upload...", {
                    id: "uploading-wait",
                  });
                }}
                onUploadProgress={() => {
                  toast.dismiss("uploading-wait");
                  toast.loading("Uploading image...", {
                    id: "uploading-image",
                  });
                }}
                onClientUploadComplete={async (res) => {
                  console.log(res);
                  toast.dismiss("uploading-image");
                  setTimeout(() => {
                    router.refresh();
                    window.location.reload();
                  }, 500);
                  toast.success("Image uploaded");
                  router.replace("/dashboard/profile");
                }}
                onUploadError={(error: Error) => {
                  toast.error("Failed to upload image", {
                    description: error.message,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-5">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <Label htmlFor="name" className="block text-sm">
                Name
              </Label>
              <Input {...register("name")} placeholder="John Doe" />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
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
              <p className="text-destructive text-sm">
                {errors.domicile.message}
              </p>
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
              className="w-full "
              items={educations}
              label="Education"
              placeholder="Select an education"
              variant="bordered"
              {...register("education")}
            >
              {(educations) => <SelectItem>{educations.label}</SelectItem>}
            </Select>
            {errors.education && (
              <p className="text-destructive text-sm">
                {errors.education.message}
              </p>
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
                  variant="bordered"
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
              <p className="text-destructive text-sm">
                {errors.semester.message}
              </p>
            )}
          </div>
          {/* <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ktm" className="text-sm">
                Student Card (KTM or Kartu Pelajar)
              </Label>
            </div>
            <Input type="url" {...register("ktm")} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pDDikti" className="text-sm">
                PDDikti
              </Label>
            </div>
            <Input type="url" {...register("pDDikti")} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="twibbon" className="text-sm">
                Twibbon
              </Label>
            </div>
            <Input type="url" {...register("twibbon")} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="followIg  " className="text-sm">
                Follow IG
              </Label>
            </div>
            <Input type="url" {...register("followIg")} />
          </div> */}
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
                    variant="bordered"
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
                      user.birthDate
                        ? new CalendarDate(
                            new Date(user.birthDate).getFullYear(),
                            new Date(user.birthDate).getMonth() + 1,
                            new Date(user.birthDate).getDate()
                          )
                        : undefined
                    }
                  />
                </div>
              )}
              rules={{ required: true }}
            />
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <Button
            className={`w-full max-w-lg mt-12 border text-white bg-white/10 hover:bg-white/25 ${
              isLoading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <div className="flex gap-2">
                <span>Updating...</span>
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </section>
    </form>
  );
}

export default ProfileUpdateForm;
