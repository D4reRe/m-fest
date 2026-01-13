import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { competitions } from "./competition";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Real date
export const currentDate = new Date();
// For testing date
// export const currentDate = new Date("2026-01-20T00:00:00");

export function getCompFee(comp: string) {
    const compStartDate1 = competitions.find(
        (competition) => competition.abbreviation === comp.toUpperCase(),
    )?.startRegDate1 as Date;
    const compEndDate1 = competitions.find(
        (competition) => competition.abbreviation === comp.toUpperCase(),
    )?.endRegDate1 as Date;

    if (compStartDate1 < currentDate && currentDate < compEndDate1) {
        const compFee = competitions.find(
            (competition) =>
                competition.abbreviation === comp.toUpperCase(),
        )?.fee1 as number;

        return compFee;
    }

    const compFee = competitions.find(
        (competition) => competition.abbreviation === comp.toUpperCase(),
    )?.fee2 as number;

    return compFee;
}
