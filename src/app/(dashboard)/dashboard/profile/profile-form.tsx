"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { NumberInput, Input as HeroInput, Progress } from "@heroui/react";
import { educations } from "@/lib/profile";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useUploadThing } from "@/utils/uploadthing";
import { User } from "@prisma/client";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { UserAvatar } from "@/components/general/UserProfile";
import PencilIcon from "@/components/dashboard/profile/PencilIcon";
import ImageCropper from "@/components/dashboard/profile/ImageCropper";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";

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

function ProfileUpdateForm({ user }: { user: User }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Preview cropped image
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  // Upload cropped image
  const [uploadCroppedFile, setUploadCroppedFile] = useState<File | null>(null);

  usePreventRefreshUserDuringUpload(isLoading);
  const { startUpload } = useUploadThing("updateProfilePicture", {
    onBeforeUploadBegin(files) {
      toast.loading(`Presigning URL for profile image...`, {
        id: "presigning-url",
      });
      return files;
    },
    onUploadBegin: (filename: string) => {
      setIsUploading(true);
      toast.dismiss("presigning-url");
      setIsLoading(true);
      toast.info(`Upload has begun for profile image`, {
        description: `Uploading ${filename}`,
      });
    },
    onUploadProgress(p) {
      if (p < 100) {
        setProgress(p);
        toast.loading(`Uploading profile image...`, {
          id: "upload-profile-image",
          description: `${p}%`,
        });
      }
      if (p === 100) {
        setProgress(p);
        toast.loading(`Uploading profile image...`, {
          id: "upload-profile-image",
          description: `Finalizing upload...`,
        });
      }
    },
    onClientUploadComplete: () => {
      setIsUploading(false);
      setIsLoading(false);
      toast.dismiss("upload-profile-image");
      toast.success(`Profile image uploaded successfully!`);
    },
    onUploadError: (e: UploadThingError<Json>) => {
      setIsUploading(false);
      setIsLoading(false);
      toast.dismiss("upload-profile-image");
      toast.error(`Failed to upload profile image`, {
        description: e.message,
      });
    },
    uploadProgressGranularity: "fine",
  });

  function updateImgUrl(imgSrc: string) {
    setCroppedImageUrl(imgSrc);
  }
  function updateImgFile(file: File) {
    setCroppedFile(file);
  }
  function updateUploadCroppedFile(file: File) {
    setUploadCroppedFile(file);
  }

  useEffect(() => {
    const toastType = searchParams.get("notif");
    if (toastType === "incomplete_profile") {
      toast.info(
        "Please complete your profile before registering for a competition."
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
    },
  });
  const router = useRouter();

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
        });
      }, 500);
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
          name: formData.fullName,
          email: session?.user?.email,
        }),
      });

      setIsLoading(false);

      if (res.ok) {
        toast.dismiss("update-profile");
        toast.success("Profile updated");
        setTimeout(() => {
          router.refresh();
          window.location.reload();
        }, 500);
      } else {
        const err = await res.json();
        toast.error("Failed to update profile", {
          description: err.message,
        });
        console.log(err.message);
      }

      // Debugging
      // console.log({
      //   ...formData,
      //   birthDate: formData.birthDate?.toISOString(),
      // });
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
            <div>
              {user.image && (
                <div className="relative mb-5">
                  <UserAvatar
                    src={user.image as string}
                    alt={user.name as string}
                    className="w-32 h-32 border-2 border-primary/50"
                  />
                  <Dialog
                    open={isDialogOpen}
                    onOpenChange={(open: boolean) => {
                      if (isLoading || isUploading) return;
                      setIsDialogOpen(open);
                    }}
                  >
                    <DialogTrigger asChild>
                      <button
                        className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600"
                        title="Change photo"
                        onClick={() => {
                          if (!isLoading) setIsDialogOpen(true);
                          if (isLoading) return;
                        }}
                      >
                        <PencilIcon />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm sm:max-w-xl ">
                      <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                          Make changes to your profile picture here. Click save
                          when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <ImageCropper
                          title="Profile Picture"
                          user={user as User}
                          alt={user.name as string}
                          updateImgUrl={updateImgUrl}
                          updateImgFile={updateImgFile}
                          updateUploadCroppedFile={updateUploadCroppedFile}
                          isLoading={isLoading as boolean}
                          isUploading={isUploading}
                          isProfilePicture={true}
                        />
                        {isLoading && isUploading && (
                          <div>
                            <Progress
                              classNames={{
                                base: "w-full",
                                track: "drop-shadow-md border border-default",
                                // indicator: "bg-linear-to-r from-pink-500 to-yellow-500",
                                indicator: "bg-white",
                                label:
                                  "tracking-wider font-medium text-default-600",
                                value: "text-foreground/60",
                              }}
                              label="Uploading..."
                              radius="sm"
                              showValueLabel={true}
                              size="sm"
                              value={progress as number}
                              isIndeterminate={progress === 100}
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        {!isUploading && (
                          <>
                            <Button
                              className="cursor-pointer mt-2 sm:mt-0 sm:mr-auto"
                              disabled={
                                !croppedImageUrl || isLoading || isUploading
                              }
                              onClick={async () => {
                                // console.log(
                                //   "Preivew Cropped File size (MB): ",
                                //   croppedFile?.size * 0.000001
                                // );
                                // console.log(
                                //   "Upload Cropped File size (MB): ",
                                //   uploadCroppedFile?.size * 0.000001
                                // );
                                // console.log(
                                //   "Preivew Cropped File size (KB): ",
                                //   croppedFile?.size * 0.001
                                // );
                                // console.log(
                                //   "Upload Cropped File size (KB): ",
                                //   uploadCroppedFile?.size * 0.001
                                // );
                                const file = uploadCroppedFile as File;
                                const utfileUrls = await startUpload([file]);
                                if (!utfileUrls) {
                                  setIsLoading(false);
                                  toast.dismiss("presigning-url");
                                  toast.dismiss("update-profile-picture");
                                  return;
                                }
                                setTimeout(() => {
                                  router.refresh();
                                  window.location.reload();
                                }, 500);
                                router.replace("/dashboard/profile");
                              }}
                            >
                              {isLoading ? (
                                <Loader2 className="animate-spin w-4 h-4" />
                              ) : (
                                "Save changes"
                              )}
                            </Button>
                            <DialogClose asChild>
                              <Button
                                variant="outline"
                                disabled={isLoading || isUploading}
                                className="cursor-pointer"
                                onClick={() => {
                                  setCroppedImageUrl("");
                                  setCroppedFile(null);
                                  setUploadCroppedFile(null);
                                  updateImgFile(null as unknown as File);
                                  updateImgUrl("");
                                }}
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                          </>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              {isLoading && isUploading && (
                <Progress
                  classNames={{
                    base: "max-w-md",
                    track: "drop-shadow-md border border-default",
                    // indicator: "bg-linear-to-r from-pink-500 to-yellow-500",
                    indicator: "bg-white",
                    label: "tracking-wider font-medium text-default-600",
                    value: "text-foreground/60",
                  }}
                  // label="Uploading..."
                  radius="sm"
                  // showValueLabel={true}
                  size="sm"
                  value={progress as number}
                  isIndeterminate={progress === 100}
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5">
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="birthDate" className="text-sm">
                Birth Date
              </Label>
            </div>
            <Controller
              name="birthDate"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <div className="flex w-full flex-col md:flex-nowrap gap-4">
                  <HeroInput
                    label="Your Birth Date"
                    placeholder="June 2 2005"
                    {...field}
                    isInvalid={invalid}
                    errorMessage={error?.message}
                    variant="bordered"
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
