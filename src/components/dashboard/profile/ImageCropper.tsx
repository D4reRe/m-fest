"use client";
import { toast } from "sonner";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import Image from "next/image";
import { Button } from "../../ui/button";
import { setCanvasPreview, setCanvasUpload } from "./setCanvasPreview";
import { ImageCropperProps } from "@/types/types";
import {
  maxFileSize,
  MIN_DIMENSION,
  validExtensions,
} from "@/constants/constants";
import { UserAvatar } from "@/components/general/UserProfile";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/lib/utils";

export default function ImageCropper({
  updateImgUrl,
  updateImgFile,
  updateUploadCroppedFile,
  isLoading,
  isUploading,
  title,
  isProfilePicture,
}: ImageCropperProps) {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  const ASPECT_RATIO: number | undefined = isProfilePicture ? 1 : undefined;
  const imgRef = useRef<HTMLImageElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const uploadCanvasRef = useRef<HTMLCanvasElement>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [uploadCroppedImageUrl, setUploadCroppedImageUrl] = useState<
    string | null
  >(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>("");
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  function resetFileInput() {
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
    setImageSrc(null);
    setCroppedImageUrl(null);
    setCroppedFile(null);
    updateUploadCroppedFile(null as unknown as File);
    setUploadCroppedImageUrl(null);
    updateImgUrl("");
    updateImgFile(null as unknown as File);
  }
  function onSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // file.type : image/png, image/jpeg, image/jpg, image/webp
    if (!file.type.startsWith("image")) {
      toast.error("Invalid file type", {
        description:
          "Please upload a valid image file (e.g., PNG, JPG, JPEG, WEBP).",
      });
      setError("Please upload a valid image file (PNG, JPG, JPEG, WEBP etc.)");
      event.target.value = ""; // Reset input
      return;
    }
    const fileExtension = file.type.split("/").pop()?.toLowerCase();
    if (!validExtensions.includes(fileExtension as string) || !fileExtension) {
      toast.error("Invalid file extension", {
        description: "Only JPG, JPEG, PNG, or WEBP files are allowed.",
      });
      setError("Only JPG, JPEG, PNG, or WEBP files are allowed.");
      event.target.value = "";
      return;
    }

    // 4 MB
    if (file.size > maxFileSize) {
      toast.error("File too large", {
        description: "Maximum allowed size is 4 MB.",
      });
      setError("Maximum allowed size is 4 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = document.createElement("img");
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;
      imageElement.addEventListener(
        "load",
        // @ts-expect-error event is SyntheticEvent
        (event: React.SyntheticEvent<HTMLImageElement>) => {
          if (error) setError("");
          const { naturalWidth, naturalHeight } = event.currentTarget;
          setNaturalWidth(naturalWidth);
          setNaturalHeight(naturalHeight);
          if (naturalHeight < MIN_DIMENSION || naturalWidth < MIN_DIMENSION) {
            toast.error("Image is too small", {
              description: `Image must be at least ${MIN_DIMENSION}x${MIN_DIMENSION}px`,
            });
            setError(
              `Image must be at least ${MIN_DIMENSION}x${MIN_DIMENSION}px`
            );
            setNaturalWidth(0);
            setNaturalHeight(0);
            return setImageSrc("");
          }
        }
      );
      setImageSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  }
  function onImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = event.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      (ASPECT_RATIO as unknown as number) ?? 1,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  }
  return (
    <>
      <div className="grid w-full items-center gap-3">
        {!isUploading && (
          <>
            <Label htmlFor="picture">{title}</Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              ref={inputFileRef}
              className="cursor-pointer"
            />
          </>
        )}
        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex flex-col items-center ">
          {imageSrc && !croppedImageUrl && (
            <>
              <ReactCrop
                crop={crop}
                onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                circularCrop={isProfilePicture}
                keepSelection
                aspect={ASPECT_RATIO}
                minWidth={MIN_DIMENSION}
              >
                {naturalWidth > naturalHeight && (
                  <Image
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop me"
                    width={750}
                    height={750}
                    onLoad={onImageLoad}
                    loading="lazy"
                  />
                )}
                {naturalWidth < naturalHeight && (
                  <Image
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop me"
                    width={250}
                    height={250}
                    onLoad={onImageLoad}
                    loading="lazy"
                  />
                )}
                {naturalWidth === naturalHeight && (
                  <Image
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop me"
                    width={250}
                    height={250}
                    onLoad={onImageLoad}
                    loading="lazy"
                  />
                )}
              </ReactCrop>
              <div className="flex gap-3">
                <Button
                  className="mt-4 cursor-pointer"
                  disabled={isLoading}
                  onClick={() => {
                    const pixelCrop = convertToPixelCrop(
                      crop as Crop,
                      imgRef.current?.width as number,
                      imgRef.current?.height as number
                    );
                    setCanvasPreview(
                      imgRef.current as HTMLImageElement,
                      previewCanvasRef.current as HTMLCanvasElement,
                      pixelCrop
                    );

                    // Convert the canvas result to base64
                    const dataUrl = previewCanvasRef.current?.toDataURL();
                    setCroppedImageUrl(dataUrl as string);
                    updateImgUrl(dataUrl as string);

                    // Convert to blob
                    previewCanvasRef.current?.toBlob(
                      (blob) => {
                        if (!blob) return;
                        if (isProfilePicture) {
                          const file = new File(
                            [blob],
                            `${user?.name}-avatar.webp`,
                            {
                              // blob.type ---> if don't specify type it defaults to png. choose either jpeg or webp for better compression
                              // type: blob.type,
                              type: "image/webp",
                            }
                          );
                          setCroppedFile(file);
                          updateImgFile(file);
                        }
                      },
                      "image/webp",
                      1
                    );

                    // For upload canvas
                    setCanvasUpload(
                      imgRef.current as HTMLImageElement,
                      uploadCanvasRef.current as HTMLCanvasElement,
                      pixelCrop
                    );

                    const uploadDataUrlPreview =
                      uploadCanvasRef.current?.toDataURL();
                    setUploadCroppedImageUrl(uploadDataUrlPreview as string);

                    uploadCanvasRef.current?.toBlob(
                      (blob) => {
                        if (!blob) return;
                        if (isProfilePicture) {
                          const file = new File(
                            [blob],
                            `${user?.name}-avatar.webp`,
                            {
                              // blob.type ---> if don't specify type it defaults to png. choose either jpeg or webp for better compression
                              // type: blob.type,
                              type: "image/webp",
                            }
                          );
                          updateUploadCroppedFile(file);
                        }
                      },
                      "image/webp",
                      1
                    );
                  }}
                >
                  Crop Image
                </Button>
                <Button
                  className="mt-4 cursor-pointer"
                  onClick={() => {
                    resetFileInput();
                  }}
                  variant={"secondary"}
                  disabled={isLoading}
                >
                  Change Image
                </Button>
              </div>
            </>
          )}
          {crop && croppedImageUrl && isProfilePicture && (
            <>
              <div className="flex gap-3">
                <UserAvatar
                  className="w-32 h-32 border-2 border-primary/50 mt-5"
                  src={croppedImageUrl as string}
                  alt={user?.name ?? "User's preview cropped Image"}
                />
                {/* Debugging */}
                {/* <UserAvatar
                  className="w-32 h-32 border-2 border-primary/50 mt-5"
                  src={uploadCroppedImageUrl as string}
                  alt={alt ?? "User's cropped uploaded Image"}
                /> */}
              </div>
              {!isUploading && (
                <Button
                  className="mt-4 cursor-pointer"
                  onClick={() => {
                    setCroppedImageUrl("");
                    setUploadCroppedImageUrl(null);
                    updateImgUrl("");
                    setCroppedFile(null);
                    updateUploadCroppedFile(null as unknown as File);
                    updateImgFile(null as unknown as File);
                  }}
                  variant={"destructive"}
                  disabled={isLoading}
                >
                  Cancel Crop
                </Button>
              )}
            </>
          )}
          <canvas
            ref={previewCanvasRef}
            style={{
              border: "1px solid #ccc",
              borderRadius: "50%",
              objectFit: "contain",
              width: 150,
              height: 150,
              imageRendering: "pixelated",
              display: "none",
            }}
          />
          <canvas
            ref={uploadCanvasRef}
            style={{
              border: "1px solid #ccc",
              borderRadius: "50%",
              objectFit: "contain",
              width: 150,
              height: 150,
              imageRendering: "pixelated",
              display: "none",
            }}
          />
        </div>
      </div>
    </>
  );
}
