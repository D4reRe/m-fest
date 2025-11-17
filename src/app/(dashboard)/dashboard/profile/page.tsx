import ProfileFormSkeleton from "@/components/dashboard/profile/ProfileFormSkeleton";
import ProfileUpdateForm from "./profile-form";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Profile | Mechanical Festival 2026",
  description: "Profile to Mechanical Festival 2026",
};

export default function ProfilePage() {
  return (
    <section className="flex min-h-screen bg-transparent px-4 py-4 md:py-8 dark:bg-transparent">
      <div className="bg-transparent m-auto h-fit w-full max-w-7xl overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-transparent -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <h1 className="mb-1 mt-4 text-4xl font-bold text-start">
              My Profile
            </h1>
            <p className="text-base text-start text-muted-foreground">
              Please complete your profile below to able to register
              competitions and events!
            </p>
            <p className="text-base text-start text-muted-foreground ">
              Already complete your profile? You can upload your legal documents
              and other required data by{" "}
              <Link
                href="/dashboard/profile/documents"
                className="underline font-bold italic text-foreground"
                prefetch
              >
                go to this page.
              </Link>
            </p>
          </div>
          <Suspense fallback={<ProfileFormSkeleton />}>
            <ProfileUpdateForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
