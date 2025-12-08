import { Skeleton } from "@/components/ui/skeleton";

export default function CompetitionListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 items-stretch my-2">
      <Skeleton className="w-full max-w-7xl h-64 rounded-lg" />
      <Skeleton className="w-full max-w-7xl h-64 rounded-lg" />
      <Skeleton className="w-full max-w-7xl h-64 rounded-lg" />
      <Skeleton className="w-full max-w-7xl h-64 rounded-lg" />
    </div>
  );
}
