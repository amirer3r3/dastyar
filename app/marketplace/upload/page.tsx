import { redirect } from "next/navigation";
import { auth } from "@/auth";
import UploadPackageForm from "./upload-form";

export default async function UploadPackagePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return <UploadPackageForm />;
}
