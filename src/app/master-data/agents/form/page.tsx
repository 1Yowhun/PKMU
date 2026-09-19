import { getCurrentSession } from "@/app/actions/auth.actions";
import { getCompaniesNameData } from "@/app/actions/companies.action";
import AgentForm from "@/components/Screens/FormComponent/AgentForm";
import { redirect } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Form Agen",
};

const FormAgentsPage = async () => {
  const { session, user } = await getCurrentSession();
  if (!session || !user) {
    redirect("/auth/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/master-data/agents");
  }
  const companyName = await getCompaniesNameData();
  return <AgentForm companyName={companyName} user={user} />;
};

export default FormAgentsPage;
