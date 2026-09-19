import { getCurrentSession } from "@/app/actions/auth.actions";
import UploadAlokasiBulanan from "@/components/Screens/Alokasi/UploadAlokasiBulanan";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Upload Alokasi Bulanan",
};

const AlokasiPage = async () => {
  const { user, session } = await getCurrentSession();
  if (!user || !session) {
    redirect("/auth/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/dashboard/alokasi-bulanan");
  }

  return <UploadAlokasiBulanan user={user} />;
};

export default AlokasiPage;
