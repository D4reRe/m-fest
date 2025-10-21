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
import { RefreshCcw, RefreshCwOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TableInvoices({ invoices }: { invoices: any }) {
  const router = useRouter();
  async function refreshPayment(
    invoiceId: string,
    token: string,
    redirectUrl: string
  ) {
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
      router.refresh();
    }
  }
  return (
    <Table isStriped aria-label="" className="w-full bg-transparent mt-5">
      <TableHeader>
        <TableColumn>INVOICE ID</TableColumn>
        <TableColumn>AMOUNT</TableColumn>
        <TableColumn>COMPETITION</TableColumn>
        <TableColumn>INVOKED AT</TableColumn>
        <TableColumn>ACTION</TableColumn>
        <TableColumn>STATUS</TableColumn>
      </TableHeader>
      {/* <TableBody>
        <TableRow key="1">
          <TableCell>Tony Reichert</TableCell>
          <TableCell>CEO</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Something</TableCell>
          <TableCell>Dummy</TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell>Zoey Lang</TableCell>
          <TableCell>Technical Lead</TableCell>
          <TableCell>Paused</TableCell>
          <TableCell>Something</TableCell>
          <TableCell>Dummy</TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell>Jane Fisher</TableCell>
          <TableCell>Senior Developer</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Something</TableCell>
          <TableCell>Dummy</TableCell>
        </TableRow>
        <TableRow key="4">
          <TableCell>William Howard</TableCell>
          <TableCell>Community Manager</TableCell>
          <TableCell>Vacation</TableCell>
          <TableCell>Something</TableCell>
          <TableCell>Dummy</TableCell>
        </TableRow>
      </TableBody> */}
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.orderId}</TableCell>
            <TableCell>{invoice.amount}</TableCell>
            <TableCell>{invoice.competition}</TableCell>
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
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <Link
                    className="font-bold underline underline-offset-1"
                    href={invoice.redirectUrl}
                  >
                    Pay
                  </Link>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      refreshPayment(
                        invoice.orderId,
                        invoice.snapToken,
                        invoice.redirectUrl
                      )
                    }
                    className="size-6 hover:scale-105 transition-all"
                  >
                    <RefreshCcw />
                  </Button>
                </div>
              )}
            </TableCell>
            <TableCell>
              {invoice.status === "settlement" ? (
                <Chip color="success">Paid</Chip>
              ) : (
                <Chip color="warning">Pending</Chip>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
