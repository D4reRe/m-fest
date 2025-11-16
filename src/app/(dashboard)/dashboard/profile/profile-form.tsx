"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { educations } from "@/lib/profile";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { UserAvatar } from "@/components/general/UserProfile";
import UploadDialog from "@/components/dashboard/profile/UploadDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn, fetchUser } from "@/lib/utils";
import ProfileFormSkeleton from "@/components/dashboard/profile/ProfileFormSkeleton";

const profileSchema = z.object({
  fullName: z.string().min(5),
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
  birthDate: z.string().min(5, "Birth date is required"),
  imageUrl: z.string(),
});

type profileSchema = z.infer<typeof profileSchema>;

function usePreventRefreshUserDuringUpload(isLoading: boolean) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isLoading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isLoading]);
}

function ProfileUpdateForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: async (data: profileSchema) => {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update profile");
      }

      return res.json();
    },
    onMutate: () => {
      setIsLoading(true);
      toast.loading("Updating profile...", {
        id: "update-profile",
      });
    },
    onSuccess: () => {
      setIsLoading(false);
      toast.dismiss("update-profile");
      toast.success("Profile updated");
      setIsEditing(false);
    },
    onError: (error: Error) => {
      setIsLoading(false);
      toast.dismiss("update-profile");
      toast.error("Failed to update profile", {
        description: (error as Error).message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.replace("/dashboard/profile");
      router.refresh();
    },
  });

  usePreventRefreshUserDuringUpload(isLoading);

  useEffect(() => {
    const toastType = searchParams.get("notif");
    if (toastType === "incomplete_profile") {
      toast.info(
        "Please complete your profile first before uploading documents & register to any competitions."
      );
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<profileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      gender: undefined,
      phoneNumber: "",
      domicile: "",
      institution: "",
      major: "",
      education: undefined,
      semester: 1,
      birthDate: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      setTimeout(() => {
        reset({
          fullName: user?.name as string,
          phoneNumber: user?.phoneNumber ?? "",
          gender: user?.gender ?? undefined,
          domicile: user?.domicile ?? "",
          institution: user?.institution ?? "",
          major: user?.major ?? "",
          education: user?.education ?? undefined,
          semester: (user?.semester as unknown as number) ?? 1,
          birthDate: user?.birthDate ?? "",
          imageUrl: user?.image ?? "",
        });
      }, 500);
    }
  }, [session?.user, reset, user]);

  if (isLoadingUser) return <ProfileFormSkeleton />;

  async function onSubmit(formData: profileSchema) {
    const data = {
      ...formData,
      name: formData.fullName,
      email: session?.user?.email,
    };

    updateUserMutation.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section>
        <div className="mt-12 mb-12">
          <div className="flex flex-col items-center justify-center gap-5">
            <div>
              {user?.image && (
                <div className="relative mb-5">
                  <UserAvatar
                    src={user.image as string}
                    alt={user.name as string}
                    className="w-32 h-32 border-2 border-primary/50"
                  />
                  <div className={cn("", !isEditing ? "hidden" : "")}>
                    <UploadDialog
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer"
                onClick={() => setIsEditing((prev) => !prev)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5">
          <div className="space-y-2 hidden">
            <Controller
              name="imageUrl"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Image Url</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled
                    readOnly
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <Controller
                name="fullName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Fullname</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      disabled={!isEditing}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Controller
              name="gender"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-language">
                      Gender
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!isEditing}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="block text-sm">
              Email
            </Label>
            <Input disabled placeholder={session?.user?.email as string} />
          </div>
          <div className="space-y-2">
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={!isEditing}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="domicile"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Domicile</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={!isEditing}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="institution"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Institution/School
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={!isEditing}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="major"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Major</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={!isEditing}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="education"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-language">
                      Current Education
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!isEditing}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      aria-invalid={fieldState.invalid}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {educations.map((education) => (
                        <SelectItem key={education.key} value={education.key}>
                          {education.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>
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
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur, name, ref } }) => (
                <Input
                  className="w-full"
                  placeholder="1"
                  value={value}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    const regex = /^(|[1-8])$/;
                    if (regex.test(newValue)) {
                      onChange(newValue);
                    }
                  }}
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                  disabled={!isEditing}
                />
              )}
            />
            {errors.semester && (
              <p className="text-destructive text-sm">
                {errors.semester.message}
              </p>
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
              render={({ field, fieldState: { error } }) => (
                <div className="flex w-full flex-col md:flex-nowrap gap-4">
                  <Input
                    placeholder="June 2 2005"
                    {...field}
                    disabled={!isEditing}
                  />
                </div>
              )}
              rules={{ required: true }}
            />
            {errors.birthDate && (
              <p className="text-destructive text-sm">
                {errors.birthDate.message}
              </p>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <Button
            className={`w-full max-w-lg mt-12 border text-white bg-white/10 hover:bg-white/25 ${
              isLoading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={isSubmitting || !isEditing}
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
