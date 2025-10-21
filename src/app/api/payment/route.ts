import { auth } from "@/auth";
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

  const data = await snap.createTransaction(parameter);
  return NextResponse.json({ data }, { status: 200 });
}
