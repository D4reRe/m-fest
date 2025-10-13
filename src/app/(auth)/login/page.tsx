import LoginForm from "@/app/(auth)/login/login";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  return <LoginForm />;
}

export default LoginPage;
