"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { competitions } from "@/lib/competition";

const registerSchema = z.object({
  fullName: z.string().min(1, "Fullname is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type registerSchema = z.infer<typeof registerSchema>;

function RegisterForm({ comp }: { comp: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerSchema>({ resolver: zodResolver(registerSchema) });
  const router = useRouter();

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    const script = document.createElement("script");
    script.src = snapScript;
    script.async = true;
    script.setAttribute("data-client-key", clientKey as string);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  function generateFeeId(): string {
    const timestamp = Date.now().toString(36); // time in base36
    const randomPart = Math.random().toString(36).substring(2, 10); // random chars
    return `FEE-${timestamp}-${randomPart}`.toUpperCase();
  }

  const checkout = async () => {
    const data = {
      id: generateFeeId(),
      competitionName: `${
        competitions.find((c) => c.abbreviation === comp.toUpperCase())?.title
      }`,
      price: competitions.find((c) => c.abbreviation === comp.toUpperCase())
        ?.fee1,
      quantity: 1,
      brand: "Mechanical Festival 2026",
      category: "Competition Registration Fee",
      merchant_name: "Himpunan Mahasiswa Mesin ITB",
    };

    setIsLoading(true);
    toast.loading("Checking out...", { id: "checking-out" });

    const response = await fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const { transactionData: requestData } = await response.json();
    console.log(requestData);
    console.log(requestData.token);

    if (response.ok) {
      // @ts-expect-error snap global object
      // TODO: handle cases when user does successful payments, pending payments, and failed payments
      window.snap.pay(requestData.token, {
        onSuccess: async function (result) {
          toast.dismiss("checking-out");
          toast.success("Payment Successful!");
          console.log("Payment success:", result);

          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ result }),
          });

          router.replace("/dashboard/invoices");
        },
        onPending: async (result: any) => {
          toast.dismiss("checking-out");
          toast.info("Payment Pending. Please complete the transaction.");
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ result }),
          });
          console.log("Payment pending:", result);
          router.replace("/dashboard/invoices");
        },
        onError: async (result: any) => {
          toast.dismiss("checking-out");
          toast.error("Payment Failed. Please try again.");
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ result }),
          });
          console.log("Payment error:", result);
          router.replace("/dashboard/invoices");
        },
        onClose: async (result) => {
          toast.dismiss("checking-out");
          toast.warning("Payment window closed before completing.");
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ result }),
          });
          console.log("Payment popup closed.");
          router.replace("/dashboard/invoices");
        },
      });
    }
    if (!response.ok) {
      setIsLoading(false);
      console.log(requestData);
      toast.dismiss("checking-out");
      toast.error("Failed to checkout");
      return;
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
      <div className="text-center">
        <Link
          href="/"
          aria-label="go home"
          className="flex items-center gap-4 justify-center"
        >
          <Image
            src={`/competitions/logo/${comp}.png`}
            alt="Mechanical Festival 2026"
            width={150}
            height={150}
          />
        </Link>
        <h1 className="mb-1 mt-4 text-xl font-semibold">
          Register{" "}
          {
            competitions.find((c) => c.abbreviation === comp.toUpperCase())
              ?.title
          }
        </h1>
        <p className="text-sm">
          Please fill in the form below to register for {comp.toUpperCase()}
        </p>
      </div>
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
            <p className="text-destructive text-sm">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fee" className="text-sm">
            Fee :
            <span className="font-bold italic">
              Rp. {""}
              {
                competitions.find((c) => c.abbreviation === comp.toUpperCase())
                  ?.fee1
              }
            </span>
          </Label>
          <Button
            type="button"
            variant={"outline"}
            onClick={checkout}
            disabled={isLoading}
            className={`*:
          
          ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}
          `}
          >
            {isLoading ? (
              <div className="flex gap-2">
                <span>Checking out...</span>
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Checkout"
            )}
          </Button>
        </div>
        <Button
          className={`w-full ${
            isLoading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <div className="flex gap-2">
              <span>Submitting...</span>
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
}

export default RegisterForm;
