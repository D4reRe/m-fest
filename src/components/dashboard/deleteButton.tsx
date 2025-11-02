"use client";
import React from "react";
import { AlertDialogAction } from "../ui/alert-dialog";
import { redirect } from "next/navigation";
import { toast } from "sonner";

function AlertDialogActionButton({
  teamId,
  deleteTeam,
}: {
  teamId: string;
  deleteTeam: (teamId: string) => Promise<void>;
}) {
  return (
    <AlertDialogAction
      className="cursor-pointer"
      onClick={async () => {
        toast.loading("Deleting team...", { id: "deleting-team" });
        await deleteTeam(teamId);
        toast.dismiss("deleting-team");
        toast.success("Team deleted");
        redirect("/dashboard/team");
      }}
    >
      Continue
    </AlertDialogAction>
  );
}

export default AlertDialogActionButton;
