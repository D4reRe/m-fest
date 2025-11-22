import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(req: Request) {
  const payload = await req.json();
  console.log(payload);

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
