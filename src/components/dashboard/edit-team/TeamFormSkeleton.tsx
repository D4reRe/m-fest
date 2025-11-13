import { Skeleton } from "@/components/ui/skeleton";

export default function TeamFormSkeleton() {
  return (
    <section className="animate-pulse">
      <div className="mt-6 space-y-6 grid grid-cols-1 gap-3 lg:gap-5">
        {/* Team Name */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>

        {/* Team Members */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" /> {/* "Team Members" title */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-3 border p-3 rounded-lg bg-white/5">
              <Skeleton className="h-4 w-24 mb-3" /> {/* Member title */}
              {/* Member fields */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="w-full flex justify-center items-center mt-12">
        <Skeleton className="h-10 w-full max-w-lg" />
      </div>
    </section>
  );
}
