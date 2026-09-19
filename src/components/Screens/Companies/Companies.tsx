import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import type { User } from "../../../../generated/prisma_client";

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
    <div className="mx-5">
      <div className="mb-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
          <div className="pl-1">
            <h1 className="text-xl md:text-2xl font-bold">
              Master Data Perusahaan
            </h1>
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Companies;
