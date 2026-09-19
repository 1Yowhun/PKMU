import { getCurrentSession } from "@/app/actions/auth.actions";
import Register from "@/components/Screens/Register/RegisterForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Registrasi",
};

const RegisterPage = async () => {
  const { session, user } = await getCurrentSession();
  if (!session || !user) {
    redirect("/auth/login");
  }
  if (user.role !== "ADMIN") {
    redirect("/summary");
  }
  return <Register role={user.role} />;
};

export default RegisterPage;
