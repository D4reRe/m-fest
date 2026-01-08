import { headers } from "next/headers";

export async function assertSEB() {
  const h = await headers();
  const sebKey = h.get("x-safeexambrowser-configkeyhash");

  if (!sebKey) {
    throw new Error("SEB required");
  }

  if (sebKey !== process.env.SEB_EXAM_KEY_HASH) {
    throw new Error("Invalid SEB exam key");
  }
}
