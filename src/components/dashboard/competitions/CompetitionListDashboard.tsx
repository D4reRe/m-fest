import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { competitions } from "@/lib/competition";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function CompetitionListDashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 items-stretch my-2">
      {competitions.map((comp) => (
        <Card
          key={comp.abbreviation}
          className="w-full max-w-sm bg-white/5 flex flex-col"
        >
          <CardHeader className="flex flex-col justify-center items-center mb-auto">
            <CardTitle>{comp.abbreviation}</CardTitle>
            <CardDescription className="text-center">
              {comp.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center grow my-auto">
            <div className="w-full h-24 relative">
              <Image
                src={comp.logo}
                alt={comp.title}
                width={400}
                height={400}
                loading="lazy"
                className="object-cover"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center mt-auto">
            <Button
              variant="default"
              size="sm"
              className="gap-1 pr-1.5 cursor-pointer"
            >
              <Link
                href={`/dashboard/competitions/register/${comp.abbreviation.toUpperCase()}`}
                prefetch
                className="flex items-center gap-2"
              >
                <span>Register</span>
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
