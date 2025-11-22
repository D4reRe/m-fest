import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/env";

export async function POST(request: Request) {
  function generateDuitkuSignature(
    merchantCode: string,
    apiKey: string,
    timestamp: string
  ) {
    const signature = crypto
      .createHash("sha256")
      .update(`${merchantCode}${timestamp}${apiKey}`)
      .digest("hex");
    return signature;
  }

  const merchantCode = env.DUITKU_MERCHANT_ID as string;
  const apiKey = env.DUITKU_API_KEY as string;
  const timestamp = Date.now().toString();
  const signature = generateDuitkuSignature(merchantCode, apiKey, timestamp);
  const {
    paymentAmount,
    merchantOrderId,
    productDetails,
    email,
    callbackUrl,
    returnUrl,
    expiryPeriod,
    customerVaName,
    phoneNumber,
  } = await request.json();

  // Create invoice
  const body = {
    paymentAmount: paymentAmount,
    merchantOrderId: merchantOrderId,
    productDetails: productDetails,
    email: email,
    customerVaName: customerVaName,
    callbackUrl: callbackUrl,
    phoneNumber: phoneNumber,
    returnUrl: returnUrl,
    expiryPeriod: expiryPeriod,
  };

  try {
    const res = await fetch(
      "https://api-sandbox.duitku.com/api/merchant/createInvoice",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-duitku-signature": signature,
          "x-duitku-timestamp": timestamp,
          "x-duitku-merchantcode": merchantCode,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    // console.log("Response:", data);

    if (!res.ok) {
      console.error("Duitku error:", data);
      return NextResponse.json(
        { error: data },
        { status: 500, statusText: "Failed" }
      );
    } else {
      // console.log("Duitku success:", data);
      return NextResponse.json(data, { status: 200, statusText: "OK" });
    }
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500, statusText: "Failed" }
    );
  }
}
