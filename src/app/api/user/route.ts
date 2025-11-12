import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getUserProfile } from "@/action/user.action";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserProfile();
  return NextResponse.json(user);
}
