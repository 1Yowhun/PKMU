import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../ui/data-table";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { User } from "../../../../generated/prisma_client";

interface AgentsProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  user: User;
}

const Agents = <TData, TValue>({
  columns,
  data,
  user,
}: AgentsProps<TData, TValue>) => {
  return (
    <div className="mx-4 sm:mx-6 lg:mx-8">
      <div className="mb-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
          <div className="pl-1">
            <h1 className="text-xl md:text-2xl font-bold">Master Data Agen</h1>
          </div>

          {user.role === "ADMIN" && (
            <div className="w-full md:w-auto">
              <Button variant="default" className="w-full md:w-auto" asChild>
                <Link href="agents/form">
                  <Plus className="h-4 w-4 mr-2" />
                  New Agen
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Agents;
