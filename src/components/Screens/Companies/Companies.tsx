import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { User } from "@prisma/client";

interface CompaniesProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  user: User;
}

const Companies = <TData, TValue>({
  columns,
  data,
  user,
}: CompaniesProps<TData, TValue>) => {
  return (
    <div className="w-full">
      <div className=" items-center py-4 mx-4">
        {user.role === "ADMIN" && (
          <div className="justify-start mb-1">
            <Button variant="default" className="ml-auto justify-start" asChild>
              <Link href="companies/form">
                <Plus className="h-4 w-4 mr-2 cursor-pointer" />
                New Company
              </Link>
            </Button>
          </div>
        )}
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Companies;
