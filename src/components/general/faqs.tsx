"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function FAQs() {
  const faqItems = [
    {
      id: "item-1",
      question: "Is the competition open to the public?",
      answer:
        "For college students, the Business Case, Innovative Poster and Paper, and Pipeline Design competitions are open. For high school students, the Science, Technology, Engineering, or Mathematics (STEM) competition is open.",
    },
    {
      id: "item-2",
      question:
        "Do participants need to be from the same institution or school?",
      answer:
        "Yes, for each competition, participants must be from the same institution or school.",
    },
    {
      id: "item-3",
      question: "Where will the competition be held?",
      answer:
        "The selection phase will be conducted online, while finalists will compete offline at ITB Ganesha.",
    },
    {
      id: "item-4",
      question: "How can I become a sponsor?",
      answer: "You can contact us through the 'Ask any question' button.",
    },
    {
      id: "item-5",
      question: "Can one person participate in more than one competition?",
      answer:
        "One person is only allowed to participate in 1 competition category in M-Fest 2026.",
    },
    {
      id: "item-6",
      question: "Competition related questions?",
      answer:
        "If you have any further questions regarding our competitions, please kindly follow our Instagram and click 'FAQ Competitions' highlight or contact our contact person. Thank you!",
    },
  ];

  return (
    <section className="py-16 md:py-24" id="faqs">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Discover quick and comprehensive answers to common questions about
            our platform, services, and features.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-muted dark:bg-muted/50 w-full rounded-2xl p-1"
          >
            {faqItems.map((item) => (
              <div className="group" key={item.id}>
                <AccordionItem
                  value={item.id}
                  className="data-[state=open]:bg-card dark:data-[state=open]:bg-muted peer rounded-xl border-none px-7 py-1 data-[state=open]:border-none data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
                <hr className="mx-7 border-dashed group-last:hidden peer-data-[state=open]:opacity-0" />
              </div>
            ))}
          </Accordion>

          <div className="text-muted-foreground mt-6 px-8">
            Cannot find what you are looking for? please contact our
            <Dialog>
              <DialogTrigger
                asChild
                className="text-muted-foreground hover:text-primary block duration-150 cursor-pointer underline underline-offset-1"
              >
                <span>contact person</span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-transparent backdrop-blur-lg">
                <DialogHeader>
                  <DialogTitle>Need Help?</DialogTitle>
                  <DialogDescription>
                    Please kindly contact our contact person for any further
                    questions.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                    <h3 className="mb-1 ">
                      Contact Person - Rahmat Handaru Prayoga
                    </h3>
                    <Label htmlFor="email" className="mb-1">
                      Email
                    </Label>
                    <Input
                      id="email"
                      defaultValue="rahmathandaru.p@gmail.com"
                      readOnly
                    />
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      defaultValue="+62 85775132602"
                      readOnly
                    />
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full cursor-pointer"
                    >
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
}
