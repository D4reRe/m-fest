"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type loginSchema = z.infer<typeof loginSchema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchema>({ resolver: zodResolver(loginSchema) });
  const router = useRouter();

  async function onSubmit(formData: loginSchema) {
    const auth = await signIn("credentials", {
      ...formData,
      redirect: false,
      callbackUrl: "/",
    });
    if (auth.ok) {
      toast.success("Logged in successfully!");
      router.replace("/");
    } else {
      toast.error("Logged in failed", {
        description: auth.error,
      });
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="block text-sm">
          Email
        </Label>
        <Input {...register("email")} placeholder="johndoe@gmail.com" />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="pwd" className="text-sm">
            Password
          </Label>
          {/* <Button asChild variant="link" size="sm">
            <Link href="#" className="link intent-info variant-ghost text-sm">
              Forgot your Password ?
            </Link>
          </Button> */}
        </div>
        <Input
          {...register("password")}
          placeholder="Your Password"
          className="input sz-md variant-mixed"
        />
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <Button className="w-full" type="submit">
        Sign In
      </Button>
    </form>
  );
}

export default LoginForm;
