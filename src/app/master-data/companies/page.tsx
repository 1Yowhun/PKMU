import { getCurrentSession } from "@/app/actions/auth.actions";
import { getCompaniesAll } from "@/app/actions/companies.action";
import { ContentLayout } from "@/components/ContentLayout";
import Companies from "@/components/Screens/Companies/Companies";
import { companiesColumns } from "@/lib/Column";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Company PKMU",
};

const CompanyPage = async () => {
  const data = await getCompaniesAll();
  const { user, session } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }

  return (
    <ContentLayout
      home={"master-data"}
      mainpage={"perusahaan"}
      children={
        <Companies columns={companiesColumns} data={data} user={user} />
      }
    />
  );
};

export default CompanyPage;
