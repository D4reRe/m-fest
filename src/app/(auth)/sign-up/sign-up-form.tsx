"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(1, "Fullname is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type registerSchema = z.infer<typeof registerSchema>;

function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerSchema>({ resolver: zodResolver(registerSchema) });
  const router = useRouter();

  async function onSubmit(formData: registerSchema) {
    setIsLoading(true);
    toast.loading("Signing up...", { id: "signing-up" });
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setIsLoading(false);
    if (res.ok) {
      toast.success("Signed up successfully");
      toast.dismiss("signing-up");
      router.replace("/login");
    } else {
      const err = await res.json();
      toast.error(err.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="block text-sm">
            Fullname
          </Label>
          <Input {...register("fullName")} placeholder="John Doe" />
          {errors.fullName && (
            <p className="text-destructive text-sm">
              {errors.fullName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="block text-sm">
          Email
        </Label>
        <Input {...register("email")} placeholder="johndoe@gmail.com" />
        {errors.email && (
          <p className="text-destructive text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
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

      <Button
        className={`w-full ${
          isLoading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? (
          <div className="flex gap-2">
            <span>Signing up...</span>
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          "Sign up"
        )}
      </Button>
    </form>
  );
}

export default SignUpForm;
