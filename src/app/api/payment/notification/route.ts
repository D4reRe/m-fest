import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const payload = await req.json();

  const {
    order_id,
    transaction_status,
    signature_key,
    status_code,
    gross_amount,
  } = payload;

  // Verify signature received from Midtrans (from documentation must be SHA512
  //    with order_id + status_code + gross_amount + serverKey )
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  if (expectedSignature !== signature_key) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }

  const res = await fetch(
    `https://api.sandbox.midtrans.com/v2/${order_id}/status`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.MIDTRANS_SECRET_KEY}:`
        ).toString("base64")}`,
      },
    }
  );

  const result = await res.json();

  await prisma.payment.update({
    where: { orderId: result.order_id },
    data: {
      status: transaction_status,
      createdAt: new Date(),
    },
  });

  return NextResponse.json({ received: true });
}
