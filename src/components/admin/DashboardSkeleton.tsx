import { Skeleton } from "@/components/ui/skeleton";
import { PaymentsChartSkeleton } from "./sidebar/PaymentsChartSkeleton";

export function DashboardSkeleton() {
  return (
    <section>
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 flex flex-col border rounded-lg">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Revenue / Invoices */}
      <div className="w-full border rounded-lg p-6 flex justify-between mt-2">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-6 w-6 ml-2 rounded" />
          </div>
          <Skeleton className="h-8 w-52 mt-2" />
        </div>

        <div className="flex flex-col items-end">
          <Skeleton className="h-8 w-10" />
          <Skeleton className="h-4 w-36 mt-1" />
        </div>
      </div>

      {/* Chart Skeleton */}
      <div className="mt-3">
        <PaymentsChartSkeleton />
      </div>
    </section>
  );
}
