import { getMonthlyAllocation } from "@/app/actions/alokasi.action";
import { getCurrentSession } from "@/app/actions/auth.actions";
import { ContentLayout } from "@/components/ContentLayout";
import AlokasiBulanan from "@/components/Screens/Alokasi/AlokasiBulanan";
import { monthlyAllocationColumns } from "@/lib/Column";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Alokasi Bulanan PKMU",
};

const AlokasiBulananPage = async () => {
  const data = await getMonthlyAllocation();
  const { session, user } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }
  return (
    <ContentLayout
      home={"dashboard"}
      mainpage={"alokasi-bulanan"}
      children={
        <AlokasiBulanan
          columns={monthlyAllocationColumns}
          data={data}
          user={user}
        />
      }
    />
  );
};

export default AlokasiBulananPage;
