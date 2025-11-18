import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CompRegistration, Document, Invoices, User } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchUser() {
  try {
    const res = await fetch("/api/user");
    if (!res.ok) {
      const message = await res.json();
      console.error(message);
      throw new Error("Failed to fetch user", { cause: message });
    }
    const data: User = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}

export async function fetchUserInvoices() {
  try {
    const res = await fetch("/api/invoices");
    if (!res.ok) {
      const message = await res.json();
      console.error(message);
      throw new Error("Failed to fetch invoices", { cause: message });
    }
    const data: Invoices = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}

export async function fetchUserDocuments() {
  try {
    const res = await fetch(`/api/docs`);
    if (!res.ok) {
      const message = await res.json();
      console.error(message);
      throw new Error("Failed to fetch documents", { cause: message });
    }
    const data = await res.json();

    return {
      documents: data.documents as Document[],
      status: data.status as string,
    };
  } catch (err) {
    console.error("Error fetching user's documents:", err);
    return null;
  }
}

export async function fetchUserRegisteredComp({ comp }: { comp: string }) {
  try {
    const res = await fetch(`/api/user/registered-comp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comp,
      }),
    });
    if (!res.ok) {
      const message = await res.json();
      console.error(message);
      throw new Error("Failed to fetch registered competitions", {
        cause: message,
      });
    }
    const data: CompRegistration = await res.json();

    return data;
  } catch (err) {
    console.error("Error fetching user's registered competitions:", err);
    return null;
  }
}
