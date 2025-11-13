import { Users } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function TeamFallback() {
  return (
    <div className="p-6 border-2 rounded-lg my-12 ">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-primary" />
        <div className="flex flex-col ">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 ml-2" />
              <Skeleton className="w-8 h-8 ml-2" />
            </div>
          </div>
          <h5 className="text-sm text-muted-foreground">
            <Skeleton className="h-4 w-16" />
          </h5>
        </div>
        <Skeleton className="h-4 w-16 ml-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="glass-sm p-4 flex flex-col items-center text-center">
          <Skeleton className="w-24 h-24 rounded-full border-2 border-primary/50" />
          <Skeleton className="h-3 w-12 mt-3" />
          <Skeleton className="h-3 w-32 mt-3" />
          <Skeleton className="h-4 w-16 rounded-full mt-3" />
        </div>
        <div className="glass-sm p-4 flex flex-col items-center text-center">
          <Skeleton className="w-24 h-24 rounded-full border-2 border-primary/50" />
          <Skeleton className="h-3 w-12 mt-3" />
          <Skeleton className="h-3 w-32 mt-3" />
          <Skeleton className="h-4 w-16 rounded-full mt-3" />
        </div>
        <div className="glass-sm p-4 flex flex-col items-center text-center">
          <Skeleton className="w-24 h-24 rounded-full border-2 border-primary/50" />
          <Skeleton className="h-3 w-12 mt-3" />
          <Skeleton className="h-3 w-32 mt-3" />
          <Skeleton className="h-4 w-16 rounded-full mt-3" />
        </div>
        <div className="glass-sm p-4 flex flex-col items-center text-center">
          <Skeleton className="w-24 h-24 rounded-full border-2 border-primary/50" />
          <Skeleton className="h-3 w-12 mt-3" />
          <Skeleton className="h-3 w-32 mt-3" />
          <Skeleton className="h-4 w-16 rounded-full mt-3" />
        </div>
        <div className="glass-sm p-4 flex flex-col items-center text-center">
          <Skeleton className="w-24 h-24 rounded-full border-2 border-primary/50" />
          <Skeleton className="h-3 w-12 mt-3" />
          <Skeleton className="h-3 w-32 mt-3" />
          <Skeleton className="h-4 w-16 rounded-full mt-3" />
        </div>
      </div>
    </div>
  );
}
