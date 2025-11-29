import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import PencilIcon from "./PencilIcon";
import ImageCropper from "./ImageCropper";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useUploadThing } from "@/utils/uploadthing";
import { Loader2, Upload } from "lucide-react";
import { type UploadDialogProps } from "@/types/types";
import { UploadThingError } from "uploadthing/server";
import { type Json } from "@uploadthing/shared";
import { useDropzone } from "@uploadthing/react";
import { UserAvatar } from "@/components/general/UserProfile";
import { Progress } from "@/components/ui/progress";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { MAX_PROFILEIMAGE_SIZE } from "@/constants/constants";
import { useTRPC } from "@/utils/trpc";

export default function UploadDialog({
  isLoading,
  setIsLoading,
}: UploadDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // Preview cropped image
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [onDropPreviewImageUrl, setOnDropPreviewImageUrl] = useState<
    string | null
  >(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [showImageOnDropPreview, setShowImageOnDropPreview] =
    useState<boolean>(false);
  const [cropping, setIsCropping] = useState<boolean>(true);
  const [files, setFiles] = useState<File[]>([]);
  // Upload cropped image
  const [uploadCroppedFile, setUploadCroppedFile] = useState<File | null>(null);
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
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
      if (p === 0) {
        setProgress(p);
        toast.loading(`Uploading profile image...`, {
          id: "upload-profile-image",
          description: `Starting upload...`,
        });
      }
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
      setIsDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getUser.queryKey(),
      });
      router.refresh();
      setCroppedImageUrl(null);
      setCroppedFile(null);
      setUploadCroppedFile(null);
      setShowImageOnDropPreview(false);
      setOnDropPreviewImageUrl(null);
      setFiles([]);
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      toast.error("Only one file is allowed");
      return;
    }
    if (!acceptedFiles[0]?.type.startsWith("image")) {
      toast.error("Only image files are allowed");
      return;
    }
    const validExtensions = ["png", "jpeg", "jpg", "webp"];
    if (
      !validExtensions.includes(
        acceptedFiles[0]?.type.split("/").pop()?.toLowerCase() as string
      )
    ) {
      toast.error("Supported types: jpg, jpeg, png, & webp");
      return;
    }
    if (acceptedFiles[0]?.size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB");
      return;
    }
    const currentFile = acceptedFiles[0];
    const imageElement = document.createElement("img");
    imageElement.src = URL.createObjectURL(currentFile);
    imageElement.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2D context");
      const scale = Math.min(
        MAX_PROFILEIMAGE_SIZE / imageElement.width,
        MAX_PROFILEIMAGE_SIZE / imageElement.height
      );
      canvas.width = Math.floor(imageElement.width * scale);
      canvas.height = Math.floor(imageElement.height * scale);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const file = new File([blob], currentFile.name, {
            // blob.type ---> if don't specify type it defaults to png. choose either jpeg or webp for better compression
            // type: blob.type,
            type: "image/webp",
          });
          const files = [file];
          setOnDropPreviewImageUrl(URL.createObjectURL(file));
          setFiles(files as File[]);
        },
        "image/webp",
        1
      );
    };
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open: boolean) => {
        if (isLoading || isUploading) return;
        setIsDialogOpen(open);
        if (!open) {
          setCroppedImageUrl(null);
          setCroppedFile(null);
          setUploadCroppedFile(null);
          setOnDropPreviewImageUrl(null);
          setShowImageOnDropPreview(false);
          setFiles([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 cursor-pointer"
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
            Make changes to your profile picture here. Click save when
            you&apos;re done. Square or 1:1 aspect ratio are recommended for
            best results
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {cropping && !isUploading && (
            <ImageCropper
              title="Profile Picture"
              updateImgUrl={updateImgUrl}
              updateImgFile={updateImgFile}
              updateUploadCroppedFile={updateUploadCroppedFile}
              isLoading={isLoading as boolean}
              isUploading={isUploading}
              isProfilePicture={true}
            />
          )}
          {!cropping && !isUploading && (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className="w-full h-50 l rounded-lg bg-slate-500/45 flex justify-center items-center cursor-pointer ">
                {showImageOnDropPreview ? (
                  <UserAvatar
                    className="w-32 h-32 border-2 border-primary/50 mx-auto mt-5 mb-5"
                    src={onDropPreviewImageUrl as string}
                    alt={"User's preview cropped Image"}
                  />
                ) : (
                  <div className="flex flex-col items-center text-wrap">
                    <Upload className="w-6 h-6" />
                    <h1 className="text-xl">Choose files or drag and drop</h1>
                    <p className="text-lg">Image up to 4MB, max 1 file</p>
                    <p className="text-sm">
                      Supported types: jpg, jpeg, png, & webp
                    </p>
                    {files[0]?.name && (
                      <>
                        <p className="text-sm text-center line-clamp-1">
                          Selected: {files[0].name}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {isLoading && isUploading && (
            <>
              <UserAvatar
                className="w-32 h-32 border-2 border-primary/50 mx-auto mt-5 mb-5"
                src={
                  (croppedImageUrl as string) ||
                  (onDropPreviewImageUrl as string)
                }
                alt={"User's preview cropped Image"}
              />
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
                queryClient.invalidateQueries({
                  queryKey: trpc.dashboard.getUser.queryKey(),
                });
                router.refresh();

                setIsDialogOpen(false);
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
                setUploadCroppedFile(null);
                updateImgFile(null as unknown as File);
                updateImgUrl("");
                setIsCropping(false);
                setCroppedImageUrl(null);
              }}
            >
              Upload without crop
            </Button>
          </DialogFooter>
        )}
        {!cropping && !isUploading && (
          <DialogFooter className="flex justify-evenly items-center">
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
            {files.length > 0 && (
              <Button
                variant={"default"}
                className="cursor-pointer mt-2 sm:mt-0 sm:mr-auto bg-blue-600 hover:bg-blue-800 text-white transition-all"
                onClick={() => setShowImageOnDropPreview((prev) => !prev)}
              >
                {showImageOnDropPreview ? "Hide preview" : "See preview"}
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
                setShowImageOnDropPreview(false);
                setOnDropPreviewImageUrl(null);
                setFiles([]);
              }}
            >
              Crop & upload
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
