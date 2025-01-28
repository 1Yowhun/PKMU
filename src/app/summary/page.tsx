import { redirect } from "next/navigation";
import { getCurrentSession } from "../actions/auth.actions";
import { ContentLayout } from "@/components/ContentLayout";
import Summary from "@/components/Screens/Summary/Summary";
import { getSummary } from "../actions/alokasi.action";

export const metadata = {
  title: "Data Summary PKMU",
};

const SummaryPage = async () => {
  const { session, user } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }
  return (
    // <ContentLayout
    //   home={"summary"}
    //   children={
      <Summary />
    // }
    // />
  );
};

export default SummaryPage;
