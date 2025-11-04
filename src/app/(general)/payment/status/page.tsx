import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    merchantOrderId: string;
    reference: string;
    resultCode: string;
  }>;
}) {
  const { reference, merchantOrderId, resultCode } = await searchParams;
  if (!reference || !merchantOrderId || !resultCode) {
    redirect("/");
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
  const paymentData = await prisma.payment.findUnique({
    where: { orderId: merchantOrderId },
    select: { referenceDuitku: true, paymentUrl: true, competition: true },
  });
  if (!paymentData) {
    redirect("/");
  }
  // console.log({
  //   searchParams: {
  //     reference,
  //     merchantOrderId,
  //     resultCode,
  //   },
  //   paymentData,
  // });

  const response = await fetch(`${baseUrl}/api/payment/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      result: {
        merchantOrderId,
        referenceDuitku: paymentData?.referenceDuitku,
        paymentUrl: paymentData?.paymentUrl,
        competition: paymentData?.competition,
      },
    }),
  });

  if (response.ok) {
    // console.log("Payment has successfully check transaction");
  } else if (!response.ok) {
    // console.log("Payment has failed to check transaction");
  }

  const thisOrderIdData = await prisma.payment.findUnique({
    where: { orderId: merchantOrderId },
    select: { status: true, paymentUrl: true, competition: true },
  });

  // console.log(thisOrderIdData?.status);

  if (
    (thisOrderIdData?.status as unknown as string) === "PENDING" ||
    (thisOrderIdData?.status as unknown as string) === "PROCESS"
  ) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <h1 className="text-4xl font-bold">Your payment is pending!</h1>
        <div className="text-xl flex flex-col items-center gap-5">
          <span className="text-2xl">
            {merchantOrderId} - {thisOrderIdData?.competition}
          </span>
          <span>
            Please complete your payment to register by go to invoices page or
            click the button below.
          </span>
          <div className="flex gap-5">
            <Button
              variant={"outline"}
              className="hover:scale-105 hover:bg-white/25 transition-all"
            >
              <Link href="/dashboard/invoices">Go to Invoices</Link>
            </Button>
            <Button
              variant={"default"}
              className="hover:scale-105 transition-all"
            >
              <Link
                href={thisOrderIdData?.paymentUrl as string}
                target="_blank"
              >
                Pay
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  } else if ((thisOrderIdData?.status as unknown as string) === "CANCELLED") {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
        <span className="text-2xl">
          {merchantOrderId} - {thisOrderIdData?.competition}
        </span>
        <h1 className="text-4xl font-bold">Your payment is cancelled</h1>
        <div className="text-xl flex flex-col items-center gap-5">
          <span>Please try register again.</span>
          <div className="flex gap-5">
            <Button
              variant={"outline"}
              className="hover:scale-105 hover:bg-white/25 transition-all"
            >
              <Link href="/competitions">Competitions</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-3">
      <h1 className="text-4xl font-bold">Your payment is successful!</h1>
      <div className="text-xl flex flex-col items-center gap-5">
        <span className="text-2xl">
          {merchantOrderId} - {thisOrderIdData?.competition}
        </span>
        <span>Thank you for your participation!</span>
        <div className="flex gap-5">
          <Button
            variant={"outline"}
            className="hover:scale-105 hover:bg-white/25 transition-all"
          >
            <Link href="/dashboard/competitions">Go to Competitions</Link>
          </Button>
          <Button
            variant={"outline"}
            className="hover:scale-105 hover:bg-white/25 transition-all"
          >
            <Link href="/dashboard/invoices">Go to Invoices</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
