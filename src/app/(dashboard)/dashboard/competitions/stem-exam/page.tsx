import ExamClient from "@/app/(dashboard)/dashboard/competitions/stem-exam/exam";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "STEM Exam | Mechanical Festival 2026",
  description: "STEM Exam",
};

export default async function StemExamPage() {
  const sebKey = await headers().then((h) =>
    h.get("x-safeexambrowser-configkeyhash")
  );

  if (sebKey !== process.env.SEB_EXAM_KEY_HASH) {
    redirect("/use-seb");
  }
  return <ExamClient />;
}
