import { getCurrentSession } from "@/app/actions/auth.actions";
import { getCompaniesAll } from "@/app/actions/companies.action";
import Companies from "@/components/Screens/Companies/Companies";
import { companiesColumns } from "@/lib/Column";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Perusahaan",
};

const CompanyPage = async () => {
  const data = await getCompaniesAll();
  const { user, session } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }

  return <Companies columns={companiesColumns} data={data} user={user} />;
};

export default CompanyPage;
