"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import UploadDocumentDialog from "@/components/document/UploadDocumentDialog";
import { User, Verification, Documents } from "@/types/types";

// all field should be filled of that type image Url
const documentsSchema = z.object({
  identityCard: z.string().min(1, "Identity Card photo is required to upload"),
  twibbon: z.string().min(1, "Twibbon photo is required to upload"),
  followIg: z.string().min(1, "Follow IG screenshot proof is required"),
  pDDikti: z.string().min(1, "PDDikti screeenshot proof is required to upload"),
});

type documentsSchema = z.infer<typeof documentsSchema>;

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

function DocumentsForm({
  user,
  documents,
  userDocuments,
}: {
  user: User;
  documents: Documents;
  userDocuments: Verification;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm<documentsSchema>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      identityCard: userDocuments?.IdentityCardImageUrl ?? "",
      twibbon: userDocuments?.twibbonImageUrl ?? "",
      followIg: userDocuments?.followIgImageUrl ?? "",
      pDDikti: userDocuments?.pDDiktiImageUrl ?? "",
    },
  });
  const router = useRouter();

  usePreventRefreshUserDuringUpload(isLoading);

  async function onSubmit(formData: documentsSchema) {
    console.log(formData);
    setIsLoading(true);
    toast.loading("Submitting file...", {
      id: "submitting-file",
    });
    // Send datas that contained image URLs uploadthing
    try {
      const res = await fetch("/api/submit-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userEmail: user.email,
          userId: user.id,
        }),
      });

      setIsLoading(false);

      if (res.ok) {
        toast.dismiss("submitting-file");
        toast.success("File submitted successfully!");
        setTimeout(() => {
          router.refresh();
        }, 500);
        // setTimeout(() => {
        //   router.refresh();
        //   window.location.reload();
        // }, 500);
      } else {
        toast.dismiss("submitting-file");
        const err = await res.json();
        toast.error("Failed to submit file", {
          description: err.message,
        });
        console.log(err.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.dismiss("submitting-file");
      toast.error("Failed to submit file", {
        description: (error as Error).message,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-5 mt-5">
        {documents.map((document) => {
          const { title, type, submissionDetail, id, acceptedFiles } = document;
          return (
            <main key={id} className="border rounded-lg p-5">
              <div className="mb-6">
                <div className="mb-8 w-full flex max-sm:flex-col justify-between items-center  ">
                  <h1 className="text-3xl max-sm:mb-4">{title}</h1>
                  <div
                    className={`px-4 py-2 rounded-full border bg-accent-foreground/10`}
                  >
                    {type === "identityCard" &&
                    userDocuments?.IdentityCardImageUrl &&
                    userDocuments.status === "PENDING" ? (
                      <p className="">
                        {userDocuments.IdentityCardVerified === false
                          ? "Pending"
                          : "Verified"}
                      </p>
                    ) : type === "twibbon" &&
                      userDocuments?.twibbonImageUrl &&
                      userDocuments.status === "PENDING" ? (
                      <p className="">
                        {userDocuments.twibbonVerified === false
                          ? "Pending"
                          : "Verified"}
                      </p>
                    ) : type === "followIg" &&
                      userDocuments?.followIgImageUrl &&
                      userDocuments.status === "PENDING" ? (
                      <p className="">
                        {userDocuments.followIgVerified === false
                          ? "Pending"
                          : "Verified"}
                      </p>
                    ) : type === "pDDikti" &&
                      userDocuments?.pDDiktiImageUrl &&
                      userDocuments.status === "PENDING" ? (
                      <p className="">
                        {userDocuments.pDDiktiVerified === false
                          ? "Pending"
                          : "Verified"}
                      </p>
                    ) : (
                      <p className="">Not Submitted</p>
                    )}
                  </div>
                </div>
                <h3 className="text-muted-foreground">Submission Detail</h3>
                <div className="flex justify-start gap-5">
                  <p>{submissionDetail}</p>
                </div>
              </div>
              <div className="grid grid-cols-1">
                {!userDocuments?.status && (
                  <UploadDocumentDialog
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    router={router}
                    id={id}
                    title={title}
                    user={user}
                    type={type}
                    uploadThingRoute={type}
                    setValue={setValue}
                  />
                )}
                {userDocuments?.status === "NOT_SUBMITTED" && (
                  <UploadDocumentDialog
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    router={router}
                    id={id}
                    title={title}
                    user={user}
                    type={type}
                    uploadThingRoute={type}
                    setValue={setValue}
                  />
                )}
                {userDocuments?.status === "PENDING" && (
                  <>
                    {type === "identityCard" &&
                    userDocuments?.IdentityCardImageUrl &&
                    userDocuments.IdentityCardStatus === "AWAITING_UPLOAD" ? (
                      <UploadDocumentDialog
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        router={router}
                        id={id}
                        title={title}
                        user={user}
                        type={type}
                        uploadThingRoute={type}
                        setValue={setValue}
                      />
                    ) : type === "twibbon" &&
                      userDocuments?.twibbonImageUrl &&
                      userDocuments.twibbonStatus === "AWAITING_UPLOAD" ? (
                      <UploadDocumentDialog
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        router={router}
                        id={id}
                        title={title}
                        user={user}
                        type={type}
                        uploadThingRoute={type}
                        setValue={setValue}
                      />
                    ) : type === "followIg" &&
                      userDocuments?.followIgImageUrl &&
                      userDocuments.followIgStatus === "AWAITING_UPLOAD" ? (
                      <UploadDocumentDialog
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        router={router}
                        id={id}
                        title={title}
                        user={user}
                        type={type}
                        uploadThingRoute={type}
                        setValue={setValue}
                      />
                    ) : type === "pDDikti" &&
                      userDocuments?.pDDiktiImageUrl &&
                      userDocuments.pDDiktiStatus === "AWAITING_UPLOAD" ? (
                      <UploadDocumentDialog
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        router={router}
                        id={id}
                        title={title}
                        user={user}
                        type={type}
                        uploadThingRoute={type}
                        setValue={setValue}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        You have already submitted your document. Please wait
                        for the verification process to complete.
                      </p>
                    )}
                  </>
                )}
                {userDocuments?.status === "ACCEPTED" && (
                  <p className="text-sm text-muted-foreground">
                    Your document have been verified. You can now register for
                    competitions.
                  </p>
                )}
                <div>
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
                          type="hidden"
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
                <div className="mt-5">
                  {title === "Identity Card" &&
                    userDocuments?.IdentityCardImageUrl && (
                      <>
                        <h1 className="mb-2 text-muted-foreground">
                          Preview uploaded image:
                        </h1>
                        <Image
                          src={userDocuments.IdentityCardImageUrl}
                          alt={title}
                          width={500}
                          height={500}
                          loading="lazy"
                        />
                      </>
                    )}
                  {title === "Twibbon" && userDocuments?.twibbonImageUrl && (
                    <>
                      <h1 className="mb-2 text-muted-foreground">
                        Preview uploaded image:
                      </h1>
                      <Image
                        src={userDocuments.twibbonImageUrl}
                        alt={title}
                        width={500}
                        height={500}
                        loading="lazy"
                      />
                    </>
                  )}
                  {title === "Follow Ig" && userDocuments?.followIgImageUrl && (
                    <>
                      <h1 className="mb-2 text-muted-foreground">
                        Preview uploaded image:
                      </h1>
                      <Image
                        src={userDocuments.followIgImageUrl}
                        alt={title}
                        width={500}
                        height={500}
                        loading="lazy"
                      />
                    </>
                  )}
                  {title === "PDDikti" && userDocuments?.pDDiktiImageUrl && (
                    <>
                      <h1 className="mb-2 text-muted-foreground">
                        Preview uploaded image:
                      </h1>
                      <Image
                        src={userDocuments.pDDiktiImageUrl}
                        alt={title}
                        width={500}
                        height={500}
                        loading="lazy"
                      />
                    </>
                  )}
                </div>

                <h3 className="mt-6 text-muted-foreground">
                  Accepted File Types (Max 4MB):
                </h3>
                <p className="mt-2">{acceptedFiles.join(", ")}</p>

                <div className="flex justify-between items-center">
                  {userDocuments?.IdentityCardImageUrl &&
                    title === "Identity Card" && (
                      <div>
                        <h1 className="mt-5 text-muted-foreground">
                          Uploaded file:
                        </h1>
                        <p className="text-sm">
                          Last uploaded:{" "}
                          {`${userDocuments.IdentityCardCreatedAt?.toDateString()} at ${userDocuments.IdentityCardCreatedAt?.toLocaleTimeString()}`}
                        </p>
                        <Link
                          href={userDocuments.IdentityCardImageUrl}
                          className="underline italic text-blue-400"
                          target="_blank"
                        >
                          View Uploaded File
                        </Link>
                      </div>
                    )}
                  {userDocuments?.twibbonImageUrl && title === "Twibbon" && (
                    <div>
                      <h1 className="mt-5 text-muted-foreground">
                        Uploaded file:
                      </h1>
                      <p className="text-sm">
                        Last uploaded:{" "}
                        {`${userDocuments.twibbonCreatedAt?.toDateString()} at ${userDocuments.twibbonCreatedAt?.toLocaleTimeString()}`}
                      </p>
                      <Link
                        href={userDocuments.twibbonImageUrl}
                        className="underline italic text-blue-400"
                        target="_blank"
                      >
                        View Uploaded File
                      </Link>
                    </div>
                  )}
                  {userDocuments?.followIgImageUrl && title === "Follow Ig" && (
                    <div>
                      <h1 className="mt-5 text-muted-foreground">
                        Uploaded file:
                      </h1>
                      <p className="text-sm">
                        Last uploaded:{" "}
                        {`${userDocuments.followIgCreatedAt?.toDateString()} at ${userDocuments.followIgCreatedAt?.toLocaleTimeString()}`}
                      </p>
                      <Link
                        href={userDocuments.followIgImageUrl}
                        className="underline italic text-blue-400"
                        target="_blank"
                      >
                        View Uploaded File
                      </Link>
                    </div>
                  )}
                  {userDocuments?.pDDiktiImageUrl && title === "PDDikti" && (
                    <div>
                      <h1 className="mt-5 text-muted-foreground">
                        Uploaded file:
                      </h1>
                      <p className="text-sm">
                        Last uploaded:{" "}
                        {`${userDocuments.pDDiktiCreatedAt?.toDateString()} at ${userDocuments.pDDiktiCreatedAt?.toLocaleTimeString()}`}
                      </p>
                      <Link
                        href={userDocuments.pDDiktiImageUrl}
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
        disabled={isSubmitting}
        className="cursor-pointer w-full mt-5"
        variant={"outline"}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}

export default DocumentsForm;
