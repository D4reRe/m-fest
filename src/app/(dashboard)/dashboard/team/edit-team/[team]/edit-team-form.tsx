"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Member, Team } from "@/types/types";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/lib/utils";

function TeamForm({ team }: { team: Team }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  const teamSchema = z
    .object({
      leaderName: z.string().min(5, "Name must be leader's fullname"),
      leaderEmail: z
        .string()
        .email("Invalid email")
        .min(1, "Leader's email is required"),
      leaderPhoneNumber: z
        .string()
        .regex(/^(\+?\d{9,15})$/, "Invalid phone number"),
      teamInstitution: z.string().min(5, "Team's institution is required"),
      teamName: z.string().min(1),
      members: z
        .array(
          z.object({
            name: z.string().min(5, "Name must be member's fullname"),
            email: z.string().email("Invalid email"),
            institution: z.string().min(5, "Institution is required"),
            role: z.enum(["Leader", "Member"]),
          })
        )
        .min(3, "Minimum 3 members required")
        .max(5, "Maximum 5 members allowed"),
    })
    .superRefine((data, context) => {
      const emails = data.members.map((member) =>
        member.email.toLowerCase().trim()
      );
      const members = data.members;
      const duplicates = emails.filter(
        (email, index) => emails.indexOf(email) !== index
      );
      const differentInstitutions = members
        .filter((member) => member.institution !== user?.institution)
        .map((member) => member.name);
      if (duplicates.length > 0) {
        toast.error(
          `Duplicate emails detected: ${[...new Set(duplicates)].join(", ")}`
        );
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate emails detected: ${[...new Set(duplicates)].join(
            ", "
          )}`,
          path: ["members"],
        });
      }
      if (differentInstitutions.length > 0) {
        toast.error(
          `Members from different Institutions detected: ${[
            ...new Set(differentInstitutions),
          ].join(", ")}`,
          {
            description: "All members must be from the same institution.",
          }
        );
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate Institutions detected: ${[
            ...new Set(duplicates),
          ].join(", ")}`,
          path: ["institutions"],
        });
      }
    });

  type teamSchema = z.infer<typeof teamSchema>;
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<teamSchema>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      leaderName: (user?.name as string) ?? "",
      leaderEmail: (user?.email as string) ?? "",
      leaderPhoneNumber: (user?.phoneNumber as string) ?? "",
      teamInstitution: (user?.institution as string) ?? "",
      teamName: (team.name as string) ?? "",
      members: [
        // @ts-expect-error members is exist if include members when prisma calls within Team Type
        ...team.members
          .sort((a: Member, b: Member) => (a.role === "Leader" ? -1 : 1))
          .map((member: Member) => {
            return {
              name:
                member.userId === user?.id
                  ? user?.name
                  : (member.name as string),
              email: member.email as string,
              institution: member.institution as string,
              userId: member.userId as string,
              role: member.role as "Leader" | "Member",
            };
          }),
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  async function onSubmit(formData: teamSchema) {
    setIsLoading(true);
    toast.loading("Editing team....", {
      id: "edit-team",
    });
    if (formData.members.length < 3) {
      toast.dismiss("edit-team");
      setIsLoading(false);
      toast.error("You must have at least 3 team members!");
      return;
    }
    if (formData.members.length > 5) {
      toast.dismiss("edit-team");
      setIsLoading(false);
      toast.error("You cannot have more than 5 members!");
      return;
    }

    try {
      const res = await fetch("/api/team/edit-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          teamId: team.id,
          ...formData,
        }),
      });

      setIsLoading(false);

      if (res.ok) {
        toast.dismiss("edit-team");
        toast.success("Team edited successfully!");
        setTimeout(() => {
          router.refresh();
          router.replace("/dashboard/team");
        }, 500);
      } else {
        const { error, success } = await res.json();
        toast.dismiss("edit-team");
        toast.error("Failed to edit team", {
          description: error,
        });
        // console.log(error);
      }
    } catch (error) {
      setIsLoading(false);
      toast.dismiss("edit-team");
      toast.error("Failed to edit team", {
        description: (error as Error).message,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <section>
        <div className="mt-6 space-y-6 grid grid-cols-1 gap-3 lg:gap-5">
          <div className="space-y-2">
            <Controller
              name="teamName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Team Name</FieldLabel>
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
                      <FieldLabel htmlFor="form-rhf">
                        Team Institution
                      </FieldLabel>
                    </FieldContent>
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
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Team Members</h3>
            {/* Index starts from 0 */}
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2 border p-3 rounded-lg">
                <h1 className="mb-5">Member {index + 1}</h1>
                <Controller
                  name={`members.${index}.name`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Member&apos;s Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        readOnly={index === 0}
                        disabled
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={`members.${index}.email`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Member&apos;s Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        readOnly={index === 0}
                        disabled={index === 0}
                        onBlur={async (event) => {
                          const email = event.target.value.trim();
                          if (email) {
                            try {
                              toast.loading("Checking user...", {
                                id: "checking-user",
                              });
                              const res = await fetch(
                                `/api/user/by-email?email=${email}`
                              );
                              const user = await res.json();

                              if (res.ok && user) {
                                toast.dismiss("checking-user");
                                const userName = user.name;
                                toast.success(
                                  `${userName} is a registered member with email ${email}`
                                );

                                // Update value of the members
                                const values = getValues();
                                values.members[index].name = userName;
                                values.members[index].institution =
                                  user.institution;
                                reset(values);
                              } else {
                                toast.dismiss("checking-user");
                                toast.error(
                                  `Email ${email} is not registered.`
                                );
                              }
                            } catch (error) {
                              toast.dismiss("checking-user");
                              toast.error("Failed to check user", {
                                description: (error as Error).message,
                              });
                            }
                          }
                        }}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={`members.${index}.institution`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Member&apos;s Institution
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        readOnly={index === 0}
                        disabled
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name={`members.${index}.role`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Member&apos;s Role
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        readOnly
                        disabled
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {errors.members?.message && (
                  <p className="text-destructive text-sm">
                    {errors.members.message as string}
                  </p>
                )}

                <div className="flex justify-between items-center w-full mt-5">
                  {fields.length < 5 && index === fields.length - 1 && (
                    <Button
                      type="button"
                      variant={"outline"}
                      onClick={() =>
                        append({
                          name: "",
                          email: "",
                          institution: "",
                          role: "Member",
                        })
                      }
                      className="cusor-pointer"
                    >
                      Add Member
                    </Button>
                  )}
                  {index !== 0 && index > 0 && (
                    <Button
                      type="button"
                      variant={"destructive"}
                      onClick={() => remove(index)}
                      className="cursor-pointer"
                    >
                      Remove Member
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-center items-center">
          <Button
            className={`w-full max-w-lg mt-12 border text-white bg-white/10 hover:bg-white/25 ${
              isLoading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={isSubmitting || fields.length < 3}
            type="submit"
          >
            {isSubmitting ? (
              <div className="flex gap-2">
                <span>Editing Team...</span>
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Edit Team"
            )}
          </Button>
        </div>
      </section>
    </form>
  );
}

export default TeamForm;
