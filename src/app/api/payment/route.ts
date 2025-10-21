import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Snap } from "midtrans-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  const snap = new Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SECRET_KEY as string,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY as string,
  });
  const {
    id,
    competitionName,
    price,
    quantity,
    brand,
    category,
    merchant_name,
  } = await request.json();

  const parameter = {
    transaction_details: {
      order_id: id,
      gross_amount: price * quantity,
    },
    item_details: {
      id: id,
      name: competitionName,
      price: price,
      quantity: quantity,
      brand: brand,
      category: category,
      merchant_name: merchant_name,
    },
    customer_details: {
      name: session?.user.name,
      email: session?.user.email,
      phone: session?.user.phoneNumber,
      city: session?.user.domicile,
    },
  };

  const transactionData = await snap.createTransaction(parameter);

  await prisma.payment.create({
    data: {
      orderId: id,
      userId: session?.user.id,
      amount: price * quantity,
      competition: competitionName,
      redirectUrl: transactionData.redirect_url,
      snapToken: transactionData.token,
    },
  });
  console.log(transactionData);

  return NextResponse.json({ transactionData }, { status: 200 });
}
