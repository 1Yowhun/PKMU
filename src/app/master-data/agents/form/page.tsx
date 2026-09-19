import { getCurrentSession } from "@/app/actions/auth.actions";
import { getCompaniesNameData } from "@/app/actions/companies.action";
import AgentForm from "@/components/Screens/FormComponent/AgentForm";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Form Agen",
};

const FormAgentsPage = async () => {
  const companyName = await getCompaniesNameData();
  const { session, user } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }
  return <AgentForm companyName={companyName} user={user} />;
};

export default FormAgentsPage;
