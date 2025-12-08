import { Skeleton } from "@/components/ui/skeleton";

export default function MemberListSkeleton() {
  return (
    <>
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="w-full">
        <div className="grid max-xs:grid-cols-1 xs:grid-cols-2 max-xxl:grid-cols-2 xxl:grid-cols-3 gap-16 items-stretch my-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              className="p-6 border rounded-lg bg-white/5 w-fit h-fit"
              key={index}
            >
              {/* Desktop */}
              <div className="flex w-fit gap-6 items-center max-[1160px]:hidden min-[1160px]:flex-row">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" /> {/* role */}
                  <Skeleton className="h-5 w-40" /> {/* name */}
                  <Skeleton className="h-4 w-40" /> {/* email */}
                  <Skeleton className="h-8 w-32 mt-3" /> {/* button */}
                </div>

                <div className="flex flex-col items-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-3" />{" "}
                  {/* avatar */}
                  <Skeleton className="h-6 w-20" /> {/* badge */}
                </div>
              </div>

              {/* Mobile */}
              <div className="flex w-fit gap-6 items-center max-[1160px]:flex-col-reverse min-[1160px]:hidden">
                <div className="flex flex-col gap-2 items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-8 w-32 mt-3" />
                </div>

                <div className="flex flex-col items-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-3" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
