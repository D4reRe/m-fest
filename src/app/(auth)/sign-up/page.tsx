import SignUpForm from "@/app/(auth)/sign-up/sign-up";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

async function SignUpPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  return <SignUpForm />;
}

export default SignUpPage;
