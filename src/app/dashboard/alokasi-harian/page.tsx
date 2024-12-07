import { getAllokasiAll } from "@/app/actions/alokasi.action";
import { getCurrentSession } from "@/app/actions/auth.actions";
import AlokasiHarian from "@/components/Screens/Alokasi/AlokasiHarian";
import { ContentLayout } from "@/components/ContentLayout";
import { adminAllocationColumns, allocationColumns } from "@/lib/Column";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Alokasi PKMU",
};

const AlokasiPage = async () => {
  const data = await getAllokasiAll();
  const { session, user } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }

  return (
    <ContentLayout
      home={"dashboard"}
      mainpage={"alokasi-harian"}
      children={
        <AlokasiHarian
          columns={
            user.role === "ADMIN" ? adminAllocationColumns : allocationColumns
          }
          data={data}
          user={user}
        />
      }
    />
  );
};

export default AlokasiPage;
