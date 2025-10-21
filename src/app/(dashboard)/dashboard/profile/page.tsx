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
    <section className="flex min-h-screen bg-transparent px-4 py-4 md:py-8 dark:bg-transparent">
      <div className="bg-transparent m-auto h-fit w-full max-w-7xl overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-transparent -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <div className="flex items-center gap-4 justify-start">
              <Image
                src={session?.user.image as string}
                alt={session?.user.name as string}
                className="rounded-full object-cover"
                width={80}
                height={80}
              />
            </div>
            <h1 className="mb-1 mt-4 text-xl font-semibold text-start">
              My Profile
            </h1>
            <p className="text-sm text-start">
              Complete your profile below to able to register competitions and
              events!
            </p>
          </div>
          <ProfileUpdateForm />
        </div>
      </div>
    </section>
  );
}

export default SignUpPage;
