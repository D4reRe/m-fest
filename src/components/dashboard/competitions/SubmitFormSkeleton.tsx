import { Skeleton } from "@/components/ui/skeleton";

export function SubmitFormSkeleton() {
  return (
    <div className="max-w-sm w-full">
      {/* Title */}
      <Skeleton className="h-6 w-32 mb-3" />

      {/* Status */}
      <Skeleton className="h-5 w-24 mb-3" />

      {/* Upload area */}
      <div className="w-80 h-60 rounded-lg bg-slate-700/45 flex justify-center items-center mb-3">
        <Skeleton className="h-40 w-40 rounded-md" />
      </div>

      {/* Read-only URL input */}
      <Skeleton className="h-10 w-full mb-3" />

      {/* Progress bar */}
      {/* <Skeleton className="h-3 w-full rounded-full mb-3 hidden" /> */}

      {/* Upload button */}
      <Skeleton className="h-10 w-full mb-2" />

      {/* Submit button */}
      <Skeleton className="h-10 w-full mb-2" />

      {/* Submitted date text (NEW) */}
      <Skeleton className="h-4 w-40 mx-auto mb-2" />

      {/* Footer note */}
      <Skeleton className="h-4 w-56 mx-auto mt-2" />
    </div>
  );
}
