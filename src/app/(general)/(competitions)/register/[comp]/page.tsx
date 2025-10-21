import { auth } from "@/auth";
import RegisterForm from "./register-form";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ comp: string }>;
}) {
  const comp = (await params).comp;
  return {
    title: `Register ${comp.toUpperCase()} | Mechanical Festival 2026`,
    description: `Register for ${comp.toUpperCase()} Competition`,
  };
}

async function CompPage({ params }: { params: Promise<{ comp: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { comp } = await params;
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-xl verflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <RegisterForm comp={comp} />
      </div>
    </section>
  );
}

export default CompPage;
