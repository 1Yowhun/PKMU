import { getCurrentSession } from "@/app/actions/auth.actions";
import CompanyForm from "@/components/Screens/FormComponent/CompanyForm";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Form Perusahaan",
};

const FormCompanyPage = async () => {
  const { session, user } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }
  return <CompanyForm user={user} />;
};

export default FormCompanyPage;
