import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    name,
    email,
    phoneNumber,
    domicile,
    institution,
    education,
    semester,
    birthDate,
  } = await req.json();
  try {
    const authUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!authUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name,
        phoneNumber,
        domicile,
        institution,
        education,
        semester,
        birthDate,
      },
    });

    console.log(updatedUser);
    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", message: error },
      { status: 500 }
    );
  }
}
