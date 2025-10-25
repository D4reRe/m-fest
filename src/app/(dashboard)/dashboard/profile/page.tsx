import ProfileUpdateForm from "./profile-form";
import React from "react";
import { Metadata } from "next";
import { getUserProfile } from "@/action/user.action";
import { User } from "@prisma/client";

export const metadata: Metadata = {
  title: "Profile | Mechanical Festival 2026",
  description: "Profile to Mechanical Festival 2026",
};

async function SignUpPage() {
  const user: User = (await getUserProfile()) as User;
  return (
    <section className="flex min-h-screen bg-transparent px-4 py-4 md:py-8 dark:bg-transparent">
      <div className="bg-transparent m-auto h-fit w-full max-w-5xl overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-transparent -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <h1 className="mb-1 mt-4 text-xl font-semibold text-start">
              My Profile
            </h1>
            <p className="text-sm text-start">
              Complete your profile below to able to register competitions and
              events!
            </p>
          </div>
          <ProfileUpdateForm user={user} />
        </div>
      </div>
    </section>
  );
}

export default SignUpPage;
