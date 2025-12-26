import { db } from "@/server/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/env";

export async function POST(request: Request) {
    const { result } = await request.json();

    const response = await fetch(
        `	https://sandbox.duitku.com/webapi/api/merchant/transactionStatus`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                merchantCode: env.DUITKU_MERCHANT_ID,
                merchantOrderId: result.merchantOrderId,
                signature: crypto
                    .createHash("md5")
                    .update(
                        `${env.DUITKU_MERCHANT_ID}${result.merchantOrderId}${env.DUITKU_API_KEY}`,
                    )
                    .digest("hex"),
            }),
        },
    );

    if (!response.ok) {
        // console.log("Failed to check transaction to Duitku", response.statusText);
        return NextResponse.json(
            { message: "Failed to check transaction" },
            { status: 500 },
        );
    }
    const status = await response.json();
    if (!status) {
        // console.log("Failed to check transaction from Duitku", status);
        return NextResponse.json({
            message: "Failed to check transaction from Duitku",
        });
    }

    if (status.statusCode === "00") {
        await db.payment.update({
            where: { orderId: result.merchantOrderId },
            data: { status: "SUCCESS" },
        });
        await db.compRegistration.update({
            where: { paymentId: result.merchantOrderId },
            data: { statusOrder: "SUCCESS" },
        });
        await db.team.update({
            where: {
                paymentId: result.merchantOrderId,
            },
            data: {
                status: "SUCCESS",
                teamStatus: "PENDING",
                verificationDeadlineAt: new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
                ),
            },
        });
        // console.log("Payment has successfully check transaction");
        return NextResponse.json(
            {
                status: "success",
                message: "Your transaction status is successful",
            },
            { status: 200 },
        );
    } else {
        await db.payment.update({
            where: { orderId: result.merchantOrderId },
            data: { status: status.statusMessage, createdAt: new Date() },
        });
        await db.compRegistration.update({
            where: { paymentId: result.merchantOrderId },
            data: { statusOrder: status.statusMessage },
        });
        await db.team.update({
            where: {
                paymentId: result.merchantOrderId,
            },
            data: {
                status: status.statusMessage,
                teamStatus: "PENDING",
            },
        });
        // console.log("The transaction status is not successful", {
        //   status: status.statusMessage,
        // });
        return NextResponse.json(
            {
                status: "failed",
                message: `Transaction status is in ${status?.statusMessage?.toLowerCase()}`,
            },
            { status: 500 },
        );
    }
}
