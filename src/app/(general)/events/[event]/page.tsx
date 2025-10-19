import EventForm from "./event-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ event: string }>;
}) {
  const event = (await params).event;
  return {
    title: `Register ${event.toUpperCase()} | Mechanical Festival 2026`,
    description: `Register for ${event.toUpperCase()} Event`,
  };
}

async function CompPage({ params }: { params: Promise<{ event: string }> }) {
  const { event } = await params;
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-muted m-auto h-fit w-full max-w-xl verflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]">
        <EventForm event={event} />
      </div>
    </section>
  );
}

export default CompPage;
