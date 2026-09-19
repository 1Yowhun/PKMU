import {
  getAllocationDefault,
  getFilterDataAllocation,
} from "@/app/actions/alokasi.action";
import { getCurrentSession } from "@/app/actions/auth.actions";
import AlokasiHarian from "@/components/Screens/Alokasi/AlokasiHarian";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Alokasi Harian",
};

const AlokasiPage = async () => {
  const sessionData = await getCurrentSession();
  const { session, user } = sessionData;

  if (!session || !user) {
    redirect("/auth/login");
  }
  const [dataBpeDeliveryAgent, defaultData] = await Promise.all([
    getFilterDataAllocation(user.companiesId),
    getAllocationDefault(user.companiesId),
  ]);
  return (
    <AlokasiHarian
      user={user}
      defaultdata={defaultData}
      dataBpeDeliveryAgent={dataBpeDeliveryAgent}
    />
  );
};

export default AlokasiPage;
