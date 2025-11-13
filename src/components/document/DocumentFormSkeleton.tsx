import { acceptedFiles } from "@/constants/constants";
import { Skeleton } from "../ui/skeleton";

export default function DocumentFormSkeleton() {
  return (
    <div className="flex flex-col gap-5 mt-5">
      <main className="border rounded-lg p-5">
        <div className="mb-6">
          <div className="mb-8 w-full flex max-sm:flex-col justify-between items-center  ">
            <Skeleton className="h-8 w-48 max-sm:mb-4" />
            <Skeleton className={`h-8 w-32 px-4 py-2 rounded-full border`} />
          </div>
          <h3 className="text-muted-foreground">Submission Detail</h3>
          <div className="flex justify-start gap-5 mt-2">
            <Skeleton className="h-4 w-screen max-w-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1">
          <Skeleton className="h-16 w-100" />
          <div className="mt-5">
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-64 w-128" />
          </div>

          <h3 className="mt-6 text-muted-foreground">
            Accepted File Types (Max 4MB):
          </h3>
          <p className="mt-2">{acceptedFiles.join(", ")}</p>

          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-4 w-48 mb-2 mt-4" />

              <Skeleton className="h-2 w-64 mt-1 mb-2" />
              <Skeleton className="h-4 w-24 mt-1" />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center items-center mt-5"></div>
      </main>
    </div>
  );
}
