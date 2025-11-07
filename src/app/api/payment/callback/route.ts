import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.text();
  console.log("Payload", body);
  const params = new URLSearchParams(body);
  console.log("URL Search Params", params);

  // console.log(payload);

  const merchantOrderId = params.get("merchantOrderId") as string;
  const merchantCode = params.get("merchantCode") as string;
  const resultCode = params.get("resultCode") as string;
  const amount = params.get("amount") as string;
  const signature = params.get("signature") as string;

  const payload = {
    merchantCode,
    merchantOrderId,
    amount,
    signature,
    resultCode,
  };

  // For debugging
  console.log("Payload", payload);
  console.log("merchantOrderId: ", merchantOrderId);
  console.log("merchantCode: ", merchantCode);
  console.log("amount: ", amount);
  console.log("resultCode: ", resultCode);
  console.log("signature: ", signature);
  const expectedSignature = crypto
    .createHash("md5")
    .update(
      `${merchantCode}${amount}${merchantOrderId}${process.env.DUITKU_API_KEY}`
    )
    .digest("hex");

  // For debugging
  console.log("Signature Key: ", signature);
  console.log("Expected Signature: ", expectedSignature);
  console.log(
    "is Expected Signature not equal to Signature Key?: ",
    expectedSignature !== signature
  );

  if (expectedSignature !== signature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }

  await prisma.payment.update({
    where: { orderId: merchantOrderId },
    data: {
      status: resultCode === "00" ? "SUCCESS" : "CANCELLED",
      createdAt: new Date(),
    },
  });

  await prisma.compRegistration.update({
    where: { paymentId: merchantOrderId },
    data: { statusOrder: resultCode === "00" ? "SUCCESS" : "CANCELLED" },
  });

  const thisOrderComp = await prisma.payment.findUnique({
    where: { orderId: merchantOrderId },
    select: { competition: true },
  });

  if (thisOrderComp?.competition !== "STEM Competition") {
    await prisma.team.update({
      where: {
        paymentId: merchantOrderId,
      },
      data: {
        status: resultCode === "00" ? "SUCCESS" : "CANCELLED",
      },
    });
  }
  return NextResponse.json({ message: "OK" }, { status: 200 });
}
