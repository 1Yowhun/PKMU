import { getCurrentSession } from "@/app/actions/auth.actions";
import { getAllLpg } from "@/app/actions/lpg-distribution.action";
import { ContentLayout } from "@/components/ContentLayout";
import PenyaluranElpiji from "@/components/Screens/PenyaluranElpiji/PenyaluranElpiji";
import { lpgDistributionColumns } from "@/lib/Column";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Penyaluran Elpiji PKMU",
};

const PenyaluranElpijiPage = async () => {
  const data = await getAllLpg();
  const { session, user } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }
  return (
    <ContentLayout
      home={"dashboard"}
      mainpage={"penyaluran-elpiji"}
      children={
        <PenyaluranElpiji
          columns={lpgDistributionColumns}
          data={data}
          user={user}
        />
      }
    />
  );
};

export default PenyaluranElpijiPage;
