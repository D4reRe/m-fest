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
import { setCanvasPreview } from "./setCanvasPreview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

export default function ImageCropper({
  alt,
  updateAvatar,
  isLoading,
}: {
  alt: string;
  updateAvatar: (imgSrc: string) => void;
  isLoading: boolean;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>("");
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  function onSelectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = document.createElement("img");
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;
      imageElement.addEventListener(
        "load",
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
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  }
  return (
    <>
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="picture">Picture</Label>
        <Input
          id="picture"
          type="file"
          accept="image/*"
          onChange={onSelectFile}
        />
        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex flex-col items-center ">
          {imageSrc && !croppedImageUrl && (
            <>
              <ReactCrop
                crop={crop}
                onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                circularCrop
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
                    width={300}
                    height={300}
                    onLoad={onImageLoad}
                  />
                )}
                {naturalWidth === naturalHeight && (
                  <Image
                    ref={imgRef}
                    src={imageSrc}
                    alt="Crop me"
                    width={300}
                    height={300}
                    onLoad={onImageLoad}
                  />
                )}
              </ReactCrop>
              <Button
                className="mt-4"
                onClick={() => {
                  setCanvasPreview(
                    imgRef.current as HTMLImageElement,
                    previewCanvasRef.current as HTMLCanvasElement,
                    convertToPixelCrop(
                      crop as Crop,
                      imgRef.current?.width as number,
                      imgRef.current?.height as number
                    )
                  );

                  // Convert the canvas result to base64
                  const dataUrl = previewCanvasRef.current?.toDataURL();
                  setCroppedImageUrl(dataUrl as string);
                  updateAvatar(dataUrl as string);
                }}
              >
                Crop Image
              </Button>
            </>
          )}
          {crop && croppedImageUrl && (
            <>
              <Avatar className="w-32 h-32 border-2 border-primary/50 mt-5">
                <AvatarImage
                  src={croppedImageUrl as string}
                  alt={alt ?? "User's Image"}
                  className="object-center object-cover"
                />

                <AvatarFallback className="bg-gradient-accent text-foreground font-bold">
                  {(alt as string)
                    ? (alt as string)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : ""}
                </AvatarFallback>
              </Avatar>
              <Button
                className="mt-4 cursor-pointer"
                onClick={() => {
                  setCroppedImageUrl("");
                  updateAvatar("");
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
        </div>
      </div>
    </>
  );
}
