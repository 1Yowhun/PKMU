"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { DataTable } from "../../ui/data-table";
import Link from "next/link";
import {
  CalendarCheck,
  Database,
  Loader2,
  SearchX,
  Upload,
  Weight,
  X,
} from "lucide-react";
import MonthPicker from "@/components/FeatureComponents/MonthPicker";
import { useEffect, useState } from "react";
import { format, isSameMonth } from "date-fns";
import {
  formatNumberQty,
  calculateTotalQty,
  calculateMontlyQty,
} from "@/utils/page";
import { id } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { MonthlyAllocation } from "@/lib/types";

import InfoCard from "@/components/InfoCard";
import { User } from "../../../../generated/prisma_client";

interface AlokasiBulananProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  user: User;
  data: any;
}

const AlokasiBulanan = <TData extends MonthlyAllocation, TValue>({
  columns,
  user,
  data,
}: AlokasiBulananProps<TData, TValue>) => {
  const [rawData, setRawData] = useState<TData[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date | null>(new Date());
  const [filteredData, setFilteredData] = useState<TData[]>(data ?? []);
  const [isFiltered, setIsFiltered] = useState<Boolean>(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(user.companiesId);

  const handleMonthChange = async (newMonth: Date | null) => {
    if (!newMonth) return;

    setCurrentMonth(newMonth);
    const formattedMonth = format(newMonth, "yyyy-MM-dd");

    try {
      const response = await fetch("/api/alokasi-bulanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: formattedMonth, user: userId }),
      });

      if (!response.ok) {
        toast({
          title: "Gagal",
          description: `HTTP error! Status: ${response.status}`,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const newData = await response.json();

      if (!newData.data || newData.data.length === 0) {
        toast({
          title: "Tidak ada data",
          description: "Tidak ditemukan data untuk bulan tersebut.",
          variant: "destructive",
          duration: 1000,
        });
        setFilteredData([]); // Kosongkan jika perlu
      } else {
        setFilteredData(newData.data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="mx-5">
      <div className="mb-4">
        {/* Summary Cards */}{" "}
        <div className="flex md:flex-row items-start md:items-center gap-4 my-3">
          <div className="pl-2">
            <h1 className="text-xl md:text-2xl font-bold">Alokasi Bulanan </h1>
          </div>
        </div>
        <div className="pt-2 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 mb-4">
          <InfoCard
            icon={<CalendarCheck className="h-10 w-10 text-white" />}
            title="TOTAL TABUNG"
            value={formatNumberQty(calculateMontlyQty(filteredData))}
          />
          <InfoCard
            icon={<Weight className="h-10 w-10 text-white" />}
            title="TOTAL BERAT TABUNG"
            value={formatNumberQty(calculateMontlyQty(filteredData) * 3)}
            unit="Kg"
          />
          <InfoCard
            icon={<Database className="h-10 w-10 text-white" />}
            title="TOTAL AGEN"
            value={filteredData.length}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {user.role === "ADMIN" && (
            <Button variant="default" asChild className="w-full md:w-auto">
              <Link href="alokasi-bulanan/upload" className="flex items-center">
                <Upload className="h-4 w-4 mr-2 cursor-pointer" />
                <span className="truncate">Upload Alokasi Bulanan</span>
              </Link>
            </Button>
          )}

          <div className="w-full md:w-auto flex md:items-center gap-2 items-center">
            {/* {loading ? (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md shadow-sm animate-fade-in">
                <Loader2
                  className="animate-spin h-5 w-5 text-gray-500"
                  strokeWidth={2.5}
                />
                <span className="text-sm text-gray-700 font-medium">
                  Mengambil Data...
                </span>
              </div>
            ) : ( */}
            <MonthPicker
              currentMonth={currentMonth!}
              onMonthChange={handleMonthChange}
              placeholder={
                currentMonth
                  ? format(currentMonth, "MMMM yyyy", { locale: id })
                  : "Semua Bulan"
              }
              className="flex-1"
            />

            {/* )} */}
            {/* {isFiltered && (
              <Button
                variant={"destructive"}
                onClick={handleClearSearch}
                className="flex-2"
              >
                <X />
              </Button>
            )} */}
          </div>
        </div>
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
};

export default AlokasiBulanan;
