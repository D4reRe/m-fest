import { getUserProfile } from "@/action/user.action";
import { User } from "@/types/types";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = (await getUserProfile()) as User;
  if (user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
    redirect("/dashboard");
  }
  return <div>AdminPage</div>;
}
