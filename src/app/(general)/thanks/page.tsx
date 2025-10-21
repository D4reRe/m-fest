import { prisma } from "@/lib/prisma";
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
  const { transaction_status, order_id } = await searchParams;
  if (transaction_status !== "settlement") {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-bold">
          Your payment is either pending or failed!
        </h1>
      </div>
    );
  }

  const paymentData = await prisma.payment.findUnique({
    where: { orderId: order_id },
    select: { snapToken: true, redirectUrl: true },
  });
  const response = await fetch("api/payment/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      result: {
        order_id,
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
