import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{
    order_id: string;
    transaction_status: string;
    status_code: string;
  }>;
}) {
  const { transaction_status, order_id, status_code } = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

  if (transaction_status !== "settlement") {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-bold">Payment Failed</h1>
        <p className="text-sm flex flex-col justify-center">
          <span>
            Please try again by registering again or to your invoices to pay
          </span>
          <Link href="/dashboard/invoices">Go to Invoices</Link>
        </p>
      </div>
    );
  }

  const paymentData = await prisma.payment.findUnique({
    where: { orderId: order_id },
    select: { snapToken: true, redirectUrl: true },
  });
  console.log({
    searchParams: {
      transaction_status,
      order_id,
      status_code,
    },
    paymentData,
  });
  const response = await fetch(`${baseUrl}/api/payment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      result: {
        order_id: order_id,
        token: paymentData?.snapToken,
        redirect_url: paymentData?.redirectUrl,
      },
    }),
  });

  if (response.ok) {
    redirect("/dashboard/invoices");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-4xl font-bold">Your payment is successful!</h1>
    </div>
  );
}

export default ThanksPage;
