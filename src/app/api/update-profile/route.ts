import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    name,
    email,
    gender,
    phoneNumber,
    domicile,
    institution,
    major,
    education,
    semester,
    birthDate,
    imageUrl,
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
        gender,
        phoneNumber,
        domicile,
        institution,
        major,
        education,
        semester,
        birthDate,
        image: imageUrl,
      },
    });

    // console.log(updatedUser);
    return NextResponse.json({ success: true, updatedUser }, { status: 200 });
  } catch (error) {
    // console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong when updating profile",
        message: error,
      },
      { status: 500 }
    );
  }
}
