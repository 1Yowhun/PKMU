import { getCurrentSession } from "@/app/actions/auth.actions";
import { redirect } from "next/navigation";
import { getFilterData } from "@/app/actions/lpg-distribution.action";
import DownloadComponent from "@/components/Screens/Download/DownloadComponent";

export const metadata = {
  title: "Rekap Penyaluran",
};

export default async function DownloadPage() {
  const { user, session } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }
  const dataBpeDeliveryAgent = await getFilterData(user.companiesId);

  return (
    <DownloadComponent
      dataBpeDeliveryAgent={dataBpeDeliveryAgent}
      user={user}
    />
  );
}
