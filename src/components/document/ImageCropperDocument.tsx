"use client";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import Image from "next/image";
import { Button } from "../ui/button";
import { setCanvasPreview, setCanvasUpload } from "./setCanvasPreview";
import { User } from "@prisma/client";

export default function ImageCropperDocument({
  alt,
  updateImgUrl,
  updateImgFile,
  updateUploadCroppedFile,
  isLoading,
  title,
  isProfilePicture,
  user,
}: {
  title: string;
  alt: string;
  updateImgUrl: (imgSrc: string) => void;
  updateImgFile: (file: File) => void;
  updateUploadCroppedFile: (file: File) => void;
  isLoading: boolean;
  isProfilePicture?: boolean;
  user: User;
}) {
  const ASPECT_RATIO: number | undefined = isProfilePicture ? 1 : undefined;
  const MIN_DIMENSION = 150;
  const imgRef = useRef<HTMLImageElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const uploadCanvasRef = useRef<HTMLCanvasElement>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
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

    const validExtensions = ["png", "jpeg", "jpg", "webp"];
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
    if (file.size > 4 * 1024 * 1024) {
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
    const crop = makeAspectCrop(
      // starting crop shape is at width / 2 for better user experience if the user has larger dimension
      {
        unit: "px",
        width: Math.max(MIN_DIMENSION, width / 2),
      },
      (ASPECT_RATIO as unknown as number) ?? 1,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  }
  function handleCropChange(crop: Crop) {
    if (!crop.width || !crop.height) return;

    const min = MIN_DIMENSION;
    // height = width / ASPECT_RATIO
    const newCrop = {
      ...crop,
      width: Math.max(crop.width, min),
      height: Math.max(crop.height, min / (ASPECT_RATIO ?? 1)),
    };
    setCrop(newCrop);
  }
  return (
    <>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="picture">{title}</Label>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          ref={inputFileRef}
        />
        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex flex-col items-center ">
          {imageSrc && !croppedImageUrl && (
            <>
              <ReactCrop
                crop={crop}
                onChange={handleCropChange}
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
                  />
                )}
              </ReactCrop>
              <div className="flex gap-3">
                <Button
                  className="mt-4"
                  disabled={isLoading}
                  onClick={() => {
                    const pixelCrop = convertToPixelCrop(
                      crop as Crop,
                      imgRef.current?.width as number,
                      imgRef.current?.height as number
                    );

                    if (
                      pixelCrop.width < MIN_DIMENSION ||
                      pixelCrop.height < MIN_DIMENSION
                    ) {
                      toast.error("Cropped area too small", {
                        description: `Crop must be at least ${MIN_DIMENSION}x${MIN_DIMENSION}px`,
                      });
                      setError(
                        `Crop must be at least ${MIN_DIMENSION}x${MIN_DIMENSION}px`
                      );
                      return;
                    }

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
                        if (!isProfilePicture) {
                          const file = new File(
                            [blob],
                            `document-${title}-${user.name}.webp`,
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

                    uploadCanvasRef.current?.toBlob(
                      (blob) => {
                        if (!blob) return;
                        if (!isProfilePicture) {
                          const file = new File(
                            [blob],
                            `document-${title}-${user.name}.webp`,
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
          {crop && croppedImageUrl && !isProfilePicture && (
            <>
              {naturalHeight > naturalWidth && (
                <Image
                  src={croppedImageUrl as string}
                  alt={alt ?? `${title} Image`}
                  width={250}
                  height={250}
                  className="mt-5"
                ></Image>
              )}
              {naturalHeight < naturalWidth && (
                <Image
                  src={croppedImageUrl as string}
                  alt={alt ?? `${title} Image`}
                  width={750}
                  height={750}
                  className="mt-5"
                ></Image>
              )}
              <Button
                className="mt-4 cursor-pointer"
                onClick={() => {
                  setCroppedImageUrl("");
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
