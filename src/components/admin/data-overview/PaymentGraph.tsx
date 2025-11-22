"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

export const description = "An interactive line chart for payments";

const chartConfig = {
  payments: {
    label: "Payments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function PaymentsChartLine() {
  const trpc = useTRPC();
  const { data: invoices } = useQuery(trpc.admin.getInvoices.queryOptions());
  const chartData =
    invoices?.map((invoice) => ({
      date: invoice.createdAt,
      payments: invoice.amount,
    })) ?? [];

  return (
    <Card className="py-4 sm:py-0 bg-transparent">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Total payments across time</CardTitle>
          <CardDescription>
            Showing total payments for the all of time
          </CardDescription>
        </div>
        <div className="flex">
          <div className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">
              Total (Rupiah)
            </span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              {invoices?.length
                ? invoices.reduce((acc, invoice) => acc + invoice.amount, 0)
                : "No payments data yet"}
            </span>
          </div>
          <div className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">
              Average (Rupiah)
            </span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              {invoices?.length
                ? (
                    invoices.reduce((acc, invoice) => acc + invoice.amount, 0) /
                    chartData.length
                  ).toFixed(3)
                : "No payments data yet"}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="payments"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey="payments"
              type="monotone"
              stroke={`var(--color-payments)`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
