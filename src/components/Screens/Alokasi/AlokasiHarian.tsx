"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import { DataTable } from "../../ui/data-table";
import Link from "next/link";
import { Label } from "../../ui/label";
import ComboBox from "../../FeatureComponents/ComboBox";
import {
  CalendarCheck,
  Database,
  Handshake,
  SearchX,
  Upload,
  Weight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DatePickerWithRange } from "../../FeatureComponents/DateRange";
import {
  calculateTotalAgen,
  calculateTotalQty,
  formatNumberQty,
  normalizeDateFrom,
  normalizeDateTo,
} from "@/utils/page";
import { Card } from "../../ui/card";
import type { User } from "@prisma/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Allocation } from "@/lib/types";

interface AlokasiProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  user: User;
}

const today = {
  from: new Date(),
  to: new Date(),
};

const AlokasiHarian = <
  TData extends Allocation,
  TValue
>({
  columns,
  data,
  user,
}: AlokasiProps<TData, TValue>) => {
  const [status, setStatus] = useState("");
  const [agentName, setAgentName] = useState("");
  const [doNumber, setDoNumber] = useState("");
  const [dateFilter, setDateFilter] = useState<any>("today");
  const [filteredData, setFilteredData] = useState<TData[]>(data);
  const [filtered, setFiltered] = useState<Boolean>(false);

  const statusOptions = Array.from(
    new Set(data.map((item) => item.status))
  ).map((status) => ({
    label: status,
    value: status,
  }));

  const agentNameOptions = Array.from(
    new Set(data.map((item) => item.agentName))
  ).map((agentName) => ({
    label: agentName,
    value: agentName,
  }));

  const doNumberOptions = Array.from(
    new Set(data.map((item) => item.deliveryNumber))
  ).map((deliveryNumber) => ({
    label: deliveryNumber,
    value: deliveryNumber,
  }));

  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesStatus = status ? item.status === status : true;
      const matchesAgentName = agentName ? item.agentName === agentName : true;
      const matchesDoNumber = doNumber
        ? item.deliveryNumber === doNumber
        : true;

      const matchesDate = dateFilter?.from
        ? dateFilter?.to
          ? normalizeDateFrom(item.plannedGiDate) >=
              normalizeDateFrom(dateFilter.from) &&
            normalizeDateTo(item.plannedGiDate) <=
              normalizeDateTo(dateFilter.to)
          : normalizeDateFrom(item.plannedGiDate) >=
              normalizeDateFrom(dateFilter.from) &&
            normalizeDateTo(item.plannedGiDate) <=
              normalizeDateTo(dateFilter.from)
        : dateFilter === "today"
        ? normalizeDateFrom(item.plannedGiDate) === normalizeDateTo(new Date())
        : true;
      return (
        matchesStatus && matchesAgentName && matchesDoNumber && matchesDate
      );
    });

    setFilteredData(filtered);
  }, [status, agentName, doNumber, dateFilter, data]);

  useEffect(() => {
    if (data.length > 0) {
      setStatus("Pending");
    }
    setFiltered(true);
    setDateFilter(today);
  }, []);

  const handleClearSearch = () => {
    setStatus("");
    setAgentName("");
    setDoNumber("");
    setDateFilter(null);
    setFilteredData(data);
    setFiltered(false);
  };

  return (
    <div className="w-full">
      <div className="items-center py-4 mx-4">
        <div className="pt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <Card className="px-6 py-6 my-1 shadow-lg rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-black rounded-xl p-2">
                <CalendarCheck className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-400 mb-1">
                  TOTAL TABUNG
                </h1>
                <p className="text-3xl font-extrabold">
                  {formatNumberQty(
                    calculateTotalQty(filteredData, "allocatedQty")
                  )}
                </p>
              </div>
            </div>
          </Card>
          <Card className="px-6 py-6 my-1 shadow-lg rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-black rounded-xl p-2">
                <Weight className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-400 mb-1">
                  TOTAL BERAT TABUNG
                </h1>
                <p className="text-3xl font-extrabold">
                  {formatNumberQty(
                    calculateTotalQty(filteredData, "allocatedQty") * 3
                  )}
                  <span className="text-xl text-gray-600"> Kg</span>
                </p>
              </div>
            </div>
          </Card>
          <Card className="px-6 py-6 my-1 shadow-lg rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-black rounded-xl p-2">
                <Handshake className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-400 mb-1">
                  TOTAL AGEN
                </h1>
                <p className="text-3xl font-extrabold">
                  {calculateTotalAgen(filteredData)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="px-6 py-6 my-1 shadow-lg rounded-2xl bg-white border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-black rounded-xl p-2">
                <Database className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-400 mb-1">
                  TOTAL ALOKASI HARIAN
                </h1>
                <p className="text-3xl font-extrabold">{filteredData.length}</p>
              </div>
            </div>
          </Card>
        </div>
        <Card className="px-6 py-6 my-3 shadow-lg rounded-2xl bg-white border border-gray-200">
          <div className="px-4 text-center">
            <h1 className="text-lg font-semibold py-2 pb-4">Filter Alokasi</h1>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
            <div>
              <Label htmlFor="status-search" className="text-lg">
                Status
              </Label>
              <ComboBox
                data={statusOptions}
                value={status}
                setValue={setStatus}
                placeholder="Semua status"
              />
            </div>
            <div>
              <Label htmlFor="agent-search" className="text-lg">
                Name Agen
              </Label>
              <ComboBox
                data={agentNameOptions}
                value={agentName}
                setValue={setAgentName}
                placeholder="Semua agen"
              />
            </div>

            <div>
              <Label htmlFor="do-search" className="text-lg">
                Nomer DO
              </Label>
              <ComboBox
                data={doNumberOptions}
                value={doNumber}
                setValue={setDoNumber}
                placeholder="Semua nomor DO"
              />
            </div>

            <div>
              <Label htmlFor="date-search" className="text-lg">
                Tanggal
              </Label>
              <DatePickerWithRange
                value={dateFilter}
                onDateChange={setDateFilter}
                placeholder={
                  filtered
                    ? `${format(new Date(), "dd MMMM yyyy", { locale: id })}`
                    : "Semua Tanggal"
                }
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-3 space-y-2 sm:space-y-0 sm:space-x-2">
            {user.role === "ADMIN" && (
              <div className="w-full sm:w-auto">
                <Button
                  variant="default"
                  className="w-full sm:w-auto flex items-center justify-center"
                  asChild
                >
                  <Link href="alokasi-harian/upload">
                    <Upload className="h-4 w-4 mr-2 cursor-pointer" />
                    <span className="truncate">Upload Alokasi</span>
                  </Link>
                </Button>
              </div>
            )}

            <div className="w-full sm:w-auto">
              <Button
                variant="default"
                className="w-full sm:w-auto flex items-center justify-center"
                onClick={handleClearSearch}
              >
                <SearchX className="h-4 w-4 mr-2 cursor-pointer" />
                <span className="truncate">Bersihkan Pencarian</span>
              </Button>
            </div>
          </div>
        </Card>
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
};

export default AlokasiHarian;
