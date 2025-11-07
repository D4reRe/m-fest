"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <Dialog key={item.title}>
              <DialogTrigger>
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-white/20 cursor-pointer"
                  >
                    <span>
                      <item.icon />
                      <span>{item.title}</span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
