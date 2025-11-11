import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import PencilIcon from "./PencilIcon";
import ImageCropper from "./ImageCropper";
import { Progress } from "@heroui/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useUploadThing } from "@/utils/uploadthing";
import { Loader2 } from "lucide-react";
import { UploadDialogProps, User } from "@/types/types";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";

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
            you&apos;re done.
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
        <DialogFooter>
          {!isUploading && (
            <>
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
  );
}
