import { getUserProfile } from "@/action/user.action";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

enum CompetitionName {
  BCC = "BCC",
  IPPC = "IPPC",
  PDC = "PDC",
  STEM = "STEM",
}

export async function POST(request: Request) {
  const user = await getUserProfile();
  const { result, submittedData, transactionData, checkOutData } =
    await request.json();
  const { id, competitionName, price, quantity } = checkOutData;

  const response = await fetch(
    `	https://api.sandbox.midtrans.com/v2/${result.order_id}/status`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.MIDTRANS_SECRET_KEY}:`
        ).toString("base64")}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to verify payment", message: response.statusText },
      { status: 500 }
    );
  }
  const status = await response.json();
  if (!status) {
    return NextResponse.json({
      error: "Failed to verify payment",
      message: "No status returned",
    });
  }

  if (status.transaction_status === "settlement") {
    // Create payment & Registration status
    if (submittedData.competitionName !== CompetitionName.STEM) {
      await prisma.payment.create({
        data: {
          orderId: id,
          userId: user?.id,
          amount: price * quantity,
          competition: competitionName,
          redirectUrl: transactionData.redirect_url,
          snapToken: transactionData.token,
          status: "settlement",
        },
      });

      const thisTransaction = await prisma.payment.findUnique({
        where: {
          orderId: id,
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
          statusOrder: "settlement",
        },
      });
      await prisma.team.update({
        where: {
          id: submittedData.teamId,
        },
        data: {
          paymentId: thisTransaction?.orderId as string,
          competition: submittedData.competitionName as CompetitionName,
          status: "settlement",
        },
      });
    }
    if (submittedData.competitionName === CompetitionName.STEM) {
      await prisma.payment.create({
        data: {
          orderId: id,
          userId: user?.id,
          amount: price * quantity,
          competition: competitionName,
          redirectUrl: transactionData.redirect_url,
          snapToken: transactionData.token,
          status: "settlement",
        },
      });
      const thisTransaction = await prisma.payment.findUnique({
        where: {
          orderId: id,
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
          statusOrder: "settlement",
        },
      });
    }
    return NextResponse.json(
      { status: "success", message: "Payment Successful" },
      { status: 200 }
    );
  } else if (status.transaction_status === "pending") {
    // Create payment & Registration status
    if (submittedData.competitionName !== CompetitionName.STEM) {
      await prisma.payment.create({
        data: {
          orderId: id,
          userId: user?.id,
          amount: price * quantity,
          competition: competitionName,
          redirectUrl: transactionData.redirect_url,
          snapToken: transactionData.token,
          status: "pending",
        },
      });

      const thisTransaction = await prisma.payment.findUnique({
        where: {
          orderId: id,
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
          statusOrder: "pending",
        },
      });
      await prisma.team.update({
        where: {
          id: submittedData.teamId,
        },
        data: {
          paymentId: thisTransaction?.orderId as string,
          competition: submittedData.competitionName as CompetitionName,
          status: "pending",
        },
      });
    }
    if (submittedData.competitionName === CompetitionName.STEM) {
      await prisma.payment.create({
        data: {
          orderId: id,
          userId: user?.id,
          amount: price * quantity,
          competition: competitionName,
          redirectUrl: transactionData.redirect_url,
          snapToken: transactionData.token,
          status: "pending",
        },
      });
      const thisTransaction = await prisma.payment.findUnique({
        where: {
          orderId: id,
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
          statusOrder: "pending",
        },
      });
    }
    return NextResponse.json(
      { status: "pending", message: "Payment is Pending" },
      { status: 200 }
    );
  } else {
    await prisma.payment.update({
      where: { orderId: result.order_id },
      data: { status: status.transaction_status, createdAt: new Date() },
    });
    await prisma.compRegistration.update({
      where: { paymentId: result.order_id },
      data: { statusOrder: status.transaction_status },
    });
    await prisma.team.update({
      where: {
        paymentId: result.order_id,
      },
      data: {
        status: status.transaction_status,
      },
    });
    return NextResponse.json(
      { status: "failed", message: "Payment Failed" },
      { status: 500 }
    );
  }
}
