import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchUser() {
  try {
    const res = await fetch("api/user");
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    const data = await res.json();
    return data as User;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}
