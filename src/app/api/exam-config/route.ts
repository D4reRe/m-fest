import { env } from "@/env";
import { getSebConfig } from "@/lib/seb-config";
import { NextResponse } from "next/server";

export async function GET() {
  if (env.NODE_ENV === "development") {
    const sebConfig = getSebConfig();

    return new NextResponse(sebConfig, {
      headers: {
        "Content-Type": "application/seb",
        "Content-Disposition": "attachment; filename=stem-exam-dev.seb",
      },
    });
  }

  // if Node env is production
  const sebConfig = getSebConfig();

  return new NextResponse(sebConfig, {
    headers: {
      "Content-Type": "application/seb",
      "Content-Disposition": "attachment; filename=stem-exam.seb",
    },
  });
}
