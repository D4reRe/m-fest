import ProfileUpdateForm from "./profile-form";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Profile | Mechanical Festival 2026",
  description: "Profile to Mechanical Festival 2026",
};

async function SignUpPage() {
  const session = await auth();
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-8 md:py-16 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-xl overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <div className="flex items-center gap-4 justify-center">
              <Image
                src={session?.user.image as string}
                alt={session?.user.name as string}
                className="rounded-full object-cover"
                width={80}
                height={80}
              />
            </div>
            <h1 className="mb-1 mt-4 text-xl font-semibold">My Profile</h1>
            <p className="text-sm">
              Complete your profile below to register competitions!
            </p>
          </div>
          <ProfileUpdateForm />
        </div>
      </div>
    </section>
  );
}

export default SignUpPage;
