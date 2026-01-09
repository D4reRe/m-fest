import { Skeleton } from "@/components/ui/skeleton";

export default function EssaySubmitFormSkeleton() {
  return (
    <main className="flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        {/* Header Section Skeleton */}
        <div className="mb-6 space-y-2">
          <Skeleton className="h-6 w-1/2" /> {/* Title */}
          <Skeleton className="h-4 w-3/4" /> {/* Subtitle */}
        </div>

        {/* Dropzone Area Skeleton */}
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-800/20">
          <Skeleton className="h-12 w-12 rounded-full mb-4" />{" "}
          {/* Icon circle */}
          <div className="space-y-2 w-full flex flex-col items-center">
            <Skeleton className="h-4 w-2/3" /> {/* Primary text line */}
            <Skeleton className="h-3 w-1/4" /> {/* Small constraint text */}
          </div>
        </div>

        {/* Action Button Skeletons */}
        <div className="mt-6 space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" /> {/* Primary Button */}
        </div>
      </div>
    </main>
  );
}
