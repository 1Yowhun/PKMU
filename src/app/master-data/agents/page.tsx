import { getAgentsAll } from "@/app/actions/agent.action";
import { getCurrentSession } from "@/app/actions/auth.actions";
import Agents from "@/components/Screens/Agents/Agents";
import { ContentLayout } from "@/components/ContentLayout";
import { adminAgentColumns, agentColumns } from "@/lib/Column";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Agents PKMU",
};

const AgentsPage = async () => {
  const data = await getAgentsAll();
  const { user, session } = await getCurrentSession();
  if (!session && !user) {
    redirect("/auth/login");
  }
  return (
    <ContentLayout home="master-data" mainpage="agen">
      <Agents
        columns={user.role === "ADMIN" ? adminAgentColumns : agentColumns}
        data={data}
        user={user}
      />
    </ContentLayout>
  );
};

export default AgentsPage;
