import { getCurrentSession } from "@/app/actions/auth.actions";
import { ContentLayout } from "@/components/ContentLayout";
import { redirect } from "next/navigation";
import { getAgentsAll } from "@/app/actions/agent.action";
import Rekapan from "@/components/Screens/Rekapan/Rekapan";

export const metadata = {
  title: "Rekap Penyaluran PKMU",
};

const RekapPage = async () => {
    const data = await getAgentsAll();
    const { user, session } = await getCurrentSession();
    if (!session && !user) {
    redirect("/auth/login");
    }
  return (
    <ContentLayout
        home={"dashboard"}
        mainpage={"rekap-penyaluran"}
        children={
        <Rekapan
          data={data}
          user={user}
        />
      }
    />
  );
};

export default RekapPage;
