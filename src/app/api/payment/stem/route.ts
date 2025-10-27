import { getUserProfile } from "@/action/user.action";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Snap } from "midtrans-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  const user = await getUserProfile();

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
    submittedData,
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
      name: user?.name,
      email: user?.email,
      phone: user?.phoneNumber,
      city: user?.domicile,
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

  const thisTransaction = await prisma.payment.findUnique({
    where: {
      orderId: id,
    },
    select: {
      orderId: true,
    },
  });

  const registerData = await prisma.compRegistration.create({
    data: {
      userId: user?.id as string,
      paymentId: thisTransaction?.orderId as string,
      competitionName: submittedData.competitionName,
      name: submittedData.name,
      gender: submittedData.gender,
      email: submittedData.email,
      phoneNumber: submittedData.phoneNumber,
      education: submittedData.education,
      school: submittedData.school,
      mentor: submittedData.mentor,
    },
  });

  console.log(transactionData);

  return NextResponse.json({ transactionData, registerData }, { status: 200 });
}
