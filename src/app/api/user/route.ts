import { NextResponse } from "next/server";
import { getUserProfile } from "@/action/user.action";

export async function GET() {
  const user = await getUserProfile();
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user, {
    status: 200,
  });
}
