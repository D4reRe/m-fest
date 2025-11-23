"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import UploadDocumentDialog from "@/components/document/UploadDocumentDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DocumentFormSkeleton from "@/components/document/DocumentFormSkeleton";
import { UploadThingRoute } from "@/types/types";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/utils/trpc";
import { documentsSchema } from "@/lib/schema";

function usePreventRefreshUserDuringUpload(isLoading: boolean) {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isLoading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isLoading]);
}

function DocumentsForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const trpc = useTRPC();
  const { data: user, isFetched } = useQuery(
    trpc.dashboard.getUser.queryOptions()
  );

  useEffect(() => {
    if (!user) return;
    const missing =
      !user.gender ||
      !user.phoneNumber ||
      !user.domicile ||
      !user.birthDate ||
      !user.major ||
      !user.institution ||
      !user.education ||
      !user.semester;
    if (missing) {
      router.push("/dashboard/profile?notif=incomplete_profile");
    }
  }, [isFetched, user, router]);

  const {
    data,
    isLoading: isLoadingUserDocuments,
    isFetched: isFetchedUserDocuments,
  } = useQuery(trpc.dashboard.getUserDocuments.queryOptions());
  const queryClient = useQueryClient();

  console.log(data);

  const documents = data?.documents;
  const userVerificationStatus = data?.status;

  const updateUserDocuments = useMutation({
    ...trpc.dashboard.submitDocuments.mutationOptions(),
    onMutate: () => {
      setIsLoading(true);
      toast.loading("Submitting file...", {
        id: "submitting-file",
      });
    },
    onSuccess: (data) => {
      setIsLoading(false);
      toast.dismiss("submitting-file");
      toast.success("File submitted successfully!", {
        description: data.message,
      });
    },
    onError(error) {
      setIsLoading(false);
      toast.dismiss("submitting-file");
      toast.error("Failed to submit file", {
        description: error.message,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getUserDocuments.queryKey(),
      });
      router.refresh();
    },
  });
  const { handleSubmit, control, setValue } = useForm<documentsSchema>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      identityCard:
        documents?.find((document) => document.type === "identityCard")
          ?.imageUrl ?? "",
      twibbon:
        documents?.find((document) => document.type === "twibbon")?.imageUrl ??
        "",
      followIg:
        documents?.find((document) => document.type === "followIg")?.imageUrl ??
        "",
    },
  });

  useEffect(() => {
    if (documents) {
      setValue(
        "identityCard",
        documents?.find((document) => document.type === "identityCard")
          ?.imageUrl ?? ""
      );
      setValue(
        "twibbon",
        documents?.find((document) => document.type === "twibbon")?.imageUrl ??
          ""
      );
      setValue(
        "followIg",
        documents?.find((document) => document.type === "followIg")?.imageUrl ??
          ""
      );
    }
  }, [documents, setValue]);

  usePreventRefreshUserDuringUpload(isLoading);

  if (isFetchedUserDocuments)
    queryClient.invalidateQueries({
      queryKey: trpc.dashboard.getUserDocuments.queryKey(),
    });
  if (isLoadingUserDocuments) return <DocumentFormSkeleton />;

  async function onSubmit(formData: documentsSchema) {
    updateUserDocuments.mutate(formData);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5 mt-5">
        {documents?.map((document) => {
          const {
            title,
            type,
            submissionDetail,
            id,
            acceptedFiles,
            uploadThingRoute,
          } = document;
          return (
            <main key={id} className="border rounded-lg p-5">
              <div className="mb-6">
                <div className="mb-8 w-full flex max-sm:flex-col justify-between items-center  ">
                  <h1 className="text-3xl max-sm:mb-4">{title}</h1>
                  <div
                    className={`px-4 py-2 rounded-full border bg-accent-foreground/10`}
                  >
                    {document.status === "AWAITING_UPLOAD" ? (
                      <p className="text-sm text-muted-foreground">
                        Not Submitted
                      </p>
                    ) : document.status === "PENDING" ? (
                      <p className="text-sm text-yellow-500">Pending</p>
                    ) : (
                      <p className="text-sm text-green-500">Verified</p>
                    )}
                  </div>
                </div>
                <h3 className="text-muted-foreground">Submission Detail</h3>
                <div className="flex justify-start gap-5">
                  <p>{submissionDetail}</p>
                </div>
              </div>
              <div className="grid grid-cols-1">
                {document.status === "AWAITING_UPLOAD" ? (
                  <UploadDocumentDialog
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    id={id}
                    title={title}
                    type={type as UploadThingRoute}
                    uploadThingRoute={uploadThingRoute as UploadThingRoute}
                    setValue={setValue}
                  />
                ) : document.status === "PENDING" ? (
                  <p className="text-sm text-yellow-500">
                    You have already submitted your document. Please wait for
                    the verification process to complete.
                  </p>
                ) : (
                  <p className="text-sm text-green-500">
                    This document have been verified.
                  </p>
                )}

                <div className="mt-5">
                  {document.imageUrl && (
                    <>
                      <h1 className="mb-2 text-muted-foreground">
                        Preview uploaded image:
                      </h1>
                      <Image
                        src={document.imageUrl}
                        alt={title}
                        width={500}
                        height={500}
                        loading="lazy"
                      />
                    </>
                  )}
                </div>
                <div className="mt-3">
                  <Controller
                    name={type}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name} className="hidden">
                          {title}
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          disabled
                          readOnly
                          // type="hidden"
                        />
                        {fieldState.invalid && (
                          <FieldError
                            errors={[fieldState.error]}
                            className="mt-2"
                          />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <h3 className="mt-6 text-muted-foreground">
                  Accepted File Types (Max 4MB):
                </h3>
                <p className="mt-2">{acceptedFiles.join(", ")}</p>

                <div className="flex justify-between items-center">
                  {document.imageUrl && (
                    <div>
                      <h1 className="mt-5 text-muted-foreground">
                        Uploaded file:
                      </h1>
                      <p className="text-sm">
                        Last uploaded:{" "}
                        <span>
                          {`${
                            document.createdAt
                              ? new Date(document.createdAt).toDateString()
                              : ""
                          } at ${
                            document.createdAt
                              ? new Date(
                                  document.createdAt
                                ).toLocaleTimeString()
                              : ""
                          }`}
                        </span>
                      </p>
                      <Link
                        href={document.imageUrl}
                        className="underline italic text-blue-400"
                        target="_blank"
                      >
                        View Uploaded File
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full flex justify-center items-center mt-5"></div>
            </main>
          );
        })}
      </div>
      <Button
        type="submit"
        disabled={isLoading || userVerificationStatus === "ACCEPTED"}
        className="cursor-pointer w-full mt-5"
        variant={"outline"}
      >
        {userVerificationStatus === "NOT_SUBMITTED"
          ? "Submit Documents"
          : userVerificationStatus === "PENDING"
            ? "Update Documents"
            : "Documents Verified"}
      </Button>
    </form>
  );
}

export default DocumentsForm;
