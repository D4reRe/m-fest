"use server";
import { utapi } from "@/server/uploadthing";

export async function deleteFiles(imageKey: string) {
  await utapi.deleteFiles(imageKey);
}
