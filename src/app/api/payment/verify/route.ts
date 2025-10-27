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
  if (!status) {
    return NextResponse.json({
      error: "Failed to verify payment",
      message: "No status returned",
    });
  }

  if (status.transaction_status === "settlement") {
    await prisma.payment.update({
      where: { orderId: result.order_id },
      data: { status: "settlement" },
    });
    await prisma.compRegistration.update({
      where: { paymentId: result.order_id },
      data: { statusOrder: "settlement" },
    });
    await prisma.team.update({
      where: {
        paymentId: result.order_id,
      },
      data: {
        status: "settlement",
      },
    });
    return NextResponse.json(
      { status: "success", message: "Payment Successful" },
      { status: 200 }
    );
  } else {
    await prisma.payment.update({
      where: { orderId: result.order_id },
      data: { status: status.transaction_status, createdAt: new Date() },
    });
    await prisma.compRegistration.update({
      where: { paymentId: result.order_id },
      data: { statusOrder: status.transaction_status },
    });
    await prisma.team.update({
      where: {
        paymentId: result.order_id,
      },
      data: {
        status: status.transaction_status,
      },
    });
  }
}
