"use client";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { competitions } from "@/lib/competition";
import {
  RegisterFormProps,
  ResultTransaction,
  TeamMember,
} from "@/types/types";
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
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/lib/utils";

const stemRegisterSchema = z.object({
  name: z.string().min(5),
  gender: z.enum(["Male", "Female"]),
  school: z.string().min(5),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phoneNumber: z.string().regex(/^(\+?\d{9,15})$/, "Invalid phone number"),
  education: z.enum(["SMA", "SMK", "D3", "S1"]),
  mentor: z.string().min(1),
  competitionName: z.enum(["STEM"]),
});

type stemRegisterSchema = z.infer<typeof stemRegisterSchema>;

function RegisterForm({
  comp,
  teams: userTeams,
  registeredCompetitions: userRegisteredCompetitions,
  teamMembers: userTeamMembers,
  allTeamsDatas,
  allRegisteredTeamDatas,
  allTeamMembersDatas,
}: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [teamInstitution, setTeamInstitution] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const router = useRouter();
  const { data: user, isFetched: isFetchedUser } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    if (isFetchedUser) {
      if (
        !user?.gender ||
        !user?.phoneNumber ||
        !user?.domicile ||
        !user?.birthDate ||
        !user?.major ||
        !user?.institution ||
        !user?.education ||
        !user?.major ||
        !user?.semester
      ) {
        router.push("/dashboard/profile?notif=incomplete_profile");
      }
    }
  }, [isFetchedUser, user, router]);

  const userRegisteredTeams = userRegisteredCompetitions.map(
    (competition) => competition.teamId
  );
  console.log("Registered teams: ", userRegisteredTeams);
  const userAvailableTeams = userTeams.filter(
    (team) => !userRegisteredTeams.includes(team.id)
  );
  const userAsLeaderTeams = userAvailableTeams.filter((team) => {
    return userTeamMembers.some((member) => {
      return member.teamId === team.id && member.role === "Leader";
    });
  });

  const teamNames = userAsLeaderTeams.map((team) => team.name);

  const registerSchema = z.object({
    competitionName: z.enum(["BCC", "IPPC", "PDC"]),
    leaderName: z.string().min(5, "Name must be leader's fullname"),
    leaderEmail: z
      .string()
      .email("Invalid email")
      .min(1, "Leader's email is required"),
    leaderPhoneNumber: z
      .string()
      .regex(/^(\+?\d{9,15})$/, "Invalid phone number"),
    teamName: z.enum(teamNames as string[]),
    teamInstitution: z.string().min(5, "Team's institution is required"),
  });
  type registerSchema = z.infer<typeof registerSchema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<registerSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      competitionName:
        comp.toUpperCase() === "BCC"
          ? "BCC"
          : comp.toUpperCase() === "IPPC"
            ? "IPPC"
            : comp.toUpperCase() === "PDC"
              ? "PDC"
              : undefined,
      leaderName: user?.name as string,
      leaderEmail: user?.email as string,
      leaderPhoneNumber: user?.phoneNumber ?? "",
      teamInstitution: teamInstitution ?? "",
      teamName: teamName ?? "",
    },
  });

  const {
    control: stemControl,
    handleSubmit: stemHandleSubmit,
    reset: stemReset,
    formState: { isSubmitting: stemIsSubmitting },
  } = useForm<stemRegisterSchema>({
    resolver: zodResolver(stemRegisterSchema),
    defaultValues: {
      name: (user?.name as string) ?? "",
      gender: user?.gender ?? undefined,
      email: user?.email as string,
      phoneNumber: user?.phoneNumber ?? "",
      education: user?.education ?? undefined,
      competitionName: "STEM",
      school: user?.institution ?? "",
      mentor: "",
    },
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
        reset({
          competitionName:
            comp.toUpperCase() === "BCC"
              ? "BCC"
              : comp.toUpperCase() === "IPPC"
                ? "IPPC"
                : comp.toUpperCase() === "PDC"
                  ? "PDC"
                  : undefined,
          leaderName: user?.name as string,
          leaderEmail: user?.email as string,
          leaderPhoneNumber: user?.phoneNumber ?? "",
          teamInstitution: teamInstitution ?? "",
          teamName: teamName ?? "",
        });
      }, 500);
    }
  }, [reset, user, comp, teamInstitution, teamName]);

  useEffect(() => {
    const duitkuPopScript = "https://app-sandbox.duitku.com/lib/js/duitku.js";

    const script = document.createElement("script");
    script.src = duitkuPopScript;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const stemIsRegistered = userRegisteredCompetitions.some(
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

  // console.log("Available teams: ", userAsLeaderTeams);

  if (!userAsLeaderTeams.length && comp.toUpperCase() !== "STEM") {
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

  function generateFeeId(): string {
    const timestamp = Date.now().toString(36); // time in base36
    const randomPart = Math.random().toString(36).substring(2, 10); // random chars
    return `FEE-${timestamp}-${randomPart}`.toUpperCase();
  }

  const checkout = async (formData: registerSchema, comp: string) => {
    const submittedData = {
      competitionName: formData.competitionName,
      team: formData.teamName,
      userId: user?.id,
      teamId: userTeams.find((team) => team.name === formData.teamName)?.id,
    };

    const checkOutData = {
      paymentAmount: competitions.find(
        (c) => c.abbreviation === comp.toUpperCase()
      )?.fee1,
      merchantOrderId: generateFeeId(),
      productDetails: `${
        competitions.find((c) => c.abbreviation === comp.toUpperCase())?.title
      }`,
      email: user?.email,
      callbackUrl:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/api/payment/callback"
          : "https://m-fest-xi.vercel.app/api/payment/callback",

      returnUrl:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/payment/status"
          : "https://m-fest-xi.vercel.app/payment/status",
      expiryPeriod: 60,
      customerVaName: user?.name,
      phoneNumber: user?.phoneNumber,
      brand: "Mechanical Festival 2026",
      category: "Competition Registration Fee",
      merchant_name: "Himpunan Mahasiswa Mesin ITB",
      submittedData: submittedData,
      quantity: 1,
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
    const InvoiceData = await response.json();

    if (response.ok) {
      // @ts-expect-error snap global object
      window.checkout.process(InvoiceData.reference, {
        defaultLanguage: "en",
        successEvent: async function (result: ResultTransaction) {
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              result,
              submittedData,
              InvoiceData,
              checkOutData,
            }),
          });
          toast.dismiss("checking-out");
          // console.log("Payment success:", result);
          toast.success("Payment Successful!");
          toast.dismiss("register-team");
          toast.success("Your team have registered successfully!");
          router.replace("/dashboard/competitions");
        },
        pendingEvent: async (result: ResultTransaction) => {
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              result,
              submittedData,
              InvoiceData,
              checkOutData,
            }),
          });
          toast.dismiss("checking-out");
          // console.log("Payment pending:", result);
          toast.info("Payment Pending. Please complete the transaction.");
          toast.dismiss("register-team");
          toast.info(
            "Please complete the transaction to complete the registration. "
          );

          // console.log("Payment pending:", result);
          router.replace("/dashboard/invoices");
        },
        errorEvent: () => {
          toast.dismiss("checking-out");
          toast.dismiss("register-team");
          toast.error("Payment Failed. Please try again.");
          // console.log("Payment error:", result);
        },
        closeEvent: () => {
          toast.dismiss("checking-out");
          toast.warning("Payment window closed before completing transaction.");
          toast.dismiss("register-team");
          toast.warning("Your registration is not completed yet.");
          // console.log("Payment popup closed.");
        },
      });
    }
    if (!response.ok) {
      setIsLoading(false);
      toast.dismiss("checking-out");
      toast.error("Failed to checkout, please try again.");
      const err = await response.json();
      toast.error(err.error);
      return;
    }
    toast.dismiss("checking-out");
    setIsLoading(false);
  };
  const checkoutStem = async (formData: stemRegisterSchema, comp: string) => {
    const submittedData = {
      ...formData,
    };

    const checkOutData = {
      paymentAmount: competitions.find(
        (c) => c.abbreviation === comp.toUpperCase()
      )?.fee1,
      merchantOrderId: generateFeeId(),
      productDetails: `${
        competitions.find((c) => c.abbreviation === comp.toUpperCase())?.title
      }`,
      email: user?.email,
      callbackUrl:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/api/payment/callback"
          : "https://m-fest-xi.vercel.app/api/payment/callback",

      returnUrl:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/payment/status"
          : "https://m-fest-xi.vercel.app/payment/status",
      expiryPeriod: 60,
      customerVaName: user?.name,
      phoneNumber: user?.phoneNumber,
      brand: "Mechanical Festival 2026",
      category: "Competition Registration Fee",
      merchant_name: "Himpunan Mahasiswa Mesin ITB",
      submittedData: submittedData,
      quantity: 1,
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
    const InvoiceData = await response.json();

    if (response.ok) {
      // @ts-expect-error snap global object
      window.checkout.process(InvoiceData.reference, {
        defaultLanguage: "en",
        successEvent: async function (result: ResultTransaction) {
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              result,
              submittedData,
              InvoiceData,
              checkOutData,
            }),
          });
          toast.dismiss("checking-out");
          console.log("Payment success:", result);
          toast.success("Payment Successful!");
          toast.dismiss("register-stem");
          toast.success("You have registered successfully!");
          router.replace("/dashboard/competitions");
        },
        pendingEvent: async (result: ResultTransaction) => {
          await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              result,
              submittedData,
              InvoiceData,
              checkOutData,
            }),
          });
          toast.dismiss("checking-out");
          console.log("Payment pending:", result);
          toast.info("Payment Pending. Please complete the transaction.");
          toast.dismiss("register-stem");
          toast.info(
            "Please complete the transaction to complete the registration. "
          );

          // console.log("Payment pending:", result);
          router.replace("/dashboard/invoices");
        },
        errorEvent: () => {
          toast.dismiss("checking-out");
          toast.dismiss("register-stem");
          toast.error("Payment Failed. Please try again.");
        },
        closeEvent: () => {
          toast.dismiss("checking-out");
          toast.warning("Payment window closed before completing transaction.");
          toast.dismiss("register-stem");
          toast.warning("Your registration is not completed yet.");
          // console.log("Payment popup closed.");
        },
      });
    }
    if (!response.ok) {
      setIsLoading(false);
      toast.dismiss("checking-out");
      toast.error("Failed to checkout, please try again.");
      const err = await response.json();
      toast.error(err.error);
      return;
    }
    toast.dismiss("checking-out");
    setIsLoading(false);
  };

  async function onSubmit(formData: registerSchema) {
    setIsLoading(true);
    toast.loading("Registering team...", { id: "register-team" });

    const selectedTeam = userTeams.find(
      (team) => team.name === formData.teamName
    );
    console.log("Selected team: ", selectedTeam);
    if (!selectedTeam) {
      toast.dismiss("register-team");
      toast.error("Team not found");
      setIsLoading(false);
      return;
    }
    // @ts-expect-error members is exist based on schema and prisma calls
    const selectedTeamMembers = selectedTeam.members;
    console.log("Team members: ", selectedTeamMembers);

    const allRegisteredTeamIds = allRegisteredTeamDatas.map(
      (competition) => competition.teamId
    );

    const allTeamsIds = allTeamsDatas.map((team) => team.id);

    console.log("All registered competitions team Ids: ", allRegisteredTeamIds);
    console.log("All teams Ids: ", allTeamsIds);

    const registeredTeamsOnThisComp = allTeamsDatas.filter(
      (team) =>
        allRegisteredTeamIds.includes(team.id) &&
        team.competition === comp.toUpperCase()
    );
    console.log("Registered teams on this Comp: ", registeredTeamsOnThisComp);

    const registeredTeamsMembersOnThisComp = allTeamMembersDatas.filter(
      (member) =>
        registeredTeamsOnThisComp.some((team) => team.id === member.teamId)
    );
    console.log(
      "Registered teams members on this Comp: ",
      registeredTeamsMembersOnThisComp
    );

    const selectedTeamMembersEmails = selectedTeamMembers.map(
      (member: TeamMember) => member.email
    );
    console.log("Selected team members emails: ", selectedTeamMembersEmails);

    const registeredTeamsMembersEmailsOnThisComp =
      registeredTeamsMembersOnThisComp.map((member) => member.email);

    console.log(
      `Registered teams members emails : `,
      registeredTeamsMembersEmailsOnThisComp
    );

    const isTeamMemberRegisteredOnThisComp = selectedTeamMembers.some(
      (member: TeamMember) => {
        return registeredTeamsMembersOnThisComp.some(
          (registeredMember) => registeredMember.email === member.email
        );
      }
    );

    // console.log(
    //   `Is one or more team member registered on this ${comp.toUpperCase()} comp: `,
    //   isTeamMemberRegisteredOnThisComp
    // );

    if (isTeamMemberRegisteredOnThisComp) {
      toast.dismiss("register-team");
      setIsLoading(false);
      toast.error(
        `One or more team members have already registered for ${comp.toUpperCase()}`
      );
      return;
    }

    await checkout(formData, comp);
    setIsLoading(false);
    return;
  }
  async function stemOnSubmit(formData: stemRegisterSchema) {
    setIsLoading(true);
    toast.loading("Registering...", { id: "register-stem" });
    await checkoutStem(formData, comp);
    setIsLoading(false);
  }

  return (
    <>
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
                name="teamName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="form-rhf-select-language">
                        Team Name
                      </FieldLabel>
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setTeamName(value);
                        setTeamInstitution(
                          userTeams.find((team) => team.name === value)
                            ?.institution ?? ""
                        );
                      }}
                    >
                      <SelectTrigger
                        id="form-rhf-select-language"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {userAsLeaderTeams.map((team) => (
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
              />
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
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="leaderName"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf">Leader Name</FieldLabel>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled
                    readOnly
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
              name="leaderEmail"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf">Leader Email</FieldLabel>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled
                    readOnly
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
              name="leaderPhoneNumber"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf">
                      Leader Phone Number
                    </FieldLabel>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled
                    readOnly
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
              name="teamInstitution"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf">Team Institution</FieldLabel>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled
                    readOnly
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
    </>
  );
}

export default RegisterForm;
