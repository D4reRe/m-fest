"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DocumentFormSkeleton from "@/components/document/DocumentFormSkeleton";
import { useTRPC } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function UserDocuments({ userId }: { userId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: user, isFetched } = useQuery(
    trpc.dashboard.getUserById.queryOptions({ userId })
  );

  const {
    data,
    isLoading: isLoadingUserDocuments,
    isFetched: isFetchedUserDocuments,
  } = useQuery(trpc.dashboard.getDocumentsByUserId.queryOptions({ userId }));

  const approveAllDocuments = useMutation({
    ...trpc.admin.approveAllDocuments.mutationOptions(),
    onMutate: () => {
      setIsLoading(true);
      toast.loading("Updating user documents...", {
        id: "update-documents",
      });
    },

    onError: (error) => {
      setIsLoading(false);
      toast.dismiss("update-documents");
      toast.error("Failed to verify user documents", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess() {
      setIsLoading(false);

      toast.dismiss("update-documents");
      toast.success(`Documents verifed successfully for ${user?.name}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getUserById.queryKey({ userId }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getDocumentsByUserId.queryKey({ userId }),
      });
      router.refresh();
    },
  });
  const rejectAllDocuments = useMutation({
    ...trpc.admin.rejectAllDocuments.mutationOptions(),
    onMutate: () => {
      setIsLoading(true);
      toast.loading("Updating user documents...", {
        id: "update-documents",
      });
    },

    onError: (error) => {
      setIsLoading(false);
      toast.dismiss("update-documents");
      toast.error("Failed to unverify user documents", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess() {
      setIsLoading(false);

      toast.dismiss("update-documents");
      toast.success(`Documents unverifed successfully for ${user?.name}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getUserById.queryKey({ userId }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getDocumentsByUserId.queryKey({ userId }),
      });
      router.refresh();
    },
  });

  const approveDocumentByType = useMutation({
    ...trpc.admin.approveDocumentByType.mutationOptions(),
    onMutate: () => {
      setIsLoading(true);
      toast.loading("Updating user documents...", {
        id: "update-documents",
      });
    },

    onError: (error) => {
      setIsLoading(false);
      toast.dismiss("update-documents");
      toast.error("Failed to verify user document", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      setIsLoading(false);

      toast.dismiss("update-documents");
      toast.success(
        `Document ${variables.type} verifed successfully for ${user?.name}`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getUserById.queryKey({ userId }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getDocumentsByUserId.queryKey({ userId }),
      });
      router.refresh();
    },
  });
  const rejectDocumentByType = useMutation({
    ...trpc.admin.rejectDocumentByType.mutationOptions(),
    onMutate: () => {
      setIsLoading(true);
      toast.loading("Updating user documents...", {
        id: "update-documents",
      });
    },

    onError: (error) => {
      setIsLoading(false);
      toast.dismiss("update-documents");
      toast.error("Failed to unverify user document", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess(data, variables) {
      setIsLoading(false);

      toast.dismiss("update-documents");
      toast.success(
        `Document ${variables.type} unverifed successfully for ${user?.name}`
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getUserById.queryKey({ userId }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getDocumentsByUserId.queryKey({ userId }),
      });
      router.refresh();
    },
  });

  const approveUser = useMutation({
    ...trpc.admin.approveUser.mutationOptions(),
    onMutate: () => {
      setIsLoading(true);
      toast.loading("Updating user...", {
        id: "update-documents",
      });
    },

    onError: (error) => {
      setIsLoading(false);
      toast.dismiss("update-documents");
      toast.error("Failed to verify user", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess() {
      setIsLoading(false);
      toast.dismiss("update-documents");
      toast.success(`User ${user?.name} verified successfully`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getUserById.queryKey({ userId }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getDocumentsByUserId.queryKey({ userId }),
      });
      router.refresh();
    },
  });
  const rejectUser = useMutation({
    ...trpc.admin.rejectUser.mutationOptions(),
    onMutate: () => {
      setIsLoading(true);
      toast.loading("Updating user...", {
        id: "update-documents",
      });
    },

    onError: (error) => {
      setIsLoading(false);
      toast.dismiss("update-documents");
      toast.error("Failed to unverify user", {
        description: error.message,
      });
      console.log(error.message);
    },
    onSuccess() {
      setIsLoading(false);
      toast.dismiss("update-documents");
      toast.success(`User ${user?.name} unverified successfully`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getUserById.queryKey({ userId }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getDocumentsByUserId.queryKey({ userId }),
      });
      router.refresh();
    },
  });

  console.log(data);
  const documents = data?.documents;
  const userVerificationStatus = data?.status;

  if (isFetchedUserDocuments)
    queryClient.invalidateQueries({
      queryKey: trpc.dashboard.getDocumentsByUserId.queryKey({ userId }),
    });
  if (isLoadingUserDocuments) return <DocumentFormSkeleton />;

  return (
    <>
      <div className="flex flex-col gap-5 mt-5">
        <div className="flex gap-4 sm:gap-0 flex-col sm:flex-row justify-start sm:justify-between">
          <div className="w-full flex justify-start gap-2 items-center">
            <h2 className="text-xl font-bold">Verification Status</h2>
            <Badge variant={"secondary"}>
              {userVerificationStatus === "PENDING" ? (
                <p className="text-sm text-yellow-500">Pending</p>
              ) : userVerificationStatus === "ACCEPTED" ? (
                <p className="text-sm text-green-500">Verified</p>
              ) : (
                <p className="text-sm text-red-500">Not Submitted</p>
              )}
            </Badge>
          </div>
          <>
            {userVerificationStatus === "NOT_SUBMITTED" && (
              <Button
                type="submit"
                disabled
                className="cursor-pointer backdrop-blur-sm"
                variant={"outline"}
              >
                User has not submit the documents yet.
              </Button>
            )}
            {userVerificationStatus === "PENDING" && (
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer backdrop-blur-sm"
                variant={"outline"}
                onClick={() => approveAllDocuments.mutate({ userId })}
              >
                Approve All Documents
              </Button>
            )}
            {userVerificationStatus === "ACCEPTED" && (
              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer backdrop-blur-sm"
                variant={"outline"}
                onClick={() => rejectAllDocuments.mutate({ userId })}
              >
                Reject All Documents
              </Button>
            )}
          </>
        </div>
        {documents?.map((document) => {
          const { title, type, id } = document;
          return (
            <main key={id} className="border rounded-lg p-5 backdrop-blur-sm">
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
                <h3 className="text-muted-foreground">Document Detail</h3>
              </div>
              <div className="grid grid-cols-1">
                {document.status === "AWAITING_UPLOAD" ? (
                  <p className="text-sm text-muted-foreground">
                    This document is not submitted yet by the user.
                  </p>
                ) : document.status === "PENDING" ? (
                  <p className="text-sm text-yellow-500">
                    This document is in review
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
                <div className="mt-3 w-full max-w-2xl">
                  <Field>
                    <FieldLabel htmlFor={document.type} className="hidden">
                      {title}
                    </FieldLabel>
                    <Input
                      disabled
                      readOnly
                      defaultValue={document.imageUrl as string}
                      type="hidden"
                    />
                  </Field>
                </div>
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
                <div className="w-full max-w-sm flex justify-center sm:justify-start items-center mt-5">
                  {document.verified === false &&
                    document.status === "AWAITING_UPLOAD" && (
                      <Button
                        type="submit"
                        disabled
                        className="cursor-pointer w-full mt-5"
                        variant={"outline"}
                      >
                        User not submitted this document yet.
                      </Button>
                    )}
                  {document.verified === false &&
                    document.status === "PENDING" && (
                      <div className="flex flex-col justify-center gap-2 sm:flex-row sm:justify-start">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="cursor-pointer w-full mt-5"
                          variant={"outline"}
                          onClick={() =>
                            approveDocumentByType.mutate({ userId, type })
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="cursor-pointer w-full mt-5"
                          variant={"outline"}
                          onClick={() =>
                            rejectDocumentByType.mutate({ userId, type })
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  {document.verified === true && (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="cursor-pointer w-full mt-5"
                      variant={"outline"}
                      onClick={() =>
                        rejectDocumentByType.mutate({ userId, type })
                      }
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            </main>
          );
        })}
      </div>

      <>
        {" "}
        {userVerificationStatus === "NOT_SUBMITTED" && (
          <Button
            type="submit"
            disabled
            className="cursor-pointer w-full mt-5 backdrop-blur-sm"
            variant={"outline"}
          >
            User has not submit the documents yet.
          </Button>
        )}
        {userVerificationStatus === "PENDING" && (
          <Button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full mt-5 backdrop-blur-sm"
            variant={"outline"}
            onClick={() => approveUser.mutate({ userId })}
          >
            Approve User
          </Button>
        )}
        {userVerificationStatus === "ACCEPTED" && (
          <Button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer w-full mt-5 backdrop-blur-sm"
            variant={"outline"}
            onClick={() => rejectUser.mutate({ userId })}
          >
            Reject User
          </Button>
        )}
      </>
    </>
  );
}
