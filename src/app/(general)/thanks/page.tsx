import { Button } from "@/components/ui/button";
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

  if (transaction_status === "pending") {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full gap-3">
        <h1 className="text-4xl font-bold">Payment is Pending</h1>
        <p className="text-xl flex flex-col items-center gap-5">
          <span>Please go to your invoices to pay</span>
          <Button
            variant={"outline"}
            className="hover:scale-105 hover:bg-white/25 transition-all cursor-pointer"
          >
            <Link href="/dashboard/invoices">Go to Invoices</Link>
          </Button>
        </p>
      </div>
    );
  } else if (transaction_status !== "settlement") {
    <div className="flex flex-col justify-center items-center h-screen w-full gap-3">
      <h1 className="text-4xl font-bold">
        Payment is{" "}
        {`${
          transaction_status.charAt(0).toUpperCase() +
          transaction_status.slice(1)
        }`}
      </h1>
      <p className="text-xl flex flex-col items-center gap-5">
        <span>
          Please try again by registering again or go to your invoices to see
          the details
        </span>
        <Button
          variant={"outline"}
          className="hover:scale-105 hover:bg-white/25 transition-all"
        >
          <Link href="/dashboard/invoices">Go to Invoices</Link>
        </Button>
      </p>
    </div>;
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
