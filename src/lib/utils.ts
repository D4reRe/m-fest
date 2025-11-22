import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getReturnUrl() {
  const returnUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/payment/status"
      : "https://m-fest-xi.vercel.app/payment/status";
  return returnUrl;
}
export function getCallbackUrl() {
  const callBackUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/payment/callback"
      : "https://m-fest-xi.vercel.app/api/payment/callback";
  return callBackUrl;
}
