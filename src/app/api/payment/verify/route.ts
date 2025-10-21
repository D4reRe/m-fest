import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { result } = await request.json();

  const response = await fetch(
    `	https://api.sandbox.midtrans.com/v2/${result.order_id}/status`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.MIDTRANS_SECRET_KEY}:`
        ).toString("base64")}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to verify payment", message: response.statusText },
      { status: 500 }
    );
  }
  const status = await response.json();
  console.log(status);

  if (status.transaction_status === "settlement") {
    await prisma.payment.update({
      where: { orderId: result.order_id },
      data: { status: "settlement" },
    });
    return NextResponse.json({ status: "success" }, { status: 200 });
  } else {
    await prisma.payment.update({
      where: { orderId: result.order_id },
      data: { status: status.transaction_status, createdAt: new Date() },
    });
    return NextResponse.json({ status: "failed" }, { status: 500 });
  }
}
