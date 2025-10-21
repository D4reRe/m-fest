import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json();

  const { order_id, transaction_status } = payload;

  await prisma.payment.update({
    where: { orderId: order_id },
    data: { status: transaction_status },
  });

  return NextResponse.json({ received: true });
}
