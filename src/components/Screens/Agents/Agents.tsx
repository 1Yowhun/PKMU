import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../ui/data-table";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface AgentsProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  } 

const Agents = <TData, TValue>({columns, data}: AgentsProps<TData, TValue>) => {
    return (
        <div className="w-full">
            <div className="items-center py-4 mx-4">
                <div className="justify-start mb-1">
                    <Button variant="default" className="ml-auto justify-start" asChild>
                        <Link href="agents/form">
                        <Plus className="h-4 w-4 mr-2 cursor-pointer"/>New Agen</Link> 
                    </Button>
                </div>
                <DataTable columns={columns} data={data}/>
            </div>
        </div>
    )
}

export default Agents