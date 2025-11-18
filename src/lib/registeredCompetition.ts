import { getUserProfile } from "@/action/user.action";
import { User } from "@/types/types";
import { prisma } from "@/lib/prisma";

async function FetchUserRegisteredCompetitions() {
  const user = (await getUserProfile()) as User;
  const registeredCompetitions = await prisma.compRegistration.findMany({
    where: {
      userId: user.id,
      statusOrder: "SUCCESS",
    },
  });
}
