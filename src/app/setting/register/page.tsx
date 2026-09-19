import { getCurrentSession } from "@/app/actions/auth.actions";
import Register from "@/components/Screens/Register/RegisterForm";

export const metadata = {
  title: "Registrasi",
};

const RegisterPage = async () => {
  const { user } = await getCurrentSession();
  const role = user?.role || "USER";
  return <Register role={role} />;
};

export default RegisterPage;
