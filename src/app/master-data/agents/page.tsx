import { getAgentsAll } from "@/app/actions/agent.action";
import { getCurrentSession } from "@/app/actions/auth.actions";
import Agents from "@/components/Screens/Agents/Agents";
import { adminAgentColumns, agentColumns } from "@/lib/Column";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Agen",
};

const AgentsPage = async () => {
  const { user, session } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }
  const data = await getAgentsAll(user.id, user.companiesId!);

  return (
    <Agents
      columns={user.role === "ADMIN" ? adminAgentColumns : agentColumns}
      data={data}
      user={user}
    />
  );
};

export default AgentsPage;
