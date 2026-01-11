import { Skeleton } from "@/components/ui/skeleton";

export function SubmitFormSkeleton() {
  return (
    <div className="max-w-sm w-full">
      {/* Title */}
      <div className="flex justify-center">
        <Skeleton className="h-6 w-32 mb-3" />
      </div>

      {/* Upload area */}
      <div className="w-80 h-60 rounded-lg bg-slate-700/45 flex justify-center items-center mb-3">
        <Skeleton className="h-40 w-72 rounded-md" />
      </div>

      {/* Submit button */}
      <Skeleton className="h-10 w-full mb-2" />

      {/* Submitted date text (NEW) */}
      <Skeleton className="h-4 w-40 mx-auto mb-2" />

      {/* Footer note */}
      <Skeleton className="h-4 w-56 mx-auto mt-2" />
    </div>
  );
}
