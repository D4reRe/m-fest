"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");
  const statusCode = searchParams.get("status_code");
  const transactionStatus = searchParams.get("transaction_status");
  const transactionId = searchParams.get("transaction_id");
  const paymentType = searchParams.get("payment_type");
  const grossAmount = searchParams.get("gross_amount");

  const message =
    transactionStatus === "deny"
      ? "Your payment was denied by the bank or payment gateway."
      : transactionStatus === "cancel"
      ? "You canceled the payment or it was not completed."
      : "An unexpected error occurred during your payment process.";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
      <h1 className="text-3xl font-semibold mb-2">Payment Failed</h1>
      <p className="text-foreground mb-6">{message}</p>

      <div className="w-full max-w-md p-4 border-2 rounded-lg shadow-md bg-transparent backdrop-blur-lg text-left space-y-2">
        {orderId && (
          <p>
            <strong>Order ID:</strong> {orderId}
          </p>
        )}
        {statusCode && (
          <p>
            <strong>Status Code:</strong> {statusCode}
          </p>
        )}
        {transactionStatus && (
          <p>
            <strong>Transaction Status:</strong> {transactionStatus}
          </p>
        )}
        {paymentType && (
          <p>
            <strong>Payment Type:</strong> {paymentType}
          </p>
        )}
        {grossAmount && (
          <p>
            <strong>Amount:</strong> Rp {grossAmount}
          </p>
        )}
        {transactionId && (
          <p>
            <strong>Transaction ID:</strong> {transactionId}
          </p>
        )}
      </div>

      <Link
        href="/dashboard"
        className="mt-6 inline-block bg-white/15 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
      >
        Back to Dashboard
      </Link>
    </main>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense
      fallback={<div className="flex justify-center p-10">Loading...</div>}
    >
      <PaymentErrorContent />
    </Suspense>
  );
}
