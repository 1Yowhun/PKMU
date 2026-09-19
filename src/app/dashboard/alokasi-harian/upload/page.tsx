import { getCurrentSession } from "@/app/actions/auth.actions";
import UploadAlokasi from "@/components/UploadAlokasi/UploadAlokasi";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Upload Alokasi Harian",
};

const AlokasiPage = async () => {
  const { user, session } = await getCurrentSession();
  if (!user && !session) {
    redirect("/auth/login");
  }

  return <UploadAlokasi user={user} />;
};

export default AlokasiPage;
