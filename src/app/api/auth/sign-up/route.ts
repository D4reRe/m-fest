import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { fullname, email, password } = await req.json();
  try {
    const existing = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        name: fullname,
        email,
        password: password_hash,
      },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", message: error },
      { status: 500 }
    );
  }
}
