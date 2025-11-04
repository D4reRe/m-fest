"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
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
    <Table isStriped aria-label="" className="w-full bg-transparent mt-5">
      <TableHeader>
        <TableColumn>INVOICE ID</TableColumn>
        <TableColumn>AMOUNT</TableColumn>
        <TableColumn>COMPETITION</TableColumn>
        <TableColumn>TEAM</TableColumn>
        <TableColumn>INVOKED AT</TableColumn>
        <TableColumn>ACTION</TableColumn>
        <TableColumn>STATUS</TableColumn>
      </TableHeader>
      <TableBody emptyContent={<span>No invoices found</span>}>
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
                <Chip color="success">SUCCESS</Chip>
              ) : invoice.status === "PENDING" ? (
                <Chip color="warning">PENDING</Chip>
              ) : invoice.status === "PROCESS" ? (
                <Chip color="default">PROCESS</Chip>
              ) : (
                <Chip color="danger">CANCELLED</Chip>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
