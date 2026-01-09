import { env } from "@/env";
import { getSebConfig } from "@/lib/seb-config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return new Response("Invalid token", { status: 400 });
  }

  if (env.NODE_ENV === "development") {
    const sebConfig = getSebConfig(token);

    return new NextResponse(sebConfig, {
      headers: {
        "Content-Type": "application/seb",
        "Content-Disposition": "attachment; filename=stem-exam-dev.seb",
      },
    });
  }

  // if Node env is production
  const sebConfig = getSebConfig(token);

  return new NextResponse(sebConfig, {
    headers: {
      "Content-Type": "application/seb",
      "Content-Disposition": "attachment; filename=stem-exam.seb",
    },
  });
}
