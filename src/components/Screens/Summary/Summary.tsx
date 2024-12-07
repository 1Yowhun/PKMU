"use client";

import { ChartComponent } from "@/components/FeatureComponents/Chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  calculateSummaryQty,
  formatNumberQty,
  getAnnualTotalQty,
  getTodayTotalQty,
  getWeeklyTotalQty,
  normalizeDateFrom,
  normalizeDateTo,
} from "@/utils/page";
import { id } from "date-fns/locale";
import { CalendarCheck, CalendarDays, Clock4, PackagePlus, ScrollText, SearchX } from "lucide-react";
import { DatePickerWithRange } from "@/components/FeatureComponents/DateRange";
import { Button } from "@/components/ui/button";
import SummaryItems from "@/components/FeatureComponents/SummaryItems";

interface AllocationData {
  plannedGiDate: Date | null;
  allocatedQty?: number;
  lpgDistribution: {
    giDate: Date;
    distributionQty: number;
  } | null;
}

interface SummaryProps {
  monthly: DataConfig[];
  data: AllocationData[];
}

interface DataConfig {
  date: Date;
  qty?: number;
}

const Summary = ({ data, monthly }: SummaryProps) => {
  // Summary Chart
  const [monthlyAllocation, setMonthlyAllocation] = useState<DataConfig[]>([]);
  const [dailyAllocation, setDailyAllocation] = useState<DataConfig[]>([]);
  const [dailyDistribution, setDailyDistribution] = useState<DataConfig[]>([]);
  
  // Filtering Data 
  const [dateFilter, setDateFilter] = useState<any>(null);
  const [filteredDaily, setFilteredDaily] = useState<AllocationData[]>([]);
  const [filteredMonthly, setFilteredMonthly] = useState<DataConfig[]>([]);
  const [filteredDistribution, setFilteredDistribution] = useState<AllocationData[]>([]);
  
  const totalDailyQty = calculateSummaryQty(filteredDaily, "allocatedQty");
  const totalMonthlyQty = calculateSummaryQty(filteredMonthly, "totalElpiji");
  const totalDistributionlyQty = calculateSummaryQty(filteredDistribution, "lpgDistribution.distributionQty");

  const calculateDiff = (a: number, b: number) =>{
    return (Math.abs(a-b))
  }
  const totalPending = Math.abs(totalDailyQty - totalDistributionlyQty);
  const totalFakultatif = Math.abs( totalMonthlyQty - totalDailyQty);

  const filterByDate = (itemDate: Date, day?:string) => {
    const matchesDate = dateFilter?.from
      ? dateFilter?.to
        ? normalizeDateFrom(itemDate) >= normalizeDateFrom(dateFilter.from) &&
          normalizeDateTo(itemDate) <= normalizeDateTo(dateFilter.to)
        : normalizeDateFrom(itemDate) >= normalizeDateFrom(dateFilter.from) &&
          normalizeDateTo(itemDate) <= normalizeDateTo(dateFilter.from)
      : day
    ? normalizeDateFrom(new Date()) === normalizeDateTo(new Date())
    : true;
    return matchesDate; 
  };

  // Config all data to date and qty only
  useEffect(() => {
    console.log(data)
    console.log(monthly)
    const monthlyData = monthly.map((item: any) => ({
      date: item.date,
      qty: item.totalElpiji,
    }));

    const dailyData = data.map((item: any) => ({
      date: item.plannedGiDate,
      qty: item.allocatedQty,
    }));
    
    const distributionData = data
      .filter((item: any) => item.lpgDistribution !== null) 
      .map((item: any) => ({
        date: item.lpgDistribution.giDate,
        qty: item.lpgDistribution.distributionQty ?? 0, 
      }));

    // const filteredTodayDaily = dailyData.filter((item: { date: any; }) => filterByDate(item.date,"today"));
    // const filteredTodayMonthly = monthlyData.filter((item: { date: any; }) => filterByDate(item.date, "today"));
    // const filteredTodayDistribution = distributionData.filter((item: { date: any; }) => filterByDate(item.date, "today"));

    setDailyAllocation(dailyData);
    setMonthlyAllocation(monthlyData);
    setDailyDistribution(distributionData);
  }, [data, monthly]);

  useEffect(() => {
    // const fromDate = dateFilter?.from ? normalizeDateFrom(dateFilter.from) : null;
    // const toDate = dateFilter?.to ? normalizeDateTo(dateFilter.to) : null;

    // Apply filters
    const filteredDailyData = data.filter((item: { plannedGiDate: any; }) => filterByDate(item.plannedGiDate));
    // const filteredMonthlyData = monthly.filter((item) => filterByDate(item.date));
    // const filteredDistributionData = data
    //   .filter((item: { lpgDistribution: null; }) => item.lpgDistribution !== null)
    //   .filter((item: { lpgDistribution: { giDate: any; }; }) => filterByDate(item.lpgDistribution.giDate));
    
    const filteredMonthlyData = monthly.filter((item) =>
      filterByDate(item.date)
    );

    const filteredDistributionData = data
      .filter((item) => item.lpgDistribution !== null)
      .filter((item) =>
        item.lpgDistribution?.giDate
          ? filterByDate(item.lpgDistribution.giDate)
          : false
      );

    setFilteredDaily(filteredDailyData);
    setFilteredMonthly(filteredMonthlyData);
    setFilteredDistribution(filteredDistributionData);
  }, [data, monthly, dateFilter]);
  
  const handleClearSearch = () => {
    setDateFilter(null);
  };

  const chartConfig = {
    monthlyQty: {
      label: "Bulanan",
      color: "hsl(var(--chart-1))",
    },
    dailyQty: {
      label: "Harian",
      color: "hsl(var(--chart-2))",
    },
    distributionQty: {
      label: "Penyaluran Elpiji",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="py-6 mx-6">
      <div className="mb-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 my-4">
        <div className="pl-2">
          <h1 className="text-xl md:text-2xl font-bold">Ringkasan Eksekutif</h1>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 ml-auto">
          <DatePickerWithRange
            value={dateFilter}
            onDateChange={setDateFilter}
            placeholder={
              dateFilter?.from && dateFilter?.to
                ? `${format(dateFilter.from, "dd MMMM yyyy", { locale: id })} - ${format(
                    dateFilter.to,
                    "dd MMMM yyyy",
                    { locale: id }
                  )}`
                : "Semua Tanggal"
                // : format(new Date(), "dd MMMM yyyy", { locale: id })
            }
          />
          <Button variant="default" onClick={handleClearSearch} className="w-full md:w-auto">
            <SearchX className="h-5 w-5 mr-2 cursor-pointer" /> Bersihkan Pencarian
          </Button>
        </div>
      </div>

        {/* TODAY */}
        <Card className="px-6 py-6 my-5 shadow-lg rounded-2xl bg-white border border-gray-200">
          <h1 className="text-2xl font-semibold mb-4">Wawasan Hari Ini</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3 justify-between px-2">
          <SummaryItems
              icon={<CalendarCheck className="h-10 w-10 text-white" />}
              title={`TOTAL ALOKASI HARIAN`}
              value={`${formatNumberQty(getTodayTotalQty(dailyAllocation))} / `}
              additionalInfo={`${formatNumberQty(getTodayTotalQty(dailyAllocation) * 3)} Kg`}
            />
            
            <SummaryItems
              icon={<CalendarDays className="h-10 w-10 text-white" />}
              title={`TOTAL ALOKASI BULANAN`}
              value={`${formatNumberQty(getTodayTotalQty(monthlyAllocation))} / `}
              additionalInfo={`${formatNumberQty(getTodayTotalQty(monthlyAllocation) * 3)} Kg`}
            />
            
            <SummaryItems
              icon={<ScrollText className="h-10 w-10 text-white" />}
              title={`TOTAL PENYALURAN LPG`}
              value={`${formatNumberQty(getTodayTotalQty(dailyDistribution))} / `}
              additionalInfo={`${formatNumberQty(getTodayTotalQty(dailyDistribution) * 3)} Kg`}
            />
            
            <SummaryItems
              icon={<Clock4 className="h-10 w-10 text-white" />}
              title={"TOTAL PENDING"}
              value={`${formatNumberQty(calculateDiff(getTodayTotalQty(dailyAllocation), getTodayTotalQty(dailyDistribution)))} / `}
              additionalInfo={`${formatNumberQty(calculateDiff(getTodayTotalQty(dailyAllocation), getTodayTotalQty(dailyDistribution)) * 3)} Kg`}
            />
            
            <SummaryItems
              icon={<PackagePlus className="h-10 w-10 text-white" />}
              title={"TOTAL FAKULTATIF"}
              value={`${formatNumberQty(calculateDiff(getTodayTotalQty(monthlyAllocation), getTodayTotalQty(dailyAllocation)))} / `}
              additionalInfo={`${formatNumberQty(calculateDiff(getTodayTotalQty(monthlyAllocation), getTodayTotalQty(dailyAllocation)) * 3)} Kg`}
            />
          </div>
        </Card>

        {/* FILTER DATA */}
        <Card className="px-6 py-6 my-5 shadow-lg rounded-2xl bg-white border border-gray-200 mb-5">
          <h1 className="text-2xl font-semibold mb-4">Ringkasan</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3 justify-between px-2">
          <SummaryItems
              icon={<CalendarCheck className="h-10 w-10 text-white" />}
              title={`TOTAL ALOKASI HARI INI (${filteredDaily.length})`}
              value={`${formatNumberQty(totalDailyQty)} / `}
              additionalInfo={`${formatNumberQty(totalDailyQty * 3)} Kg`}
              cs={"p-4"}
            />
            
            <SummaryItems
              icon={<CalendarDays className="h-10 w-10 text-white" />}
              title={`TOTAL ALOKASI BULANAN (${filteredMonthly.length})`}
              value={`${formatNumberQty(totalMonthlyQty)} / `}
              additionalInfo={`${formatNumberQty(totalMonthlyQty * 3)} Kg`}
              cs={"p-4"}
            />
            
            <SummaryItems
              icon={<ScrollText className="h-10 w-10 text-white" />}
              title={`TOTAL PENYALURAN LPG (${filteredDistribution.length})`}
              value={`${formatNumberQty(totalDistributionlyQty)} / `}
              additionalInfo={`${formatNumberQty(totalDistributionlyQty * 3)} Kg`}
              cs={"p-4"}
            />
            
            <SummaryItems
              icon={<Clock4 className="h-10 w-10 text-white" />}
              title={"TOTAL PENDING"}
              value={`${formatNumberQty(totalPending)} / `}
              additionalInfo={`${formatNumberQty(totalPending * 3)} Kg`}
              cs={"p-4"}
            />
            
            <SummaryItems
              icon={<PackagePlus className="h-10 w-10 text-white" />}
              title={"TOTAL FAKULTATIF"}
              value={`${formatNumberQty(totalFakultatif)} / `}
              additionalInfo={`${formatNumberQty(totalFakultatif * 3)} Kg`}
              cs={"p-4"}
            />
          </div>
        </Card>
      </div>

      <div className="mb-16"></div>
        <div className="my-5">
          <div className="pl-2 mt-5">
            <h1 className="text-2xl font-semibold mb-4 mx-3">Chart Jumlah Tabung</h1>
          </div>
          <Card className="flex flex-col w-full h-[520px] pb-3 shadow-lg rounded-2xl bg-white ">
            <CardHeader className="pb-0">
              <CardTitle>Minggu ini</CardTitle>
              <CardDescription>
                Mingguan ({format(new Date(), "dd MMMM yyyy", { locale: id })})
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 pl-2">
              <ChartComponent
                data={getWeeklyTotalQty(dailyAllocation)}
                data2={getWeeklyTotalQty(monthlyAllocation)}
                data3={getWeeklyTotalQty(dailyDistribution)}
                config={chartConfig}
                title="Tabung Elpiji"
                timeFrame="weekdays"
              />
            </CardContent>
          </Card>
          <div className="mb-6"></div>
          <Card className="flex flex-col w-full h-[520px] pb-3 shadow-lg rounded-2xl bg-white ">
            <CardHeader className="pb-0">
              <CardTitle>Tahun ini</CardTitle>
              <CardDescription>
                Tahunan ({format(new Date(), "MMMM yyyy", { locale: id })})
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 pl-2">
              <ChartComponent
                data={getAnnualTotalQty(dailyAllocation)}
                data2={getAnnualTotalQty(monthlyAllocation)}
                data3={getAnnualTotalQty(dailyDistribution)}
                config={chartConfig}
                title="Tabung Elpiji"
                timeFrame="monthly"
              />
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default Summary;
