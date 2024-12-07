import { getCurrentSession } from "@/app/actions/auth.actions";
import { ContentLayout } from "@/components/ContentLayout";
import UploadAlokasi from "@/components/UploadAlokasi/UploadAlokasi";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Upload Alokasi PKMU",
};

const AlokasiPage = async () => {
  const { user, session } = await getCurrentSession();
  if (!user && !session) {
    redirect("/auth/login");
  }

  return (
    <ContentLayout
      home={"dashboard"}
      mainpage={"alokasi-harian"}
      childpage={"upload"}
      children={<UploadAlokasi user={user} />}
    />
  );
};

export default AlokasiPage;
