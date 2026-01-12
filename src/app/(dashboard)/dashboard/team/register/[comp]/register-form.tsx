"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { competitions } from "@/lib/competition";
import { type RegisterFormProps, type TeamMember } from "@/types/types";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

function RegisterForm({
  comp,
  userTeams,
  userRegisteredCompetitions,
  allTeamsDatas,
  allRegisteredTeamDatas,
  allTeamMembersDatas,
  userAsLeaderTeams,
  teamNames,
  stemTeamNames,
}: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [teamInstitution, setTeamInstitution] = useState<string>("");
  const [teamName, setTeamName] = useState<string>("");
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: user, isFetched } = useQuery(
    trpc.dashboard.getUser.queryOptions()
  );
  const register = useMutation({
    ...trpc.register.registerTeam.mutationOptions(),
    onMutate: () => {
      setIsLoading(true);
      toast.loading("Registering team...", {
        id: "registering-team",
      });
    },
    onSuccess: () => {
      setIsLoading(false);
      toast.dismiss("registering-team");
      toast.success("Team registered successfully!");
    },
    onError: (error) => {
      setIsLoading(false);
      toast.dismiss("registering-team");
      toast.error("Failed to register team", {
        description: error.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getUser.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getUserRegisteredComp.queryKey({ comp }),
      });
      router.refresh();
      router.push("/dashboard/competitions");
    },
  });

  useEffect(() => {
    if (isFetched) {
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
  }, [isFetched, user, router]);

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
    teamName: z.enum(teamNames as string[], {
      error: "Team name is required",
    }),
    teamInstitution: z.string().min(5, "Team's institution is required"),
    paymentProofUrl: z
      .string()
      .min(1, "Please upload a payment proof") // Triggers if empty
      .url("Please provide a valid URL link"), // Triggers if format is wrong
  });
  type registerSchema = z.infer<typeof registerSchema>;

  const stemRegisterSchema = z.object({
    competitionName: z.enum(["STEM"]),
    leaderName: z.string().min(5, "Name must be leader's fullname"),
    leaderEmail: z
      .string()
      .email("Invalid email")
      .min(1, "Leader's email is required"),
    leaderPhoneNumber: z
      .string()
      .regex(/^(\+?\d{9,15})$/, "Invalid phone number"),
    teamName: z.enum(stemTeamNames as string[], {
      error: "Team name is required",
    }),
    teamInstitution: z.string().min(5, "Team's institution is required"),
    paymentProofUrl: z
      .string()
      .min(1, "Please provide a payment proof") // Triggers if empty
      .url("Please provide a valid URL link"), // Triggers if format is wrong
    mentor: z.string().min(1, "Mentor name is required"),
  });

  type stemRegisterSchema = z.infer<typeof stemRegisterSchema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    setError,
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
    formState: { isSubmitting: stemIsSubmitting, errors: stemErrors },
    setError: stemSetError,
  } = useForm<stemRegisterSchema>({
    resolver: zodResolver(stemRegisterSchema),
    defaultValues: {
      competitionName: "STEM",
      leaderName: user?.name as string,
      leaderEmail: user?.email as string,
      leaderPhoneNumber: user?.phoneNumber ?? "",
      teamInstitution: teamInstitution ?? "",
      teamName: teamName ?? "",
      mentor: "",
    },
  });

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
    if (user && comp.toUpperCase() === "STEM") {
      setTimeout(() => {
        stemReset({
          competitionName: "STEM",
          leaderName: user?.name as string,
          leaderEmail: user?.email as string,
          leaderPhoneNumber: user?.phoneNumber ?? "",
          teamInstitution: teamInstitution ?? "",
          teamName: teamName ?? "",
          mentor: "",
        });
      }, 500);
    }
  }, [stemReset, user, comp, teamInstitution, teamName]);

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
  if (!stemTeamNames.length && comp.toUpperCase() === "STEM") {
    return (
      <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8">
        <div className="text-center">
          <h1 className="mb-1 mt-2 text-xl font-semibold">
            You have already registered for all available teams or you are not a
            leader of any team or your team has more than 3 members.
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

  async function onSubmit(formData: registerSchema) {
    setIsLoading(true);
    toast.loading("Registering team...", { id: "register-team" });

    const selectedTeam = userTeams.find(
      (team) => team.name === formData.teamName
    );
    // console.log("Selected team: ", selectedTeam);
    if (!selectedTeam) {
      toast.dismiss("register-team");
      toast.error("Team not found");
      setIsLoading(false);
      return;
    }
    // @ts-expect-error members is exist based on schema and prisma calls
    const selectedTeamMembers = selectedTeam.members;

    const registeredTeamsMembersOnAnyComp = allTeamMembersDatas.filter(
      (member) =>
        allRegisteredTeamDatas.some((team) => team?.teamId === member.teamId)
    );
    // console.log(
    //   "Registered teams members on any comp: ",
    //   registeredTeamsMembersOnAnyComp
    // );

    const selectedTeamMembersEmails = selectedTeamMembers.map(
      (member: TeamMember) => member.email
    );
    // console.log("Selected team members emails: ", selectedTeamMembersEmails);

    const registeredTeamsMembersEmailsOnAnyComp =
      registeredTeamsMembersOnAnyComp.map((member) => member.email);

    // console.log(
    //   `Registered teams members emails : `,
    //   registeredTeamsMembersEmailsOnAnyComp
    // );

    const isTeamMemberRegisteredOnAnyComp = selectedTeamMembers.some(
      (member: TeamMember) => {
        return registeredTeamsMembersOnAnyComp.some(
          (registeredMember) => registeredMember.email === member.email
        );
      }
    );

    console.log(
      `Is one or more team member registered on any comp: `,
      isTeamMemberRegisteredOnAnyComp
    );

    if (isTeamMemberRegisteredOnAnyComp) {
      toast.dismiss("register-team");
      setIsLoading(false);
      toast.error(
        `One or more team members have already registered on competition`,
        {
          description: `Member ${selectedTeamMembersEmails
            .filter((email: string) =>
              registeredTeamsMembersEmailsOnAnyComp.includes(email)
            )
            .join(", ")} (${selectedTeamMembers
            .filter((member: TeamMember) =>
              registeredTeamsMembersEmailsOnAnyComp.includes(member.email)
            )
            .map((member: TeamMember) => member.name)
            .join(", ")})`,
        }
      );
      return;
    }

    register.mutate({
      competitionName: formData.competitionName,
      teamName: formData.teamName,
      userId: user?.id as string,
      teamId: userTeams.find((team) => team.name === formData.teamName)
        ?.id as string,
      leaderUserId: user?.id as string,
      leaderName: formData.leaderName,
      leaderEmail: formData.leaderEmail,
      leaderPhoneNumber: formData.leaderPhoneNumber,
      teamInstitution: formData.teamInstitution,
      paymentId: generateFeeId(),
      paymentFee: competitions.find(
        (competition) => competition.abbreviation === comp.toUpperCase()
      )?.fee1 as number,
      paymentProofUrl: formData.paymentProofUrl,
    });
    toast.dismiss("register-team");
    setIsLoading(false);
    return;
  }
  async function stemOnSubmit(formData: stemRegisterSchema) {
    setIsLoading(true);
    toast.loading("Registering team...", { id: "register-team" });

    const selectedTeam = userTeams.find(
      (team) => team.name === formData.teamName
    );
    // console.log("Selected team: ", selectedTeam);
    if (!selectedTeam) {
      toast.dismiss("register-team");
      toast.error("Team not found");
      setIsLoading(false);
      return;
    }
    // @ts-expect-error members is exist based on schema and prisma calls
    const selectedTeamMembers = selectedTeam.members;

    const registeredTeamsMembersOnAnyComp = allTeamMembersDatas.filter(
      (member) =>
        allRegisteredTeamDatas.some((team) => team?.teamId === member.teamId)
    );
    // console.log(
    //   "Registered teams members on any comp: ",
    //   registeredTeamsMembersOnAnyComp
    // );

    const selectedTeamMembersEmails = selectedTeamMembers.map(
      (member: TeamMember) => member.email
    );
    // console.log("Selected team members emails: ", selectedTeamMembersEmails);

    const registeredTeamsMembersEmailsOnAnyComp =
      registeredTeamsMembersOnAnyComp.map((member) => member.email);

    // console.log(
    //   `Registered teams members emails : `,
    //   registeredTeamsMembersEmailsOnAnyComp
    // );

    const isTeamMemberRegisteredOnAnyComp = selectedTeamMembers.some(
      (member: TeamMember) => {
        return registeredTeamsMembersOnAnyComp.some(
          (registeredMember) => registeredMember.email === member.email
        );
      }
    );

    console.log(
      `Is one or more team member registered on any comp: `,
      isTeamMemberRegisteredOnAnyComp
    );

    if (isTeamMemberRegisteredOnAnyComp) {
      toast.dismiss("register-team");
      setIsLoading(false);
      toast.error(
        `One or more team members have already registered on competition`,
        {
          description: `Member ${selectedTeamMembersEmails
            .filter((email: string) =>
              registeredTeamsMembersEmailsOnAnyComp.includes(email)
            )
            .join(", ")} (${selectedTeamMembers
            .filter((member: TeamMember) =>
              registeredTeamsMembersEmailsOnAnyComp.includes(member.email)
            )
            .map((member: TeamMember) => member.name)
            .join(", ")})`,
        }
      );
      return;
    }

    register.mutate({
      competitionName: formData.competitionName,
      teamName: formData.teamName,
      userId: user?.id as string,
      teamId: userTeams.find((team) => team.name === formData.teamName)
        ?.id as string,
      leaderUserId: user?.id as string,
      leaderName: formData.leaderName,
      leaderEmail: formData.leaderEmail,
      leaderPhoneNumber: formData.leaderPhoneNumber,
      teamInstitution: formData.teamInstitution,
      paymentId: generateFeeId(),
      paymentFee: competitions.find(
        (competition) => competition.abbreviation === comp.toUpperCase()
      )?.fee1 as number,
      paymentProofUrl: formData.paymentProofUrl,
      mentor: formData.mentor,
    });

    toast.dismiss("register-team");
    setIsLoading(false);
    return;
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
                name="teamName"
                control={stemControl}
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
                            ?.teamInstitution ?? ""
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
                        {stemTeamNames.map((teamName) => (
                          <SelectItem key={teamName} value={teamName as string}>
                            {teamName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[stemErrors.teamName]} />
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
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldContent>
                      <FieldLabel htmlFor="form-rhf">Mentor</FieldLabel>
                    </FieldContent>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[stemErrors.mentor]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Controller
              name="competitionName"
              control={stemControl}
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
                    <FieldError errors={[stemErrors.competitionName]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="leaderName"
              control={stemControl}
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
                    <FieldError errors={[stemErrors.leaderName]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="leaderEmail"
              control={stemControl}
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
                    <FieldError errors={[stemErrors.leaderEmail]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="leaderPhoneNumber"
              control={stemControl}
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
                    <FieldError errors={[stemErrors.leaderPhoneNumber]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="teamInstitution"
              control={stemControl}
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
                    <FieldError errors={[stemErrors.teamInstitution]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="paymentProofUrl"
              control={stemControl}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf">
                      Payment Proof Link
                    </FieldLabel>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Insert payment proof link here"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[stemErrors.paymentProofUrl]} />
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
                            ?.teamInstitution ?? ""
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
                        {teamNames.map((teamName) => (
                          <SelectItem key={teamName} value={teamName as string}>
                            {teamName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[errors.teamName]} />
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
                    <FieldError errors={[errors.competitionName]} />
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
                    <FieldError errors={[errors.leaderName]} />
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
                    <FieldError errors={[errors.leaderEmail]} />
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
                    <FieldError errors={[errors.leaderPhoneNumber]} />
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
                    <FieldError errors={[errors.teamInstitution]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="paymentProofUrl"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="responsive"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf">
                      Payment Proof Link
                    </FieldLabel>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Insert payment proof link here"
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
