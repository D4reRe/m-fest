import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import EventCard from "./eventcard";
import { events } from "@/lib/event";
import { competitions } from "@/lib/competition";
import { title } from "process";

interface CompetitionCardProps {
    title: string;
    card: string;
    href: string;
}

export const Competitions = [{
    title: "Business Case Competition",
    card: "/competitions/card/BCC.svg",
    href: "/competitions/BCC",
    },

    {
    title: "Innovative Poster and Paper Competition",
    card: "/competitions/card/IPPC.svg",
    href: "/competitions/IPPC",
    },

    {
    title: "Pipeline Design Competition",
    card: "/competitions/card/PDC.svg",
    href: "/competitions/PDC",
    },
    
    {
    title: "STEM",
    card: "/competitions/card/STEM.svg",
    href: "/competitions/STEM",
    }
]


export default function CompetitionCard({ title, card, href }: CompetitionCardProps) {
    return (
        <Link 
            href={href}
            className="group block w-40 md:w-48 rounded-xl overflow-hidden shadow-lg bg-white transition-transform grayscale hover:grayscale-0 hover:-translate-y-1"
        >
            <div className="flex flex-col h-full">
                    <img 
                        src={card} 
                        alt={title} 
                        className="w-full h-full object-cover transition-transform duration-500" 
                    />
            </div>
        </Link>
    );
}