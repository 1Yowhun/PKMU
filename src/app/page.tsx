import { getCurrentSession } from "./actions/auth.actions";
import { redirect } from "next/navigation";

const page = async () => {
  const dataUser = await getCurrentSession();
  if (!dataUser.session && !dataUser.user) {
    redirect("/auth/login");
  } else {
    redirect("/dashboard/summary");
  }
};

export default page;
