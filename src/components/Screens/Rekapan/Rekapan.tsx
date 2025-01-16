"use client"
import React, { useMemo, useState } from 'react'
import { DatePickerWithRange } from '@/components/FeatureComponents/DateRange'
import { Card } from '@/components/ui/card'
import { id } from 'date-fns/locale'
import { Link, Plus, Printer, Search, SearchX } from 'lucide-react'
import { Label } from '@radix-ui/react-label'
import { User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import ComboBox from '@/components/FeatureComponents/ComboBox'

interface AgentsProps<TData, TValue> {
  data: TData[];
  user: User;
}

const Rekapan = <TData, TValue>({
  data,
  user,
}: AgentsProps<TData, TValue>) => {
  const [agentName, setAgentName] = useState("");
  const [dateFilter, setDateFilter] = useState<any>("today");
  const [filtered, setFiltered] = useState<Boolean>(false);

  const agentNameOptions = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.agentName))).map(
      (agentName) => ({
        label: agentName,
        value: agentName,
      })
    );
  }, [data]);
  
  const handleClearSearch = () => {
    setAgentName("");
    setDateFilter(null);
    setFiltered(false);
  };
  return (
    <div className="w-full">
      <div className=" items-center py-4 mx-4">
        <Card className="px-6 py-6 my-3 shadow-lg rounded-2xl bg-white border border-gray-200">
          <div className="px-4 text-center">
            <h1 className="text-lg font-semibold py-2 pb-4">
              Filter Rekap
            </h1>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 mb-4">
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
                // asChild
              >
                {/* <PDFDownloadLink
                  className="text-center"
                  document={
                    <Rekapan
                      data={filteredData}
                      data2={allocationMonthly}
                      data3={allocationDaily}
                      isAgentFiltered={isAgentFiltered}
                    />
                  }
                  fileName={`Rekap Penyaluran Elpiji.pdf`}
                > */}
                  <Printer className="h-4 w-4 text-green-500 cursor-pointer mr-2" />
                  <span className="truncate">Cetak Rekap</span>
                {/* </PDFDownloadLink> */}
              </Button>
            </div>
          )}

          {/* Bersihkan Pencarian Button */}
          <div className="w-full sm:w-auto flex gap-2">
            <Button
              variant="default"
              className="w-full sm:w-auto flex items-center justify-center"
              onClick={handleClearSearch}
            >
              <Search className="h-4 w-4 mr-2 cursor-pointer" />
              <span className="truncate">Cari</span>
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-auto flex items-center justify-center"
              onClick={handleClearSearch}
            >
              <SearchX className="h-4 w-4 mr-2 text-red-600 cursor-pointer" />
              <span className="truncate text-red-600">Bersihkan Pencarian</span>
            </Button>
          </div>
        </div>
      </Card>
      </div>
    </div>
  )
}

export default Rekapan
