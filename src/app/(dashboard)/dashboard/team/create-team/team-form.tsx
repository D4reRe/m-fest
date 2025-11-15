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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/lib/utils";

function TeamForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
  const teamSchema = z
    .object({
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
      teamName: "",
      members: [
        {
          name: user?.name as string,
          email: user?.email as string,
          institution: user?.institution as string,
          role: "Leader",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  async function onSubmit(formData: teamSchema) {
    setIsLoading(true);
    toast.loading("Creating team....", {
      id: "create-team",
    });
    if (formData.members.length < 3) {
      toast.dismiss("create-team");
      setIsLoading(false);
      toast.error("You must have at least 3 team members!");
      return;
    }
    if (formData.members.length > 5) {
      toast.dismiss("create-team");
      setIsLoading(false);
      toast.error("You cannot have more than 5 members!");
      return;
    }
    try {
      const res = await fetch("/api/team/create-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.teamName,
          userId: user?.id,
          email: user?.email,
          ...formData,
        }),
      });

      setIsLoading(false);

      if (res.ok) {
        toast.dismiss("create-team");
        toast.success("Team created successfully!");
        setTimeout(() => {
          router.refresh();
          router.replace("/dashboard/team");
        }, 500);
      } else {
        const { error, success } = await res.json();
        toast.dismiss("create-team");
        toast.error("Failed to create team", {
          description: error,
        });
        // console.log(error);
      }
    } catch (error) {
      setIsLoading(false);
      toast.dismiss("create-team");
      toast.error("Failed to create team", {
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
                                const userInstitution = user.institution;
                                toast.success(
                                  `${userName} is a registered member with email ${email}`
                                );

                                // Update value of the userName
                                const values = getValues();
                                values.members[index].name = userName;
                                values.members[index].institution =
                                  userInstitution;
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
                <span>Creating Team...</span>
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              "Create Team"
            )}
          </Button>
        </div>
      </section>
    </form>
  );
}

export default TeamForm;
