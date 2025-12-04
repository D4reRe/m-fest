import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <main className="relative z-10">
        <div className="border-b border-border/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-4xl font-bold text-foreground">User Details</h1>
            <p className="text-muted-foreground mt-1">Data Overview</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <Suspense
              fallback={
                <div>
                  Loading...
                  <Loader2 className="animate-spin w-4 h-4" />
                </div>
              }
            >
              <FetchUser params={params} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
async function FetchUser({ params }: { params: Promise<{ userId: string }> }) {
  const { userId: userIdParam } = await params;
  return <div>{userIdParam}</div>;
}
