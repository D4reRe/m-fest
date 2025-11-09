"use client";
import { useUploadThing } from "@/utils/uploadthing";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { User, Verification } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "@heroui/react";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";
import ImageCropperDocument from "@/components/document/ImageCropperDocument";

const documentsSchema = z.object({
  imageUrl: z.string().min(1),
});

type documentsSchema = z.infer<typeof documentsSchema>;

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

function DocumentsForm({
  key,
  user,
  documents,
  title,
  submissionDetail,
  acceptedFiles,
  uploadThingRoute,
}: {
  key: number;
  user: User;
  documents: Verification;
  title: string;
  submissionDetail: string;
  acceptedFiles: string[];
  uploadThingRoute: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [cropping, setIsCropping] = useState<boolean>(false);

  // Preview cropped image
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  // Upload cropped image
  const [uploadCroppedFile, setUploadCroppedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  usePreventRefreshUserDuringUpload(isLoading);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      toast.error("Only one file is allowed");
      return;
    }
    if (!acceptedFiles[0].type.startsWith("image")) {
      toast.error("Only image files are allowed");
      return;
    }
    const validExtensions = ["png", "jpeg", "jpg", "webp"];
    if (
      !validExtensions.includes(
        acceptedFiles[0].type.split("/").pop()?.toLowerCase() as string
      )
    ) {
      toast.error("Supported types: jpg, jpeg, png, & webp");
      return;
    }
    if (acceptedFiles[0].size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB");
      return;
    }
    setFiles(acceptedFiles);
  }, []);
  // @ts-expect-error uploadThingRoute is string and always in ""
  const { startUpload, routeConfig } = useUploadThing(uploadThingRoute, {
    onBeforeUploadBegin(files) {
      toast.loading(`Presigning URL for ${title} image...`, {
        id: "presigning-url",
      });
      return files;
    },
    onUploadBegin: (filename: string) => {
      toast.dismiss("presigning-url");
      setIsUploading(true);
      setIsLoading(true);
      toast.info(`Upload has begun for ${title}`, {
        description: `Uploading ${filename}`,
      });
    },
    onUploadProgress(p) {
      if (p < 100) {
        setProgress(p);
        toast.loading(`Uploading ${title} image...`, {
          id: "upload-document",
          description: `${p}%`,
        });
      }
      if (p === 100) {
        setProgress(p);
        toast.loading(`Uploading ${title} image...`, {
          id: "upload-document",
          description: `Finalizing upload...`,
        });
      }
    },
    onClientUploadComplete: () => {
      setIsUploading(false);
      setIsLoading(false);
      toast.dismiss("upload-document");
      toast.success(`${title} uploaded successfully!`);
      setTimeout(() => {
        router.refresh();
        window.location.reload();
      }, 500);
    },
    onUploadError: (e: UploadThingError<Json>) => {
      setIsUploading(false);
      setIsLoading(false);
      toast.dismiss("upload-document");
      toast.error(`Failed to upload ${title}`, {
        description: e.message,
      });
    },
    uploadProgressGranularity: "fine",
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // accept: generateClientDropzoneAccept(
    //   generatePermittedFileTypes(routeConfig).fileTypes
    // ),
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

  const { handleSubmit, control } = useForm<documentsSchema>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      imageUrl: "",
    },
  });
  const router = useRouter();

  async function onSubmit(formData: documentsSchema) {
    setIsLoading(true);
    toast.loading("Updating profile...", {
      id: "update-profile",
    });
    try {
      const res = await fetch("/api/verify-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
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
    } catch (error) {
      setIsLoading(false);
      toast.dismiss("update-profile");
      toast.error("Failed to update profile", {
        description: (error as Error).message,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border rounded-lg p-5">
      <section>
        <div className="mb-6">
          <div className="mb-8 w-full flex max-sm:flex-col justify-between items-center  ">
            <h1 className="text-3xl max-sm:mb-4">{title}</h1>
            <div
              className={`px-4 py-2 rounded-full border bg-accent-foreground/10`}
            >
              Not Sumbitted yet
            </div>
          </div>
          <h3 className="text-muted-foreground">Submission Detail</h3>
          <div className="flex justify-start gap-5">
            <p>{submissionDetail}</p>
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor={title}>Upload {title}</Label>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open: boolean) => {
                if (isUploading || isLoading) return;
                setIsDialogOpen(open);
              }}
            >
              <DialogTrigger asChild>
                <Button
                  className=""
                  variant={"outline"}
                  onClick={() => {
                    setActiveIndex(key);
                    if (!isLoading) setIsDialogOpen(true);
                    if (isLoading) return;
                  }}
                >
                  <Upload className="w-4 h-4"></Upload>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm sm:max-w-xl ">
                <DialogHeader>
                  <DialogTitle>Upload {title}</DialogTitle>
                  <DialogDescription>
                    Click save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  {!cropping && !isUploading && (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="w-full h-50 l rounded-lg bg-slate-700/45 flex justify-center items-center ">
                        <div className="flex flex-col items-center">
                          <Upload className="w-6 h-6" />
                          <h1 className="text-xl">
                            Choose files or drag and drop
                          </h1>
                          <p className="text-lg">Image up to 4MB, max 1 file</p>
                          {files[0]?.name && (
                            <p className="text-sm text-center line-clamp-1">
                              Selected: {files[0].name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {cropping && !isUploading && (
                    <ImageCropperDocument
                      title="Profile Picture"
                      user={user as User}
                      alt={user.name as string}
                      updateImgUrl={updateImgUrl}
                      updateImgFile={updateImgFile}
                      updateUploadCroppedFile={updateUploadCroppedFile}
                      isLoading={isLoading as boolean}
                      isProfilePicture={false}
                    />
                  )}
                  {isLoading && isUploading && activeIndex === key && (
                    <div>
                      <Progress
                        classNames={{
                          base: "w-full",
                          track: "drop-shadow-md border border-default",
                          // indicator: "bg-linear-to-r from-pink-500 to-yellow-500",
                          indicator: "bg-white",
                          label: "tracking-wider font-medium text-default-600",
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
                {cropping && !isUploading && (
                  <DialogFooter>
                    <Button
                      className="cursor-pointer mt-2 sm:mt-0 sm:mr-auto"
                      disabled={!croppedImageUrl || isLoading || isUploading}
                      onClick={async () => {
                        setIsLoading(true);
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
                          toast.dismiss("upload-document");
                          return;
                        }
                        setTimeout(() => {
                          router.refresh();
                          window.location.reload();
                        }, 500);
                      }}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={isLoading || isUploading}
                      className="cursor-pointer"
                      onClick={() => {
                        setCroppedImageUrl("");
                        setCroppedFile(null);
                        updateImgFile(null as unknown as File);
                        setUploadCroppedFile(null);
                        updateImgUrl("");
                        setIsCropping(false);
                      }}
                    >
                      Back to upload directly
                    </Button>
                  </DialogFooter>
                )}
                {!cropping && !isUploading && (
                  <DialogFooter className="flex! justify-between! items-center!">
                    {files.length > 0 && (
                      <Button
                        variant={"default"}
                        className="cursor-pointer justify-self-center"
                        disabled={isLoading || isUploading}
                        onClick={() => startUpload(files)}
                      >
                        Upload {files.length} file
                      </Button>
                    )}
                    {files.length === 0 && (
                      <Button
                        variant={"default"}
                        className="cursor-pointer justify-self-center"
                        onClick={() => startUpload(files)}
                        disabled={true}
                      >
                        Upload
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      disabled={isLoading || isUploading}
                      className="cursor-pointer"
                      onClick={() => {
                        setIsCropping(true);
                      }}
                    >
                      Crop before upload
                    </Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-5">
            <h1 className="mb-2 text-muted-foreground">
              Preview uploaded image:
            </h1>
            {title === "Identity Card" && documents?.IdentityCardImageUrl && (
              <>
                <Image
                  src={documents.IdentityCardImageUrl}
                  alt={title}
                  width={500}
                  height={500}
                />
              </>
            )}
            {title === "Twibbon" && documents?.twibbonImageUrl && (
              <>
                <Image
                  src={documents.twibbonImageUrl}
                  alt={title}
                  width={500}
                  height={500}
                />
              </>
            )}
            {title === "Follow Instagram" && documents?.followIgImageUrl && (
              <>
                <Image
                  src={documents.followIgImageUrl}
                  alt={title}
                  width={500}
                  height={500}
                />
              </>
            )}
            {title === "PDDikti" && documents?.pDDiktiImageUrl && (
              <>
                <Image
                  src={documents.pDDiktiImageUrl}
                  alt={title}
                  width={500}
                  height={500}
                />
              </>
            )}
          </div>

          <h3 className="mt-6 text-muted-foreground">Accepted File Types:</h3>
          <p className="mt-2">{acceptedFiles.join(", ")}</p>

          {documents?.IdentityCardImageUrl && title === "Identity Card" && (
            <div>
              <h1 className="mt-5 text-muted-foreground">Uploaded file:</h1>
              <p className="text-sm">
                Last uploaded:{" "}
                {`${documents.IdentityCardCreatedAt?.toDateString()} at ${documents.IdentityCardCreatedAt?.toLocaleTimeString()}`}
              </p>
              <Link
                href={documents.IdentityCardImageUrl}
                className="underline italic text-blue-400"
                target="_blank"
              >
                View Latest Submission
              </Link>
            </div>
          )}
          {documents?.twibbonImageUrl && title === "Twibbon" && (
            <div>
              <h1 className="mt-5 text-muted-foreground">Uploaded file:</h1>
              <p className="text-sm">
                Last uploaded:{" "}
                {`${documents.twibbonCreatedAt?.toDateString()} at ${documents.twibbonCreatedAt?.toLocaleTimeString()}`}
              </p>
              <Link
                href={documents.twibbonImageUrl}
                className="underline italic text-blue-400"
                target="_blank"
              >
                View Latest Submission
              </Link>
            </div>
          )}
          {documents?.followIgImageUrl && title === "Follow Instagram" && (
            <div>
              <h1 className="mt-5 text-muted-foreground">Uploaded file:</h1>
              <p className="text-sm">
                Last uploaded:{" "}
                {`${documents.followIgCreatedAt?.toDateString()} at ${documents.followIgCreatedAt?.toLocaleTimeString()}`}
              </p>
              <Link
                href={documents.followIgImageUrl}
                className="underline italic text-blue-400"
                target="_blank"
              >
                View Latest Submission
              </Link>
            </div>
          )}
          {documents?.pDDiktiImageUrl && title === "PDDikti" && (
            <div>
              <h1 className="mt-5 text-muted-foreground">Uploaded file:</h1>
              <p className="text-sm">
                Last uploaded:{" "}
                {`${documents.pDDiktiCreatedAt?.toDateString()} at ${documents.pDDiktiCreatedAt?.toLocaleTimeString()}`}
              </p>
              <Link
                href={documents.pDDiktiImageUrl}
                className="underline italic text-blue-400"
                target="_blank"
              >
                View Latest Submission
              </Link>
            </div>
          )}
        </div>
      </section>
    </form>
  );
}

export default DocumentsForm;
