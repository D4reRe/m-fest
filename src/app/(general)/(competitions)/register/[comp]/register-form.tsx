"use client";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { competitions } from "@/lib/competition";
import { CompRegistration, Team, TeamMember, User } from "@prisma/client";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { educations } from "@/lib/profile";

function RegisterForm({
  comp,
  user,
  teams,
  registeredCompetitions,
  teamMembers,
}: {
  comp: string;
  user: User;
  teams: Team[];
  registeredCompetitions: CompRegistration[];
  teamMembers: TeamMember[];
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const stemIsRegistered = registeredCompetitions.some(
    (competition) => competition.competitionName === "STEM"
  );
  if (stemIsRegistered && comp.toUpperCase() === "STEM") {
    return (
      <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8">
        <div className="text-center">
          <h1 className="mb-1 mt-2 text-xl font-semibold">
            You have already registered for STEM Competition
          </h1>
          <p className="text-sm">
            Please contact us if you want to change your registration
          </p>
        </div>
      </div>
    );
  }
  const registeredTeams = registeredCompetitions.map(
    (competition) => competition.teamId
  );
  console.log("Registered teams: ", registeredTeams);
  const availableTeams = teams.filter(
    (team) => !registeredTeams.includes(team.id)
  );
  const leaderTeams = availableTeams.filter((team) => {
    return teamMembers.some((member) => {
      return member.teamId === team.id && member.role === "Leader";
    });
  });

  console.log("Available teams: ", leaderTeams);

  if (!leaderTeams.length && comp.toUpperCase() !== "STEM") {
    return (
      <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8">
        <div className="text-center">
          <h1 className="mb-1 mt-2 text-xl font-semibold">
            You have already registered for all available teams or you are not a
            leader of any team.
          </h1>
          <p className="text-sm">
            Please contact us if you want to change your registration or create
            a new team as a leader to register for a competition.
          </p>
        </div>
      </div>
    );
  }

  const teamNames = leaderTeams.map((team) => team.name);
  const registerSchema = z.object({
    competitionName: z.enum(["BCC", "IPPC", "PDC"]),
    team: z.enum(teamNames as string[]),
  });
  type registerSchema = z.infer<typeof registerSchema>;

  const stemRegisterSchema = z.object({
    name: z.string().min(5),
    gender: z.enum(["Male", "Female"]),
    school: z.string().min(5),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    phoneNumber: z.string().regex(/^(\+?\d{9,15})$/, "Invalid phone number"),
    education: z.enum(["SMA", "SMK", "D3", "S1"]),
    mentor: z.string().min(5),
    competitionName: z.enum(["STEM"]),
  });

  type stemRegisterSchema = z.infer<typeof stemRegisterSchema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<registerSchema>({ resolver: zodResolver(registerSchema) });

  const {
    control: stemControl,
    handleSubmit: stemHandleSubmit,
    reset: stemReset,
    formState: { isSubmitting: stemIsSubmitting },
  } = useForm<stemRegisterSchema>({
    resolver: zodResolver(stemRegisterSchema),
  });

  useEffect(() => {
    if (user && comp.toUpperCase() === "STEM") {
      setTimeout(() => {
        stemReset({
          name: user?.name as string,
          email: user?.email as string,
          phoneNumber: user?.phoneNumber ?? "",
          gender: user?.gender ?? undefined,
          school: user?.institution ?? "",
          education: user?.education ?? undefined,
          competitionName: "STEM",
        });
      }, 500);
    }
  }, [stemReset, user, comp]);

  useEffect(() => {
    if (user && comp.toUpperCase() !== "STEM") {
      setTimeout(() => {
        // @ts-expect-error comp is string
        reset({
          competitionName: comp.toUpperCase(),
        });
      }, 500);
    }
  }, [reset, user, comp]);

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

  function generateFeeId(): string {
    const timestamp = Date.now().toString(36); // time in base36
    const randomPart = Math.random().toString(36).substring(2, 10); // random chars
    return `FEE-${timestamp}-${randomPart}`.toUpperCase();
  }

  const checkout = async (formData: registerSchema, comp: string) => {
    const submittedData = {
      competitionName: formData.competitionName,
      team: formData.team,
      userId: user.id,
      teamId: teams.find((team) => team.name === formData.team)?.id,
    };

    const checkOutData = {
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
      body: JSON.stringify(checkOutData),
    });
    const { transactionData } = await response.json();
    console.log(transactionData);
    console.log(transactionData.token);

    if (response.ok) {
      // @ts-expect-error snap global object
      window.snap.pay(transactionData.token, {
        onSuccess: async function (result) {
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              result,
              submittedData,
              transactionData,
              checkOutData,
            }),
          });
          toast.dismiss("checking-out");
          toast.success("Payment Successful!");
          console.log("Payment success:", result);
          toast.dismiss("register-team");
          toast.success("Team registered successfully!");
          router.replace("/dashboard/competitions");
        },
        onPending: async (result: any) => {
          toast.dismiss("checking-out");
          toast.info("Payment Pending. Please complete the transaction.");
          toast.dismiss("register-team");
          toast.info(
            "Please complete the transaction to complete the registration. "
          );
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              result,
              submittedData,
              transactionData,
              checkOutData,
            }),
          });
          console.log("Payment pending:", result);
          router.replace("/dashboard/invoices");
        },
        onError: (result: any) => {
          toast.dismiss("checking-out");
          toast.dismiss("register-team");
          toast.error("Payment Failed. Please try again.");
          console.log("Payment error:", result);
        },
        onClose: (result) => {
          toast.dismiss("checking-out");
          toast.warning("Payment window closed before completing transaction.");
          toast.dismiss("register-team");
          toast.warning("Your registration is not completed yet.");
          console.log("Payment popup closed.");
        },
      });
    }
    if (!response.ok) {
      setIsLoading(false);
      console.log(transactionData);
      toast.dismiss("checking-out");
      toast.error("Failed to checkout");
      const err = await response.json();
      toast.error(err.error);
      return;
    }
    setIsLoading(false);
  };
  const checkoutStem = async (formData: stemRegisterSchema, comp: string) => {
    const submittedData = {
      ...formData,
    };

    const checkOutData = {
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

    const response = await fetch("/api/payment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(checkOutData),
    });
    const { transactionData } = await response.json();
    console.log(transactionData);
    console.log(transactionData.token);

    if (response.ok) {
      // @ts-expect-error snap global object
      window.snap.pay(transactionData.token, {
        onSuccess: async function (result) {
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              result,
              submittedData,
              transactionData,
              checkOutData,
            }),
          });
          toast.dismiss("checking-out");
          toast.success("Payment Successful!");
          console.log("Payment success:", result);
          toast.dismiss("register-stem");
          toast.success("You have registered successfully!");
          router.replace("/dashboard/competitions");
        },
        onPending: async (result: any) => {
          toast.dismiss("checking-out");
          toast.info("Payment Pending. Please complete the transaction.");
          toast.dismiss("register-stem");
          toast.info(
            "Please complete the transaction to complete the registration. "
          );
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              result,
              submittedData,
              transactionData,
              checkOutData,
            }),
          });
          console.log("Payment pending:", result);
          router.replace("/dashboard/invoices");
        },
        onError: (result: any) => {
          toast.dismiss("checking-out");
          toast.dismiss("register-stem");
          toast.error("Payment Failed. Please try again.");
          console.log("Payment error:", result);
        },
        onClose: (result) => {
          toast.dismiss("checking-out");
          toast.warning("Payment window closed before completing transaction.");
          toast.dismiss("register-stem");
          toast.warning("Your registration is not completed yet.");
          console.log("Payment popup closed.");
        },
      });
    }
    if (!response.ok) {
      setIsLoading(false);
      console.log(transactionData);
      toast.dismiss("checking-out");
      toast.error("Failed to checkout");
      const err = await response.json();
      toast.error(err.error);
      return;
    }
    setIsLoading(false);
  };

  async function onSubmit(formData: registerSchema) {
    setIsLoading(true);
    toast.loading("Registering team...", { id: "register-team" });
    await checkout(formData, comp);
    setIsLoading(false);
  }
  async function stemOnSubmit(formData: stemRegisterSchema) {
    setIsLoading(true);
    toast.loading("Registering...", { id: "register-stem" });
    await checkoutStem(formData, comp);
    setIsLoading(false);
  }

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
        <h2 className="text-lg text-center mt-2">
          Fee:{" "}
          <span className="font-bold italic">
            Rp. {""}
            {
              competitions.find((c) => c.abbreviation === comp.toUpperCase())
                ?.fee1
            }
          </span>
        </h2>
      </div>
      {comp === "stem" ? (
        <form
          onSubmit={stemHandleSubmit(stemOnSubmit)}
          className="mt-6 space-y-6"
        >
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <Controller
                name="name"
                control={stemControl}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Fullname</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      defaultValue={(user.name as string) ?? ""}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Controller
              name="gender"
              control={stemControl}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-language">
                      Gender
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={(user.gender as string) ?? ""}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>
          </div>
          <div className="space-y-2">
            <Controller
              name="email"
              control={stemControl}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="phoneNumber"
              control={stemControl}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    defaultValue={(user.phoneNumber as string) ?? ""}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="education"
              control={stemControl}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-language">
                      Current Education
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={(user.education as string) ?? "SMA"}
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      aria-invalid={fieldState.invalid}
                      className="min-w-[120px]"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      {educations.map((education) => (
                        <SelectItem key={education.key} value={education.key}>
                          {education.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>
          </div>
          <div className="space-y-2">
            <Controller
              name="competitionName"
              control={stemControl}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Competition</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    defaultValue={"STEM"}
                    disabled
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="school"
              control={stemControl}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>School</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    defaultValue={(user.institution as string) ?? ""}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="mentor"
              control={stemControl}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Mentor</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Button
            className={`w-full ${
              isLoading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={stemIsSubmitting}
            type="submit"
          >
            {stemIsSubmitting ? (
              <div className="flex gap-2">
                <span>Registering...</span>
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-2">
              <Controller
                name="team"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="form-rhf-select-language">
                        Team
                      </FieldLabel>
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="form-rhf-select-language"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {leaderTeams.map((team) => (
                          <SelectItem key={team.id} value={team.name as string}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              ></Controller>
            </div>
          </div>
          <div className="space-y-2">
            <Controller
              name="competitionName"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-select-language">
                      Competition Name
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={comp.toUpperCase()}
                    disabled
                  >
                    <SelectTrigger
                      id="form-rhf-select-language"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="BCC">BCC</SelectItem>
                      <SelectItem value="IPPC">IPPC</SelectItem>
                      <SelectItem value="PDC">PDC</SelectItem>
                      <SelectItem value="STEM">STEM</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>
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
                <span>Registering...</span>
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

export default RegisterForm;
