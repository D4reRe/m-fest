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
import { User } from "@prisma/client";
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldDescription,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const profileSchema = z.object({
  teamName: z.string().min(8),
  members: z
    .array(
      z.object({
        name: z.string().min(5, "Name must be member's fullname"),
        email: z.string().email("Invalid email"),
        role: z.enum(["Leader", "Member"]),
      })
    )
    .min(3, "Minimum 3 members required")
    .max(5, "Maximum 5 members allowed"),
});

type profileSchema = z.infer<typeof profileSchema>;

function TeamForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<profileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      teamName: "",
      members: [
        {
          name: user?.name as string,
          email: user?.email as string,
          role: "Leader",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  async function onSubmit(formData: profileSchema) {
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
    // Debugging
    console.log({
      ...formData,
    });
    try {
      const res = await fetch("/api/create-team", {
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
          window.location.reload();
        }, 500);
        router.replace("/dashboard/team");
      } else {
        const { error, success } = await res.json();
        toast.dismiss("create-team");
        toast.error("Failed to create team", {
          description: error,
        });
        console.log(error);
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
                      <FieldLabel htmlFor={field.name}>Member Name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        readOnly={index === 0}
                        disabled={index === 0}
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
                      <FieldLabel htmlFor={field.name}>Member Email</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        readOnly={index === 0}
                        disabled={index === 0}
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
                      <FieldLabel htmlFor={field.name}>Member Role</FieldLabel>
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
                        append({ name: "", email: "", role: "Member" })
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
