"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
export default function LoginErrorHandler() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (!error) return;

    let errorMessage: string;
    const successMessage = "Signed in successfully";
    if (error === "OAuthAccountNotLinked") {
      errorMessage =
        "This email address is already associated with another login provider. Please use the same method you logged in with.";
    } else if (error !== "OAuthAccountNotLinked") {
      errorMessage = "Login Failed please try again.";
    }

    setTimeout(() => {
      if (error) toast.error(errorMessage);
      else if (!error) toast.success(successMessage);
    }, 500);
  }, [error]);

  return null;
}
