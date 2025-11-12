"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IconRefresh } from "@tabler/icons-react";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function TableInvoices({ invoices }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function refreshPayment(
    merchantOrderId: string,
    referenceDuitku: string,
    paymentUrl: string,
    competition: string
  ) {
    setIsLoading(true);
    toast.loading("Checking payment status...", {
      id: "check-status",
    });
    // console.log("Check from refresh payment", {
    //   merchantOrderId,
    //   referenceDuitku,
    //   paymentUrl,
    //   competition,
    // });
    try {
      const response = await fetch("/api/payment/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          result: {
            merchantOrderId,
            referenceDuitku: referenceDuitku,
            paymentUrl: paymentUrl,
            competition: competition,
          },
        }),
      });
      const res = await response.json();
      // console.log(res);
      // console.log(res.message);
      if (response.ok) {
        toast.success(res.message, {
          description: `Transaction ${merchantOrderId} for ${competition} is successfull`,
        });
        toast.dismiss("check-status");
        setIsLoading(false);
        router.refresh();
      } else {
        toast.dismiss("check-status");
        toast.info(res.message, {
          description: `Transaction ${merchantOrderId} for ${competition} is not paid yet`,
        });
        setIsLoading(false);
        router.refresh();
      }
    } catch (error) {
      toast.dismiss("check-status");
      toast.error("Failed to check payment status", {
        description: (error as Error).message,
      });
      setIsLoading(false);
      router.refresh();
    }
  }
  return (
    <Table aria-label="" className="w-full bg-transparent mt-5">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>INVOICE ID</TableHead>
          <TableHead>AMOUNT</TableHead>
          <TableHead>COMPETITION</TableHead>
          <TableHead>TEAM</TableHead>
          <TableHead>INVOKED AT</TableHead>
          <TableHead>ACTION</TableHead>
          <TableHead>STATUS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.orderId}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
            <TableCell>{invoice.competition}</TableCell>
            <TableCell>{invoice.team?.name ?? "Individual"}</TableCell>
            <TableCell>
              {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </TableCell>
            <TableCell>
              {invoice.status === "SUCCESS" ? (
                <span>Payment Successfull</span>
              ) : invoice.status === "PENDING" ? (
                <div className="flex items-center justify-between gap-3">
                  <Link
                    className="font-bold underline underline-offset-1 cursor-pointer"
                    href={invoice.paymentUrl as string}
                    target="_blank"
                  >
                    Pay
                  </Link>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      refreshPayment(
                        invoice.orderId,
                        invoice.referenceDuitku as string,
                        invoice.paymentUrl as string,
                        invoice.competition
                      )
                    }
                    disabled={isLoading}
                    className="size-6 hover:scale-105 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <IconRefresh className="animate-spin" />
                    ) : (
                      <RefreshCcw />
                    )}
                  </Button>
                </div>
              ) : invoice.status === "PROCESS" ? (
                <div className="flex items-center justify-between gap-3">
                  <Link
                    className="font-bold underline underline-offset-1 cursor-pointer"
                    href={invoice.paymentUrl as string}
                    target="_blank"
                  >
                    Pay
                  </Link>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      refreshPayment(
                        invoice.orderId,
                        invoice.referenceDuitku as string,
                        invoice.paymentUrl as string,
                        invoice.competition
                      )
                    }
                    disabled={isLoading}
                    className="size-6 hover:scale-105 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <IconRefresh className="animate-spin" />
                    ) : (
                      <RefreshCcw />
                    )}
                  </Button>
                </div>
              ) : (
                <span>Payment Cancelled</span>
              )}
            </TableCell>
            <TableCell>
              {invoice.status === "SUCCESS" ? (
                <Badge
                  variant={"secondary"}
                  className="bg-green-700 text-white"
                >
                  SUCCESS
                </Badge>
              ) : invoice.status === "PENDING" ? (
                <Badge className="text-white bg-yellow-500">PENDING</Badge>
              ) : invoice.status === "PROCESS" ? (
                <Badge className="text-white bg-blue-600">PROCESS</Badge>
              ) : (
                <Badge variant={"destructive"}>CANCELLED</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
