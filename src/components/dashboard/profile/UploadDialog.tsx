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
import { UploadDialogProps, User } from "@/types/types";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";
import { useDropzone } from "@uploadthing/react";
import { UserAvatar } from "@/components/general/UserProfile";
import { Progress } from "@/components/ui/progress";

export default function UploadDialog({
  user,
  isLoading,
  setIsLoading,
  router,
}: UploadDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // Preview cropped image
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [cropping, setIsCropping] = useState<boolean>(true);
  const [files, setFiles] = useState<File[]>([]);
  // Upload cropped image
  const [uploadCroppedFile, setUploadCroppedFile] = useState<File | null>(null);
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
      setTimeout(() => {
        router.refresh();
        window.location.reload();
      }, 500);
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
            Make changes to your profile picture here. Click save when
            you&apos;re done. Square or 1:1 aspect ratio are recommended for
            best results
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {cropping && !isUploading && (
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
          )}
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
          {isLoading && isUploading && (
            <>
              <UserAvatar
                className="w-32 h-32 border-2 border-primary/50 mx-auto mt-5 mb-5"
                src={croppedImageUrl as string}
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
              }}
            >
              Upload without crop
            </Button>
          </DialogFooter>
        )}
        {!cropping && !isUploading && (
          <DialogFooter className="">
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
  );
}
