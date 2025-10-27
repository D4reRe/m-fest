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
  // with order_id + status_code + gross_amount + serverKey )

  // For debugging
  // console.log("Payload", payload);
  // console.log("order_id: ", order_id);
  // console.log("status_code: ", status_code);
  // console.log("gross_amount: ", gross_amount);
  const secretKey = process.env.MIDTRANS_SECRET_KEY as string;
  console.log("secretKey: ", secretKey);
  const expectedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + secretKey)
    .digest("hex");

  // For debugging
  // console.log("Signature Key: ", signature_key);
  // console.log("Expected Signature: ", expectedSignature);
  // console.log(
  //   "is Expected Signature not equal to Signature Key?: ",
  //   expectedSignature !== signature_key
  // );

  if (expectedSignature !== signature_key) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }

  await prisma.payment.update({
    where: { orderId: order_id },
    data: {
      status: transaction_status,
      createdAt: new Date(),
    },
  });

  await prisma.compRegistration.update({
    where: { paymentId: order_id },
    data: { statusOrder: transaction_status },
  });

  await prisma.team.update({
    where: {
      paymentId: order_id,
    },
    data: {
      status: transaction_status,
    },
  });

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
