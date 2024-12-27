"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  CalendarCheck,
  Database,
  Handshake,
  Plus,
  Printer,
  SearchX,
  Weight,
} from "lucide-react";
import {
  calculateTotalAgen,
  calculateTotalQty,
  formatNumberQty,
  normalizeDateFrom,
  normalizeDateTo,
} from "@/utils/page";
import { format } from "date-fns";
import { getMonthlyAllocation, getSummary } from "@/app/actions/alokasi.action";
import { ChartConfig } from "@/components/ui/chart";
import RekapPenyaluran from "@/components/FeatureComponents/CetakDistribusi/RekapPenyaluran";
import ComboBox from "@/components/FeatureComponents/ComboBox";
import { DatePickerWithRange } from "@/components/FeatureComponents/DateRange";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import type { User } from "@prisma/client";
import { id } from "date-fns/locale";
import { LpgDistributions } from "@/lib/types";

interface DistributionProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  data2?: TData[];
  user: User;
}

const today = {
  from: new Date(),
  to: new Date(),
};

const PenyaluranElpiji = <TData extends LpgDistributions, TValue>({
  columns,
  data,
  user,
}: DistributionProps<TData, TValue>) => {
  const [notrans, setnotrans] = useState("");
  const [isAgentFiltered, setIsAgentFiltered] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [doNumber, setDoNumber] = useState("");
  const [dateFilter, setDateFilter] = useState<any>("today");
  const [filteredData, setFilteredData] = useState<TData[]>(data);
  const [filtered, setFiltered] = useState<Boolean>(false);
  const [allocationDaily, setAllocationDaily] = useState<any[]>([]);
  const [allocationMonthly, setAllocationMonthly] = useState<any[]>([]);

  const notransOptions = Array.from(
    new Set(data.map((item) => item.bpeNumber))
  ).map((bpeNumber) => ({
    label: bpeNumber,
    value: bpeNumber,
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
      const matchesNoTrans = notrans ? item.bpeNumber === notrans : true;
      const matchesAgentName = agentName ? item.agentName === agentName : true;
      const matchesDoNumber = doNumber
        ? item.deliveryNumber === doNumber
        : true;

      const matchesDate = dateFilter?.from
        ? dateFilter?.to
          ? // For Range Dates
            item.giDate >= normalizeDateFrom(dateFilter.from) &&
            item.giDate <= normalizeDateTo(dateFilter.to)
          : // For Single Dates
            item.giDate >= normalizeDateFrom(dateFilter.from) &&
            item.giDate <= normalizeDateTo(dateFilter.from)
        : dateFilter === "today"
        ? normalizeDateFrom(item.giDate) === normalizeDateTo(new Date())
        : true;

      return (
        matchesNoTrans && matchesAgentName && matchesDate && matchesDoNumber
      );
    });

    setFilteredData(filtered);
  }, [notrans, agentName, doNumber, dateFilter, data]);

  useEffect(() => {
    setIsAgentFiltered(!!agentName);
  }, [agentName]);

  const getMonthly = async () => {
    const data = await getMonthlyAllocation();
    const monthlyData = data.map((item) => ({
      giDate: item.date,
      allocatedQty: item.totalElpiji,
    }));
    setAllocationMonthly(monthlyData);
  };

  const getAllocattion = async () => {
    const { data } = await getSummary();
    const dailyData = data.map((item: any) => ({
      giDate: item.plannedGiDate,
      qty: item.allocatedQty,
    }));
    setAllocationDaily(dailyData);
  };

  useEffect(() => {
    getMonthly();
    getAllocattion();
    setFiltered(true);
    setDateFilter(today);
  }, []);

  const handleClearSearch = () => {
    setAgentName("");
    setDoNumber("");
    setnotrans("");
    setDateFilter(null);
    setFilteredData(data);
    setFiltered(false);
  };

  return (
    <div className="w-full">
      <div className=" items-center py-4 mx-4">
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
                    calculateTotalQty(filteredData, "distributionQty")
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
                    calculateTotalQty(filteredData, "distributionQty") * 3
                  )}{" "}
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
                  TOTAL DISTRIBUSI LPG
                </h1>
                <p className="text-3xl font-extrabold">{filteredData.length}</p>
              </div>
            </div>
          </Card>
        </div>
        <Card className="px-6 py-6 my-3 shadow-lg rounded-2xl bg-white border border-gray-200">
          <div className="px-4 text-center">
            <h1 className="text-lg font-semibold py-2 pb-4">
              Filter Penyaluran Elpiji
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
            <div>
              <Label htmlFor="notrans-search" className="text-lg">
                Nomer Transaksi
              </Label>
              <ComboBox
                data={notransOptions}
                value={notrans}
                setValue={setnotrans}
                placeholder="Semua nomor BPE"
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
                placeholder="Semua number DO"
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
              <div className="flex flex-col sm:flex-row sm:space-x-2 w-full sm:w-auto space-y-2 sm:space-y-0">
                <Button
                  variant="default"
                  className="w-full sm:w-auto flex items-center justify-center"
                  asChild
                >
                  <Link href="penyaluran-elpiji/form">
                    <Plus className="h-4 w-4 mr-2 cursor-pointer" />
                    <span className="truncate">New Penyaluran Elpiji</span>
                  </Link>
                </Button>

                <Button
                  variant="default"
                  className="w-full sm:w-auto flex items-center justify-center"
                  asChild
                >
                  <PDFDownloadLink
                    className="text-center"
                    document={
                      <RekapPenyaluran
                        data={filteredData != null ? filteredData : data}
                        data2={allocationMonthly}
                        data3={allocationDaily}
                        isAgentFiltered={isAgentFiltered}
                      />
                    }
                    fileName={`Rekap Penyaluran Elpiji.pdf`}
                  >
                    <Printer className="h-4 w-4 text-green-500 cursor-pointer mr-2" />
                    <span className="truncate">Cetak Rekap</span>
                  </PDFDownloadLink>
                </Button>
              </div>
            )}

            {/* Bersihkan Pencarian Button */}
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

export default PenyaluranElpiji;
