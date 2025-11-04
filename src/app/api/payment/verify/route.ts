import { getUserProfile } from "@/action/user.action";
import { prisma } from "@/lib/prisma";
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
        merchantCode: process.env.DUITKU_MERCHANT_ID,
        merchantOrderId: result.merchantOrderId,
        signature: crypto
          .createHash("md5")
          .update(
            `${process.env.DUITKU_MERCHANT_ID}${result.merchantOrderId}${process.env.DUITKU_API_KEY}`
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
      await prisma.payment.create({
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

      const thisTransaction = await prisma.payment.findUnique({
        where: {
          orderId: merchantOrderId,
        },
        select: {
          orderId: true,
        },
      });

      await prisma.compRegistration.create({
        data: {
          teamName: submittedData.team as string,
          competitionName: submittedData.competitionName as CompetitionName,
          userId: user?.id as string,
          teamId: submittedData.teamId as string,
          paymentId: thisTransaction?.orderId as string,
          statusOrder: "SUCCESS",
        },
      });
      await prisma.team.update({
        where: {
          id: submittedData.teamId,
        },
        data: {
          paymentId: thisTransaction?.orderId as string,
          competition: submittedData.competitionName as CompetitionName,
          status: "SUCCESS",
        },
      });
    }
    if (submittedData.competitionName === CompetitionName.STEM) {
      await prisma.payment.create({
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
      const thisTransaction = await prisma.payment.findUnique({
        where: {
          orderId: merchantOrderId,
        },
        select: {
          orderId: true,
        },
      });
      await prisma.compRegistration.create({
        data: {
          userId: user?.id as string,
          paymentId: thisTransaction?.orderId as string,
          competitionName: submittedData.competitionName,
          name: submittedData.name,
          gender: submittedData.gender,
          email: submittedData.email,
          phoneNumber: submittedData.phoneNumber,
          education: submittedData.education,
          school: submittedData.school,
          mentor: submittedData.mentor,
          statusOrder: "SUCCESS",
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
      await prisma.payment.create({
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

      const thisTransaction = await prisma.payment.findUnique({
        where: {
          orderId: merchantOrderId,
        },
        select: {
          orderId: true,
        },
      });

      await prisma.compRegistration.create({
        data: {
          teamName: submittedData.team as string,
          competitionName: submittedData.competitionName as CompetitionName,
          userId: user?.id as string,
          teamId: submittedData.teamId as string,
          paymentId: thisTransaction?.orderId as string,
          statusOrder: "PENDING",
        },
      });
      await prisma.team.update({
        where: {
          id: submittedData.teamId,
        },
        data: {
          paymentId: thisTransaction?.orderId as string,
          competition: submittedData.competitionName as CompetitionName,
          status: "PENDING",
        },
      });
    }
    if (submittedData.competitionName === CompetitionName.STEM) {
      await prisma.payment.create({
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
      const thisTransaction = await prisma.payment.findUnique({
        where: {
          orderId: merchantOrderId,
        },
        select: {
          orderId: true,
        },
      });
      await prisma.compRegistration.create({
        data: {
          userId: user?.id as string,
          paymentId: thisTransaction?.orderId as string,
          competitionName: submittedData.competitionName,
          name: submittedData.name,
          gender: submittedData.gender,
          email: submittedData.email,
          phoneNumber: submittedData.phoneNumber,
          education: submittedData.education,
          school: submittedData.school,
          mentor: submittedData.mentor,
          statusOrder: "PENDING",
        },
      });
    }
    return NextResponse.json(
      { status: "PENDING", message: "Payment is Pending" },
      { status: 200 }
    );
  } else {
    await prisma.payment.update({
      where: { orderId: result.merchantOrderId },
      data: { status: "CANCELLED", createdAt: new Date() },
    });
    await prisma.compRegistration.update({
      where: { paymentId: result.merchantOrderId },
      data: { statusOrder: "CANCELLED" },
    });
    if (submittedData.competitionName !== CompetitionName.STEM) {
      await prisma.team.update({
        where: {
          paymentId: result.merchantOrderId,
        },
        data: {
          status: "CANCELLED",
        },
      });
    }
    return NextResponse.json(
      { status: "CANCELLED", message: "Payment Canceled" },
      { status: 500 }
    );
  }
}
