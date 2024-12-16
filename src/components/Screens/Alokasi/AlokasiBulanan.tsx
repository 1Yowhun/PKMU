"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { DataTable } from "../../ui/data-table";
import Link from "next/link";
import { CalendarCheck, Database, SearchX, Upload, Weight } from "lucide-react";
import { Card } from "@/components/ui/card";
import MonthPicker from "@/components/FeatureComponents/MonthPicker";
import { useEffect, useState } from "react";
import { format, isSameMonth } from "date-fns";
import { formatNumberQty, calculateTotalQty, calculateMontlyQty } from "@/utils/page";
import { id } from "date-fns/locale";
import { MonthlyAllocation } from "@/lib/types";

interface AlokasiBulananProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  user: {
    id: string;
    username: string;
    role: string;
  };
}

const AlokasiBulanan = <
  TData extends MonthlyAllocation,
  TValue
>({
  columns,
  data,
  user,
}: AlokasiBulananProps<TData, TValue>) => {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(new Date());
  const [filteredData, setFilteredData] = useState<TData[]>(data);

  // Apply month filter to the data
  useEffect(() => {
    if (currentMonth) {
      const filtered = data.filter((item) => {
        return (
          item.date &&
          isSameMonth(new Date(item.date), currentMonth) 
        );
      });
      setFilteredData(filtered);
      console.log(filtered)
    } else {
      setFilteredData(data); 
    }
  }, [currentMonth, data]);

  const handleClearSearch = () => {
    setCurrentMonth(null);
  };

  return (
    <div className="w-full">
      <div className="items-center py-4 mx-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-3 space-y-2 md:space-y-0 md:space-x-2">
          {user.role === "ADMIN" && (
            <Button variant="default" asChild className="w-full md:w-auto">
              <Link href="alokasi-bulanan/upload" className="flex items-center">
                <Upload className="h-4 w-4 mr-2 cursor-pointer" />
                <span className="truncate">Upload Alokasi Bulanan</span>
              </Link>
            </Button>
          )}

          {/* MonthPicker with Responsive Behavior */}
          <div className="w-full md:w-auto">
            <MonthPicker
              currentMonth={currentMonth!}
              onMonthChange={(newMonth) => setCurrentMonth(newMonth)}
              placeholder={
                currentMonth
                  ? format(currentMonth, "MMMM yyyy", { locale: id })
                  : "Semua Bulan"
              }
            />
          </div>
        </div>

        
        {/* Summary Cards */}
        <div className="pt-2 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 mb-4">
          <Card className="px-6 py-6 my-1 shadow-lg rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-black rounded-xl p-2">
                <CalendarCheck className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-400 mb-1">TOTAL TABUNG</h1>
                <p className="text-3xl font-extrabold">{formatNumberQty(calculateMontlyQty(filteredData))}</p>
              </div>
            </div>
          </Card>
          <Card className="px-6 py-6 my-1 shadow-lg rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-black rounded-xl p-2">
                <Weight className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-400 mb-1">TOTAL BERAT TABUNG</h1>
                <p className="text-3xl font-extrabold">{formatNumberQty(calculateMontlyQty(filteredData)*3)} <span className="text-xl text-gray-600">Kg</span></p>
              </div>
            </div>
          </Card>
          <Card className="px-6 py-6 my-1 shadow-lg rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-black rounded-xl p-2">
                <Database className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-400 mb-1">TOTAL ALOKASI BULANAN</h1>
                <p className="text-3xl font-extrabold">{filteredData.length}</p>
              </div>
            </div>
          </Card>
        </div>
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
};

export default AlokasiBulanan;