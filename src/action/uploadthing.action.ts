"use server";
import { utapi } from "@/server/uploadthing";

export async function deleteFiles(fileKey: string) {
  await utapi.deleteFiles(fileKey);
}
