import { getCurrentSession } from "@/app/actions/auth.actions";
import UploadAlokasi from "@/components/Screens/Alokasi/UploadAlokasi";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Upload Alokasi Harian",
};

const AlokasiPage = async () => {
  const { user, session } = await getCurrentSession();
  if (!user || !session) {
    redirect("/auth/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/dashboard/alokasi-harian");
  }

  return <UploadAlokasi user={user} />;
};

export default AlokasiPage;
