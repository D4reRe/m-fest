import { NextResponse } from "next/server";
import { getUserProfile } from "@/action/user.action";

export async function GET() {
  const user = await getUserProfile();
  if (!user) {
    console.log("User not found");
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  console.log("User found");
  return NextResponse.json(user, {
    status: 200,
  });
}
