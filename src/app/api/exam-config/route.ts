import { env } from "@/env";
import { getSebConfig } from "@/lib/seb-config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (env.NODE_ENV === "development") {
    const sebConfig = getSebConfig();

    return new NextResponse(sebConfig, {
      headers: {
        "Content-Type": "application/seb",
        "Content-Disposition": "attachment; filename=stem-exam-dev.seb",
      },
    });
  } else if (
    env.NODE_ENV === "production" &&
    req.nextUrl.origin.includes("vercel")
  ) {
    const sebConfig = getSebConfig();

    return new NextResponse(sebConfig, {
      headers: {
        "Content-Type": "application/seb",
        "Content-Disposition": "attachment; filename=stem-exam-vercel.seb",
      },
    });
  }

  const sebConfig = getSebConfig();

  return new NextResponse(sebConfig, {
    headers: {
      "Content-Type": "application/seb",
      "Content-Disposition": "attachment; filename=stem-exam.seb",
    },
  });
}
