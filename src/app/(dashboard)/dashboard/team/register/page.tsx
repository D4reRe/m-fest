import { redirect } from "next/navigation";

function EditPage() {
  redirect("/dashboard/competitions");
  return <></>;
}

export default EditPage;
