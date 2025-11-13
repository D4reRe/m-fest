import { Skeleton } from "@/components/ui/skeleton";

export function CompRegisterFormSkeleton() {
  return (
    <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
      {/* Header */}
      <div className="text-center flex flex-col items-center">
        <Skeleton className="h-32 w-32 rounded-full mb-4" />

        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-2" />
        <Skeleton className="h-5 w-40 mt-2" />
      </div>

      <div className="mt-6 space-y-6">
        {/* Fullname */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Education */}
        {/* <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full" />
        </div> */}

        {/* Competition */}
        {/* <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div> */}

        {/* School */}
        {/* <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div> */}

        {/* Mentor */}
        {/* <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div> */}

        {/* Button */}
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
