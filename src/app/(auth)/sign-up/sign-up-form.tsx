"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const registerSchema = z.object({
  fullname: z.string().min(1, "Fullname is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type registerSchema = z.infer<typeof registerSchema>;

function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerSchema>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(formData: registerSchema) {
    const res = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      toast.success("Signed up successfully");
    } else {
      const err = await res.json();
      toast.error(err.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-2">
          <Label htmlFor="fullname" className="block text-sm">
            Fullname
          </Label>
          <Input {...register("fullname")} placeholder="John Doe" />
          {errors.fullname && (
            <p className="text-destructive text-sm">
              {errors.fullname.message}
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

      <Button className="w-full cursor-pointer" type="submit">
        Sign Up
      </Button>
    </form>
  );
}

export default SignUpForm;
