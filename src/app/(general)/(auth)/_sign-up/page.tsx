import { Button } from "@/components/ui/button";
import SignUpForm from "./sign-up";
import Image from "next/image";
import Link from "next/link";
import AuthButtons from "@/components/auth/auth-buttons";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Mechanical Festival 2026",
  description: "Sign Up to Mechanical Festival 2026",
};

async function SignUpPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link
              href="/"
              aria-label="go home"
              className="flex items-center gap-4 justify-center"
            >
              <Image
                src="/logo.svg"
                alt="Mechanical Festival 2026"
                width={60}
                height={60}
              />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">
              Create an Account
            </h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>
          <SignUpForm />
          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">
              Or continue With
            </span>
            <hr className="border-dashed" />
          </div>
          <AuthButtons />
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}

export default SignUpPage;
