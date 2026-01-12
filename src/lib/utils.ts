import { env } from "@/env";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getReturnUrl() {
  const returnUrl =
    process.env.NODE_ENV === "development"
      ? `${env.NEXT_PUBLIC_BASE_URL}/payment/status`
      : process.env.NODE_ENV === "production" &&
        env.NEXT_PUBLIC_BASE_URL.includes("vercel")
      ? `${env.NEXT_PUBLIC_BASE_URL}/payment/status`
      : `${env.NEXT_PUBLIC_BASE_URL}/payment/status`;
  return returnUrl;
}
export function getCallbackUrl() {
  const callBackUrl =
    process.env.NODE_ENV === "development"
      ? `${env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`
      : process.env.NODE_ENV === "production" &&
        env.NEXT_PUBLIC_BASE_URL.includes("vercel")
      ? `${env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`
      : `${env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`;
  return callBackUrl;
}
