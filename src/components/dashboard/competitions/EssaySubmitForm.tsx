"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useUploadThing } from "@/utils/uploadthing";
import { UploadThingError } from "uploadthing/server";
import { type Json } from "@uploadthing/shared";
import { useDropzone } from "@uploadthing/react";
import { Upload, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTRPC } from "@/utils/trpc";
import { Button } from "@heroui/react";
import EssaySubmitFormSkeleton from "./EssaySubmitFormSkeleton";

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

export default function SubmitExamForm({
  userId,
  essayAnswerFileUrl,
  essayAnswerFileKey,
  setEssayAnswerFileUrl,
  setEssayAnswerFileKey,
}: {
  userId: string;
  essayAnswerFileUrl: string | null;
  essayAnswerFileKey: string | null;
  setEssayAnswerFileUrl: Dispatch<SetStateAction<string | null>>;
  setEssayAnswerFileKey: Dispatch<SetStateAction<string | null>>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const isDragActive = false;
  usePreventRefreshUserDuringUpload(isUploading);
  const { data: user, isLoading: isLoadingUser } = useQuery(
    trpc.stemExam.getUserById.queryOptions({ userId })
  );

  const { startUpload } = useUploadThing("submitExam", {
    onBeforeUploadBegin(files) {
      setIsLoading(true);
      toast.loading(`Presigning URL for file...`, {
        id: "presigning-url",
      });
      return files;
    },
    onUploadBegin: (filename: string) => {
      toast.dismiss("presigning-url");
      setIsLoading(true);
      setIsUploading(true);
      toast.info(`Upload has begun for the file`, {
        description: `Uploading ${filename}`,
      });
    },
    onUploadProgress(p) {
      if (p === 0) {
        setProgress(p);
        toast.loading(`Uploading file...`, {
          id: "upload-document",
          description: `Starting upload...`,
        });
      }
      if (p < 100) {
        setProgress(p);
        toast.loading(`Uploading file...`, {
          id: "upload-document",
          description: `${p}%`,
        });
      }
      if (p === 100) {
        setProgress(p);
        toast.loading(`Uploading file...`, {
          id: "upload-document",
          description: `Finalizing upload...`,
        });
      }
    },
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      setIsLoading(false);
      toast.dismiss("upload-document");
      toast.success(`File uploaded successfully!`);
      setEssayAnswerFileUrl(res[0]?.ufsUrl as string);
      setEssayAnswerFileKey(res[0]?.key as string);
      setFileName(res[0]?.name as string);
      queryClient.invalidateQueries({
        queryKey: trpc.dashboard.getUserDocuments.queryKey(),
      });
      setFiles([]);
    },
    onUploadError: (e: UploadThingError<Json>) => {
      setIsUploading(false);
      setIsLoading(false);
      toast.dismiss("upload-document");
      toast.error(`Failed to upload file`, {
        description: e.message,
      });
    },
    uploadProgressGranularity: "fine",
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setEssayAnswerFileKey(null);
      setEssayAnswerFileUrl(null);
      setFileName(null);
      setProgress(0);
      if (acceptedFiles.length > 1) {
        toast.error("Only one file is allowed");
        return;
      }
      if (!acceptedFiles[0]?.type.startsWith("application/pdf")) {
        toast.error("Only PDF files are allowed");
        return;
      }
      if (
        !["pdf"].includes(
          acceptedFiles[0]?.type.split("/").pop()?.toLowerCase() as string
        )
      ) {
        toast.error("Supported types: .pdf");
        return;
      }
      if (acceptedFiles[0]?.size > 4 * 1024 * 1024) {
        toast.error("File size must be less than 4MB");
        return;
      }
      setFiles(acceptedFiles);
    },
    [setEssayAnswerFileKey, setEssayAnswerFileUrl]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  if (isLoadingUser) return <EssaySubmitFormSkeleton />;

  return (
    <main className="flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Upload Document
          </h2>
          <p className="text-sm text-slate-500">
            Please upload your essay in PDF format.{" "}
          </p>
          {essayAnswerFileUrl && (
            <p className="text-sm text-slate-500">
              {"File uploaded. You can submit your essay."}
            </p>
          )}
        </div>

        {!essayAnswerFileUrl && (
          <div
            {...getRootProps()}
            className={cn(
              "relative group cursor-pointer transition-all duration-200",
              "flex flex-col items-center justify-center p-8",
              "border-2 border-dashed rounded-xl",
              isDragActive
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
            )}
          >
            <input {...getInputProps()} />
            <div
              className={cn(
                "mb-4 p-3 rounded-full transition-colors",
                files.length > 0
                  ? "bg-green-100 text-green-600"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600"
              )}
            >
              {files.length > 0 ? (
                <FileText className="w-6 h-6" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <div className="text-center">
              {files.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200 uppercase tracking-wide">
                    Selected File
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[250px]">
                    {files[0]?.name}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                    Click to upload{" "}
                    <span className="text-slate-500 font-normal">
                      or drag and drop
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">PDF (max. 4MB)</p>
                </>
              )}
            </div>
          </div>
        )}

        {essayAnswerFileUrl && (
          <div
            {...getRootProps()}
            className={cn(
              "relative group cursor-pointer transition-all duration-200",
              "flex flex-col items-center justify-center p-8",
              "border-2 border-dashed rounded-xl",
              isDragActive
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
            )}
          >
            <input {...getInputProps()} />
            <div
              className={cn(
                "mb-4 p-3 rounded-full transition-colors bg-green-100 text-green-600"
              )}
            >
              <FileText className="w-6 h-6" />
            </div>

            <div className="text-center">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200 uppercase tracking-wide">
                  Uploaded File
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[250px]">
                  {fileName}
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  Click to upload again{" "}
                  <span className="text-slate-500 font-normal">
                    or drag and drop
                  </span>
                </p>
                <p className="text-xs text-slate-500 mt-1">PDF (max. 4MB)</p>
              </div>
            </div>
          </div>
        )}

        {(isLoading || isUploading) && (
          <div className="mt-6 space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center text-xs font-medium">
              <span className="text-slate-600 dark:text-slate-400">
                {progress === 100 ? "Processing..." : "Uploading..."}
              </span>
              <span className="text-blue-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Button
            onClick={() => startUpload(files)}
            isDisabled={isLoading || isUploading || !files.length}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-lg shadow-sm transition-transform active:scale-[0.98]"
          >
            {isUploading ? "Uploading..." : "Confirm and Upload"}
          </Button>

          {files.length > 0 && !isUploading && (
            <Button
              variant="ghost"
              onClick={() => {
                setFiles([]);
              }}
              className="w-full text-slate-500 hover:text-red-500"
            >
              Clear Selection
            </Button>
          )}
          {files.length > 0 && isUploading && isLoading && (
            <Button
              variant="ghost"
              onClick={() => {
                setFiles([]);
                setEssayAnswerFileUrl(null);
                setEssayAnswerFileKey(null);
                setIsLoading(false);
                setIsUploading(false);
              }}
              className="w-full text-slate-500 hover:text-red-500"
            >
              Cancel Upload
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
