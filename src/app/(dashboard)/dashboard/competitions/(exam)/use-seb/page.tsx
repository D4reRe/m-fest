export const metadata = {
  title: "SEB Required | Mechanical Festival 2026",
  description: "SEB Required",
};

export default function UseSEBWarningPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">SEB Required</h1>
      <p className="text-lg">
        Please use SEB to access exam page. You can download SEB from{" "}
        <a
          href="https://www.safeexambrowser.org/download"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          here
        </a>
        .
      </p>
      <p className="text-lg">
        You can also download SEB Config for exam from{" "}
        <a href="/api/exam-config" className="underline" download>
          here
        </a>
      </p>
    </div>
  );
}
