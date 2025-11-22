import { auth } from "@/server/auth/auth";
import Image from "next/image";
import Link from "next/link";
import AuthButtons from "@/components/auth/auth-buttons";
import { Metadata } from "next";
import LoginErrorHandler from "./LoginErrorHandler";

export const metadata: Metadata = {
  title: "Login | Mechanical Festival 2026",
  description: "Login to Mechanical Festival 2026",
};

function LoginPage() {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <LoginErrorHandler />
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Image
                src="/logo.svg"
                alt="Mechanical Festival 2026"
                width={60}
                height={60}
              />
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Sign In</h1>
            <p className="text-sm">Welcome back! Sign in to continue</p>
          </div>
          {/* <LoginForm /> */}
          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-base">
              Continue With
            </span>
            <hr className="border-dashed" />
          </div>
          <AuthButtons />
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
