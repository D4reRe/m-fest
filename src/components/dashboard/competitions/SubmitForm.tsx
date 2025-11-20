"use client";
import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, fetchUser, fetchUserRegisteredComp } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useUploadThing } from "@/utils/uploadthing";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";
import { useDropzone } from "@uploadthing/react";
import { validSubmissionExtensions } from "@/constants/constants";
import { competitions } from "@/lib/competition";
import { Loader2, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { SubmitFormSkeleton } from "./SubmitFormSkeleton";
import { ConfettiButton } from "@/components/ui/confetti";

const submitFileSchema = z.object({
  fileUrl: z.string().min(1, "File is required"),
});

type submitFileSchema = z.infer<typeof submitFileSchema>;

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

export default function SubmitForm({ comp }: { comp: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const uploadThingRoute = competitions.find(
    (competition) => competition.abbreviation === comp.toUpperCase()
  )?.uploadThingRoute;
  const queryClient = useQueryClient();
  const router = useRouter();
  usePreventRefreshUserDuringUpload(isLoading);
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  const { data: userRegisteredComp, isLoading: isLoadingUserRegisteredComp } =
    useQuery({
      queryKey: ["userRegisteredComp", comp],
      queryFn: async () => await fetchUserRegisteredComp({ comp }),
    });
  const {
    register,
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm<submitFileSchema>({
    resolver: zodResolver(submitFileSchema),
    defaultValues: {
      fileUrl: userRegisteredComp?.submissionFileUrl ?? "",
    },
  });

  useEffect(() => {
    if (userRegisteredComp) {
      reset({
        fileUrl: userRegisteredComp?.submissionFileUrl ?? "",
      });
    }
  }, [userRegisteredComp, reset]);

  const submitFile = useMutation({
    mutationFn: async (data: submitFileSchema) => {
      const res = await fetch("/api/submit-file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          comp,
          userId: user?.id,
          leaderUserId: user?.id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit file");
      }

      return res.json();
    },
    onMutate: () => {
      setIsLoading(true);
      toast.loading("Submitting file...", {
        id: "submitting-file",
      });
    },
    onSuccess: () => {
      setIsLoading(false);
      toast.dismiss("submitting-file");
      toast.success("File submitted successfully!");
    },
    onError: (error: Error) => {
      setIsLoading(false);
      toast.dismiss("submitting-file");
      toast.error("Failed to submit file", {
        description: (error as Error).message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["userRegisteredComp", comp] });
      router.refresh();
    },
  });

  async function onSubmit(formData: submitFileSchema) {
    submitFile.mutate(formData);
  }
  //   @ts-expect-error uploadThingRoute is exist
  const { startUpload } = useUploadThing(uploadThingRoute, {
    onBeforeUploadBegin(files) {
      toast.loading(`Presigning URL for file...`, {
        id: "presigning-url",
      });
      return files;
    },
    onUploadBegin: (filename: string) => {
      toast.dismiss("presigning-url");
      setIsUploading(true);
      setIsLoading(true);
      toast.info(`Upload has begun for the file`, {
        description: `Uploading ${filename}`,
      });
    },
    onUploadProgress(p) {
      if (p === 0) {
        setProgress(p);
        toast.loading(`Uploading file...`, {
          id: "upload-document",
          description: `Starting upload...`,
        });
      }
      if (p < 100) {
        setProgress(p);
        toast.loading(`Uploading file...`, {
          id: "upload-document",
          description: `${p}%`,
        });
      }
      if (p === 100) {
        setProgress(p);
        toast.loading(`Uploading file...`, {
          id: "upload-document",
          description: `Finalizing upload...`,
        });
      }
    },
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setIsLoading(false);
      toast.dismiss("upload-document");
      toast.success(`File uploaded successfully!`);
      setValue("fileUrl", res[0].ufsUrl, {
        shouldValidate: true,
      });
      queryClient.invalidateQueries({ queryKey: ["userDocuments"] });
      setFiles([]);
    },
    onUploadError: (e: UploadThingError<Json>) => {
      setIsUploading(false);
      setIsLoading(false);
      toast.dismiss("upload-document");
      toast.error(`Failed to upload file`, {
        description: e.message,
      });
    },
    uploadProgressGranularity: "fine",
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      toast.error("Only one file is allowed");
      return;
    }
    if (
      !acceptedFiles[0].type.startsWith("application/pdf") &&
      !acceptedFiles[0].type.startsWith("application/zip")
    ) {
      toast.error("Only zip or pdf files are allowed");
      return;
    }
    if (
      !validSubmissionExtensions.includes(
        acceptedFiles[0].type.split("/").pop()?.toLowerCase() as string
      )
    ) {
      toast.error("Supported types: .pdf, .zip");
      return;
    }
    if (acceptedFiles[0].size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB");
      return;
    }
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  if (isLoadingUserRegisteredComp) return <SubmitFormSkeleton />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-xl font-semibold mb-3">Your Work</h3>
      <div className=" font-semibold mb-3">
        {userRegisteredComp?.submissionFileSubmitted ? (
          <p className="text-green-500">Submitted</p>
        ) : (
          <p className="text-muted-foreground">Not Sumbitted</p>
        )}
      </div>

      <div className="max-w-sm">
        <div {...getRootProps()}>
          <input
            {...getInputProps()}
            disabled={userRegisteredComp?.submissionFileSubmitted as boolean}
          />
          <div
            className={cn(
              "w-full h-50 rounded-lg bg-slate-700/45 flex justify-center items-center cursor-pointer",
              {
                "bg-slate-700/45": !userRegisteredComp?.submissionFileSubmitted,
                "bg-slate-700/20": userRegisteredComp?.submissionFileSubmitted,
                "cursor-not-allowed":
                  userRegisteredComp?.submissionFileSubmitted,
              }
            )}
          >
            <div className="flex flex-col items-center p-4">
              <Upload
                className={cn("w-6 h-6", {
                  "text-muted-foreground":
                    userRegisteredComp?.submissionFileSubmitted,
                })}
              />
              <h1
                className={cn("text-xl text-center", {
                  "text-muted-foreground":
                    userRegisteredComp?.submissionFileSubmitted,
                })}
              >
                Choose files or drag and drop
              </h1>
              <p
                className={cn("text-lg text-center", {
                  "text-muted-foreground":
                    userRegisteredComp?.submissionFileSubmitted,
                })}
              >
                File up to 4MB, max 1 file
              </p>
              <p
                className={cn("text-sm text-center", {
                  "text-muted-foreground":
                    userRegisteredComp?.submissionFileSubmitted,
                })}
              >
                Supported types: .pdf, .zip
              </p>
              {files[0]?.name && (
                <p className="text-sm text-center line-clamp-1">
                  Selected: {files[0].name}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <Controller
            name="fileUrl"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                className="w-full p-1"
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="text"
                readOnly
                disabled
              />
            )}
          />
        </div>
        {isLoading && isUploading && (
          <div className="mt-2 mb-2">
            <div className="flex justify-between">
              <p>
                {progress === 0
                  ? "Starting upload..."
                  : progress === 100
                    ? "Finalizing upload..."
                    : "Uploading..."}
              </p>
              <p>{progress === 100 ? `` : `${progress}%`}</p>
            </div>
            <Progress value={progress as number} className="w-full" />
          </div>
        )}
        {userRegisteredComp?.submissionFileSubmitted ? (
          <Button
            variant={"outline"}
            className={cn("cursor-pointer mt-2 w-full", {
              "cursor-not-allowed": userRegisteredComp?.submissionFileSubmitted,
            })}
            disabled={true}
            onClick={() => startUpload(files)}
          >
            File Submitted
          </Button>
        ) : (
          <Button
            variant={"outline"}
            className="cursor-pointer mt-2 w-full"
            disabled={isLoading || isUploading || !files.length || isSubmitting}
            onClick={() => startUpload(files)}
            type="button"
          >
            {files.length > 0 ? `Upload ${files.length} file` : "Upload"}
          </Button>
        )}
        {!userRegisteredComp?.submissionFileSubmitted && (
          <ConfettiButton
            className={cn(
              "cursor-pointer mt-2 w-full",
              buttonVariants({ variant: "default" })
            )}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <div className="flex gap-2">
                <span>Submitting...</span>
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Submit"
            )}
          </ConfettiButton>
        )}
        {userRegisteredComp?.submissionFileSubmitted && (
          <p className="text-sm text-green-500 mt-2 text-center">
            {`Submitted on ${
              userRegisteredComp.submissionFileCreatedAt
                ? new Date(
                    userRegisteredComp.submissionFileCreatedAt
                  ).toDateString()
                : ""
            } at ${
              userRegisteredComp.submissionFileCreatedAt
                ? new Date(
                    userRegisteredComp.submissionFileCreatedAt
                  ).toLocaleTimeString()
                : ""
            }`}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-2 text-center">
          Work cannot be turned in after the due date
        </p>
      </div>
    </form>
  );
}
