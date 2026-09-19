import { getCurrentSession } from "./actions/auth.actions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
  const dataUser = await getCurrentSession();
  if (!dataUser.session || !dataUser.user) {
    redirect("/auth/login");
  }
  redirect("/summary");
}
