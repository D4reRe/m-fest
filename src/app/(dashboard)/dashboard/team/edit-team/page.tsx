import { redirect } from "next/navigation";
import React from "react";

function EditPage() {
  redirect("/dashboard/team");
  return <></>;
}

export default EditPage;
