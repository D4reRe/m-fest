import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: Request) {
  const payload = await req.json();

  const {
    order_id,
    transaction_status,
    signature_key,
    status_code,
    gross_amount,
    fraud_status,
  } = payload;

  // Verify signature received from Midtrans (from documentation must be SHA512
  //    with order_id + status_code + gross_amount + serverKey )
  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  if (expectedSignature !== signature_key && fraud_status !== "accept") {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }
  await prisma.payment.update({
    where: { orderId: order_id },
    data: {
      status: transaction_status,
      createdAt: new Date(),
    },
  });

  return NextResponse.json({ received: true });
}
