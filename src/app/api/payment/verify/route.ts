import { getUserProfile } from "@/action/user.action";
import { env } from "@/env";
import { db } from "@/server/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

enum CompetitionName {
  BCC = "BCC",
  IPPC = "IPPC",
  PDC = "PDC",
  STEM = "STEM",
}

export async function POST(request: Request) {
  const user = await getUserProfile();
  const { result, submittedData, InvoiceData, checkOutData } =
    await request.json();
  const { merchantOrderId, productDetails, paymentAmount, quantity } =
    checkOutData;

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
            `${env.DUITKU_MERCHANT_ID}${result.merchantOrderId}${env.DUITKU_API_KEY}`
          )
          .digest("hex"),
      }),
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to check transaction", message: response.statusText },
      { status: 500 }
    );
  }
  const status = await response.json();
  // console.log("Status: ", status);
  if (!status) {
    // console.log("Error while checking payment", status);
    return NextResponse.json({
      error: "Failed to verify payment",
      message: "No status returned",
    });
  }

  if (status.statusCode === "00") {
    // Create payment & Registration status
    if (submittedData.competitionName !== CompetitionName.STEM) {
      await db.payment.create({
        data: {
          orderId: merchantOrderId,
          userId: user?.id,
          amount: paymentAmount * quantity,
          competition: productDetails,
          paymentUrl: InvoiceData.paymentUrl,
          referenceDuitku: InvoiceData.reference,
          status: "SUCCESS",
        },
      });

      const thisTransaction = await db.payment.findUnique({
        where: {
          orderId: merchantOrderId,
        },
        select: {
          orderId: true,
        },
      });

      await db.compRegistration.create({
        data: {
          teamName: submittedData.team as string,
          competitionName: submittedData.competitionName as CompetitionName,
          userId: user?.id as string,
          teamId: submittedData.teamId as string,
          paymentId: thisTransaction?.orderId as string,
          leaderUserId: submittedData.leaderUserId as string,
          leaderName: submittedData.leaderName as string,
          leaderEmail: submittedData.leaderEmail as string,
          leaderPhoneNumber: submittedData.leaderPhoneNumber as string,
          teamInstitution: submittedData.teamInstitution as string,
          statusOrder: "SUCCESS",
          teamStatus: "PENDING",
        },
      });
      await db.team.update({
        where: {
          id: submittedData.teamId,
        },
        data: {
          paymentId: thisTransaction?.orderId as string,
          competition: submittedData.competitionName as CompetitionName,
          status: "SUCCESS",
          teamStatus: "PENDING",
        },
      });
    }
    if (submittedData.competitionName === CompetitionName.STEM) {
      await db.payment.create({
        data: {
          orderId: merchantOrderId,
          userId: user?.id,
          amount: paymentAmount * quantity,
          competition: productDetails,
          paymentUrl: InvoiceData.paymentUrl,
          referenceDuitku: InvoiceData.reference,
          status: "SUCCESS",
        },
      });
      const thisTransaction = await db.payment.findUnique({
        where: {
          orderId: merchantOrderId,
        },
        select: {
          orderId: true,
        },
      });
      await db.compRegistration.create({
        data: {
          teamName: submittedData.team as string,
          competitionName: submittedData.competitionName as CompetitionName,
          userId: user?.id as string,
          teamId: submittedData.teamId as string,
          paymentId: thisTransaction?.orderId as string,
          leaderUserId: submittedData.leaderUserId as string,
          leaderName: submittedData.leaderName as string,
          leaderEmail: submittedData.leaderEmail as string,
          leaderPhoneNumber: submittedData.leaderPhoneNumber as string,
          teamInstitution: submittedData.teamInstitution as string,
          mentor: submittedData.mentor as string,
          statusOrder: "SUCCESS",
          teamStatus: "PENDING",
        },
      });
      await db.team.update({
        where: {
          id: submittedData.teamId,
        },
        data: {
          paymentId: thisTransaction?.orderId as string,
          competition: submittedData.competitionName as CompetitionName,
          status: "SUCCESS",
          teamStatus: "PENDING",
        },
      });
    }
    return NextResponse.json(
      { status: "success", message: "Payment Successful" },
      { status: 200 }
    );
  } else if (status.statusCode === "01") {
    // Create payment & Registration status
    if (submittedData.competitionName !== CompetitionName.STEM) {
      await db.payment.create({
        data: {
          orderId: merchantOrderId,
          userId: user?.id,
          amount: paymentAmount * quantity,
          competition: productDetails,
          paymentUrl: InvoiceData.paymentUrl,
          referenceDuitku: InvoiceData.reference,
          status: "PENDING",
        },
      });

      const thisTransaction = await db.payment.findUnique({
        where: {
          orderId: merchantOrderId,
        },
        select: {
          orderId: true,
        },
      });

      await db.compRegistration.create({
        data: {
          teamName: submittedData.team as string,
          competitionName: submittedData.competitionName as CompetitionName,
          userId: user?.id as string,
          teamId: submittedData.teamId as string,
          paymentId: thisTransaction?.orderId as string,
          leaderUserId: submittedData.leaderUserId as string,
          leaderName: submittedData.leaderName as string,
          leaderEmail: submittedData.leaderEmail as string,
          leaderPhoneNumber: submittedData.leaderPhoneNumber as string,
          teamInstitution: submittedData.teamInstitution as string,
          statusOrder: "PENDING",
          teamStatus: "PENDING",
        },
      });
      await db.team.update({
        where: {
          id: submittedData.teamId,
        },
        data: {
          paymentId: thisTransaction?.orderId as string,
          competition: submittedData.competitionName as CompetitionName,
          status: "PENDING",
          teamStatus: "PENDING",
        },
      });
    }
    if (submittedData.competitionName === CompetitionName.STEM) {
      await db.payment.create({
        data: {
          orderId: merchantOrderId,
          userId: user?.id,
          amount: paymentAmount * quantity,
          competition: productDetails,
          paymentUrl: InvoiceData.paymentUrl,
          referenceDuitku: InvoiceData.reference,
          status: "PENDING",
        },
      });
      const thisTransaction = await db.payment.findUnique({
        where: {
          orderId: merchantOrderId,
        },
        select: {
          orderId: true,
        },
      });
      await db.compRegistration.create({
        data: {
          teamName: submittedData.team as string,
          competitionName: submittedData.competitionName as CompetitionName,
          userId: user?.id as string,
          teamId: submittedData.teamId as string,
          paymentId: thisTransaction?.orderId as string,
          leaderUserId: submittedData.leaderUserId as string,
          leaderName: submittedData.leaderName as string,
          leaderEmail: submittedData.leaderEmail as string,
          leaderPhoneNumber: submittedData.leaderPhoneNumber as string,
          teamInstitution: submittedData.teamInstitution as string,
          mentor: submittedData.mentor as string,
          statusOrder: "PENDING",
          teamStatus: "PENDING",
        },
      });
      await db.team.update({
        where: {
          id: submittedData.teamId,
        },
        data: {
          paymentId: thisTransaction?.orderId as string,
          competition: submittedData.competitionName as CompetitionName,
          status: "PENDING",
          teamStatus: "PENDING",
        },
      });
    }
    return NextResponse.json(
      { status: "PENDING", message: "Payment is Pending" },
      { status: 200 }
    );
  } else {
    await db.payment.update({
      where: { orderId: result.merchantOrderId },
      data: { status: "CANCELLED", createdAt: new Date() },
    });
    await db.compRegistration.update({
      where: { paymentId: result.merchantOrderId },
      data: { statusOrder: "CANCELLED" },
    });
    await db.team.update({
      where: {
        paymentId: result.merchantOrderId,
      },
      data: {
        status: "CANCELLED",
        teamStatus: "NOT_REGISTERED",
      },
    });
    return NextResponse.json(
      { status: "CANCELLED", message: "Payment Canceled" },
      { status: 500 }
    );
  }
}
