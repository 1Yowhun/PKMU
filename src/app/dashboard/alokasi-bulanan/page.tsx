import { getCurrentSession } from "@/app/actions/auth.actions";
import { getDefaultMonthlyData } from "@/app/actions/monthly-allocation.action";
import AlokasiBulanan from "@/components/Screens/Alokasi/AlokasiBulanan";
import { monthlyAllocationColumns } from "@/lib/Column";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Alokasi Bulanan",
};

const AlokasiBulananPage = async () => {
  const sessionData = await getCurrentSession();
  const { session, user } = sessionData;

  if (!session || !user) {
    redirect("/auth/login");
  }
  const data = await getDefaultMonthlyData(user.companiesId);
  return (
    <AlokasiBulanan
      columns={monthlyAllocationColumns}
      user={user}
      data={data}
    />
  );
};

export default AlokasiBulananPage;
