import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return <div></div>;
}

export default DashboardPage;
