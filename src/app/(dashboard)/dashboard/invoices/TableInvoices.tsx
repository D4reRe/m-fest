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

export default function TableInvoices({ invoices }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function refreshPayment(
    invoiceId: string,
    token: string,
    redirectUrl: string
  ) {
    setIsLoading(true);
    const response = await fetch("/api/payment/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        result: {
          order_id: invoiceId,
          token: token,
          redirect_url: redirectUrl,
        },
      }),
    });
    if (response.ok) {
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
              {invoice.status === "settlement" ? (
                <span>Payment Successfull</span>
              ) : invoice.status === "pending" ? (
                <div className="flex items-center justify-between gap-3">
                  <Link
                    className="font-bold underline underline-offset-1"
                    href={invoice.redirectUrl as string}
                  >
                    Pay
                  </Link>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      refreshPayment(
                        invoice.orderId,
                        invoice.snapToken as string,
                        invoice.redirectUrl as string
                      )
                    }
                    disabled={isLoading}
                    className="size-6 hover:scale-105 transition-all"
                  >
                    {isLoading ? (
                      <IconRefresh className="animate-spin" />
                    ) : (
                      <RefreshCcw />
                    )}
                  </Button>
                </div>
              ) : (
                <span>Payment Expired</span>
              )}
            </TableCell>
            <TableCell>
              {invoice.status === "settlement" ? (
                <Chip color="success">Paid</Chip>
              ) : invoice.status === "pending" ? (
                <Chip color="warning">Pending</Chip>
              ) : (
                <Chip color="danger">Expired</Chip>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
