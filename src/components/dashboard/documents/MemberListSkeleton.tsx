import { Skeleton } from "@/components/ui/skeleton";

export default function MemberListSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 p-4 items-stretch my-2 ">
          <div className="p-6 border rounded-lg bg-white/5 hover:bg-white/10 transition-all flex w-fit gap-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="w-24 h-24 rounded-full border-2 border-primary/50" />
          </div>
          <div className="p-6 border rounded-lg bg-white/5 hover:bg-white/10 transition-all flex w-fit gap-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="w-24 h-24 rounded-full border-2 border-primary/50" />
          </div>
          <div className="p-6 border rounded-lg bg-white/5 hover:bg-white/10 transition-all flex w-fit gap-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="w-24 h-24 rounded-full border-2 border-primary/50" />
          </div>
        </div>
      </div>
    </>
  );
}
