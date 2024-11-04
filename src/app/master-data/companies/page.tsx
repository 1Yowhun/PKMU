import { getCurrentSession } from "@/app/actions/auth.actions";
import { getCompaniesAll } from "@/app/actions/companies.action";
import Companies from "@/components/Companies/Companies";
import { ContentLayout } from "@/components/ContentLayout";
import { companiesColumns } from "@/lib/Column";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Company PKMU",
};

const CompanyPage = async () => {
  const data = await getCompaniesAll();
  const dataUser = await getCurrentSession();
  if (!dataUser.session && !dataUser.user) {
    redirect("/auth/login");
  }

  return (
    <ContentLayout
      home={"master-data"}
      mainpage={"companies"}
      children={<Companies columns={companiesColumns} data={data} />}
    />
  );
};

export default CompanyPage;
