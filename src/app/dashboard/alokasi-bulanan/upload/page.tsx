import { getCurrentSession } from "@/app/actions/auth.actions";
import UploadAlokasiBulanan from "@/components/UploadAlokasiBulanan/UploadAlokasiBulanan";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Upload Alokasi Bulanan",
};

const AlokasiPage = async () => {
  const { user, session } = await getCurrentSession();
  if (!user && !session) {
    redirect("/auth/login");
  }

  return <UploadAlokasiBulanan user={user} />;
};

export default AlokasiPage;
