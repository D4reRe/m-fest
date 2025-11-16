"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2, Upload } from "lucide-react";
import ImageCropperDocument from "./ImageCropperDocument";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "@/utils/uploadthing";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";
import { UploadDocumentProps, UploadThingRoute } from "@/types/types";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { useQueryClient } from "@tanstack/react-query";

export default function UploadDocumentDialog({
  isLoading,
  setIsLoading,
  id,
  title,
  type,
  uploadThingRoute,
  setValue,
}: UploadDocumentProps) {
  const [progress, setProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [activeDialog, setActiveDialog] = useState<number | null>(null);
  const [cropping, setIsCropping] = useState<boolean>(false);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [uploadCroppedFile, setUploadCroppedFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const [uploadThingRouteUpload, setUploadThingRouteUpload] =
    useState<UploadThingRoute | null>(null);

  function updateImgUrl(imgSrc: string) {
    setCroppedImageUrl(imgSrc);
  }
  function updateImgFile(file: File) {
    setCroppedFile(file);
  }
  function updateUploadCroppedFile(file: File) {
    setUploadCroppedFile(file);
  }

  const { startUpload } = useUploadThing(uploadThingRoute, {
    onBeforeUploadBegin(files) {
      toast.loading(`Presigning URL for image...`, {
        id: "presigning-url",
      });
      return files;
    },
    onUploadBegin: (filename: string) => {
      toast.dismiss("presigning-url");
      setIsUploading(true);
      setIsLoading(true);
      toast.info(`Upload has begun for the image`, {
        description: `Uploading ${filename}`,
      });
    },
    onUploadProgress(p) {
      if (p === 0) {
        setProgress(p);
        toast.loading(`Uploading image...`, {
          id: "upload-document",
          description: `Starting upload...`,
        });
      }
      if (p < 100) {
        setProgress(p);
        toast.loading(`Uploading image...`, {
          id: "upload-document",
          description: `${p}%`,
        });
      }
      if (p === 100) {
        setProgress(p);
        toast.loading(`Uploading image...`, {
          id: "upload-document",
          description: `Finalizing upload...`,
        });
      }
    },
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setIsLoading(false);
      toast.dismiss("upload-document");
      toast.success(`Image uploaded successfully!`);
      setValue(uploadThingRouteUpload as UploadThingRoute, res[0].ufsUrl, {
        shouldValidate: true,
      });
      queryClient.invalidateQueries({ queryKey: ["userDocuments"] });
      setActiveDialog(null);
    },
    onUploadError: (e: UploadThingError<Json>) => {
      setIsUploading(false);
      setIsLoading(false);
      toast.dismiss("upload-document");
      toast.error(`Failed to upload image`, {
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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor={title}>Upload {title}</Label>

      <Dialog
        open={activeDialog === id}
        onOpenChange={(open: boolean) => {
          if (isUploading || isLoading) return;
          if (open) setActiveDialog(id);
          else setActiveDialog(null);
        }}
      >
        <DialogTrigger asChild>
          <Button
            className=""
            variant={"outline"}
            onClick={() => {
              setUploadThingRouteUpload(uploadThingRoute as UploadThingRoute);
              if (!isLoading) setActiveDialog(id);
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
                    <h1 className="text-xl">Choose files or drag and drop</h1>
                    <p className="text-lg">Image up to 4MB, max 1 file</p>
                    <p className="text-sm">
                      Supported types: jpg, jpeg, png, & webp
                    </p>
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
                title={title}
                updateImgUrl={updateImgUrl}
                updateImgFile={updateImgFile}
                updateUploadCroppedFile={updateUploadCroppedFile}
                isLoading={isLoading as boolean}
                isProfilePicture={false}
              />
            )}
            {isLoading && isUploading && activeDialog === id && (
              <>
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
              </>
            )}
          </div>
          {cropping && !isUploading && (
            <DialogFooter>
              <Button
                className="cursor-pointer mt-2 sm:mt-0 sm:mr-auto"
                disabled={!croppedImageUrl || isLoading || isUploading}
                onClick={async () => {
                  setIsLoading(true);
                  const file = uploadCroppedFile as File;
                  const utfileUrls = await startUpload([file]);
                  if (!utfileUrls) {
                    setIsLoading(false);
                    toast.dismiss("presigning-url");
                    toast.dismiss("upload-document");
                    return;
                  }
                  if (utfileUrls[0].ufsUrl) {
                    setValue(type, utfileUrls[0].ufsUrl, {
                      shouldValidate: true,
                    });
                  }
                  queryClient.invalidateQueries({
                    queryKey: ["userDocuments"],
                  });
                  setActiveDialog(null);
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
            <DialogFooter>
              {files.length > 0 && (
                <Button
                  variant={"default"}
                  className="cursor-pointer mt-2 sm:mt-0 sm:mr-auto"
                  disabled={isLoading || isUploading}
                  onClick={() => startUpload(files)}
                >
                  Upload {files.length} file
                </Button>
              )}
              {files.length === 0 && (
                <Button
                  variant={"default"}
                  className="cursor-pointer mt-2 sm:mt-0 sm:mr-auto"
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
  );
}
