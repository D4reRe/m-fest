import { type Crop } from "react-image-crop";

export function setCanvasPreview(
  image: HTMLImageElement, // HTMLImageElement
  canvas: HTMLCanvasElement, // HTMLCanvasElement
  crop: Crop // Pixel Crop
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2D context");
  }

  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";
  ctx.save();

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  // Move the crop origin to the canvas origin (0,0) and draw the entire image
  ctx.translate(-cropX, -cropY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}

export function setCanvasUpload(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: Crop
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2D context");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;
  ctx.translate(-cropX, -cropY);

  // Draw only the cropped region, not the entire image
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );
}
