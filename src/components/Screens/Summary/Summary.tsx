"use client";

import { ChartComponent } from "@/components/FeatureComponents/Chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { id } from "date-fns/locale";
import {
  CalendarCheck,
  CalendarDays,
  CalendarX2,
  ChartSpline,
  Clock4,
  Download,
  Loader2,
  PackagePlus,
  ScrollText,
  Search,
  X,
} from "lucide-react";
import { DatePickerWithRange } from "@/components/FeatureComponents/DateRange";
import { Button } from "@/components/ui/button";
import SummaryItems from "@/components/FeatureComponents/SummaryItems";

import { Prisma } from "../../../../generated/prisma_client";
import {
  allDataDefault,
  getAnnualSummaryData,
  getSummaryToday,
  getWeeklySummaryDefault,
} from "@/app/actions/summary.action";
import { downloadAnnuallyChart, downloadWeeklyChart } from "@/utils/page";

type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  role: string;
  companiesId: number | null;
};
// 🟢 Ambil otomatis tipe return dari getSummaryToday
type SummaryProps = {
  defaultdata: Prisma.PromiseReturnType<typeof getSummaryToday>;
  weekly: Prisma.PromiseReturnType<typeof getWeeklySummaryDefault>;
  annually: Prisma.PromiseReturnType<typeof getAnnualSummaryData>;
  allData: any;
  user: User;
};

const Summary = ({
  defaultdata,
  weekly,
  annually,
  allData,
  user,
}: SummaryProps) => {
  const [summaryData, setSummaryData] = useState(defaultdata);
  const [allDataSummary, setAllDataSummary] = useState(allData);
  const [weeklySummary, setWeeklySummary] = useState(weekly);
  const [annualSummary, setAnnualSummary] = useState(annually);
  const [userId, setUserId] = useState(user);

  const weeklyChartRef = useRef(null);
  const annuallyChartRef = useRef(null);

  // Filtering Data
  const [loading, setLoading] = useState<boolean>(false);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<{
    from: Date | null;
    to: Date | null;
  } | null>();

  const allocationData = weeklySummary.weeklySummary.map((item) => ({
    date: new Date(item.date).toLocaleDateString("id-ID"), // Format jadi YYYY-MM-DD
    qty: Number(item.dailySummary),
  }));

  const distributionData = weeklySummary.weeklySummary.map((item) => ({
    date: new Date(item.date).toLocaleDateString("id-ID"),
    qty: Number(item.distributionSummary),
  }));

  const totalElpijiData = weeklySummary.weeklySummary.map((item) => ({
    date: new Date(item.date).toLocaleDateString("id-ID"),
    qty: item.totalElpiji,
  }));

  const allocationDataAnually = annualSummary.map((item: any) => ({
    date: item.month,
    qty: item.totalAllocatedQty,
  }));

  const distributionDataAnually = annualSummary.map((item: any) => ({
    date: item.month,
    qty: item.totalDistributionQty,
  }));

  const totalElpijiDataAnually = annualSummary.map((item: any) => ({
    date: item.month,
    qty: item.totalMonthlyElpiji,
  }));

  const fetchSummary = async (
    tgl: { from: Date | null; to: Date | null } | null
  ) => {
    if (!tgl) return;

    setDateFilter(tgl);
    setIsFiltered(true);
    setLoading(true);

    try {
      const response = await fetch("/api/filter-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: userId.companiesId,
          from: tgl.from,
          to: tgl.to,
        }),
      });

      if (!response.ok) {
        console.error(`API responded with status ${response.status}`);
      }

      const data = await response.json();

      const allData = {
        allSummary: {
          _count: {
            _all: data?.dailySummary?._count.allocatedQty ?? 0,
          },
          _sum: {
            allocatedQty: data?.dailySummary?._sum?.allocatedQty ?? 0,
          },
        },
        allDistributionSummary: {
          _count: {
            _all: data?.distributionSummary?._count.distributionQty ?? 0,
          },
          _sum: {
            distributionQty:
              data?.distributionSummary?._sum?.distributionQty ?? 0,
          },
        },
        allMonthlyData: {
          _count: {
            _all: data?.monthlyData?._count.totalElpiji ?? 0,
          },
          _sum: {
            totalElpiji: data?.monthlyData?._sum?.totalElpiji ?? 0,
          },
        },
        allAvgDistribution: {
          _count: {
            businessDays: data?.avgDistriSummary?._count?.businessDays ?? 0,
          },
          _sum: {
            average: data?.avgDistriSummary?._sum?.average ?? 0,
          },
        },
        pending: data?.pending ?? 0,
        fakultatif: data?.fakultatif ?? 0,
        tidakTembus: data?.tidakTembus ?? 0,
      };

      setAllDataSummary(allData);
    } catch (error) {
      console.error("Error sending date range:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (dateFilter) {
      fetchSummary(dateFilter);
    }
  };

  const handleReset = () => {
    setDateFilter(null);
    setIsFiltered(false);
    setAllDataSummary(allData);
  };

  return (
    <div className="mx-5">
      <div className="mb-4">
        <div className="flex md:flex-row items-start md:items-center gap-4 my-4">
          <div className="pl-2">
            <h1 className="text-xl md:text-2xl font-bold">
              Ringkasan Eksekutif
            </h1>
          </div>
        </div>

        {/* TODAY */}
        <Card className="px-6 py-6 my-5 shadow-lg rounded-2xl bg-white border border-gray-200">
          <h1 className="text-2xl font-semibold mb-1 ">
            Wawasan Hari Ini
            <span className="text-sm m-3 font-semibold text-gray-500 mb-1">
              ({format(new Date(), "dd MMMM yyyy")})
            </span>
          </h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3 justify-between">
            <SummaryItems
              icon={<CalendarCheck className="h-10 w-10 text-white" />}
              title={`ALOKASI HARIAN`}
              value={`${
                summaryData?.dailySummaryPlanned._sum.allocatedQty
                  ? (summaryData?.dailySummaryPlanned._sum.allocatedQty).toLocaleString(
                      "id-ID"
                    )
                  : 0
              } / `}
              additionalInfo={`${
                summaryData?.dailySummaryPlanned._sum.allocatedQty
                  ? (
                      summaryData?.dailySummaryPlanned._sum.allocatedQty * 3
                    ).toLocaleString("id-ID")
                  : "0"
              } Kg`}
            />

            <SummaryItems
              icon={<CalendarDays className="h-10 w-10 text-white" />}
              title={`ALOKASI BULANAN`}
              value={`${summaryData?.safeMonthlyData.totalElpiji.toLocaleString(
                "id-ID"
              )} / `}
              additionalInfo={`${summaryData?.safeMonthlyData.volume.toLocaleString(
                "id-ID"
              )} Kg`}
            />

            <SummaryItems
              icon={<ScrollText className="h-10 w-10 text-white" />}
              title={`PENYALURAN LPG`}
              value={`${
                summaryData?.distributionSummary._sum.distributionQty
                  ? (summaryData?.distributionSummary._sum.distributionQty).toLocaleString(
                      "id-ID"
                    )
                  : 0
              } / `}
              additionalInfo={`${
                summaryData?.distributionSummary._sum.distributionQty
                  ? (
                      summaryData?.distributionSummary._sum.distributionQty * 3
                    ).toLocaleString("id-ID")
                  : "0"
              } Kg`}
            />

            <SummaryItems
              icon={<Clock4 className="h-10 w-10 text-white" />}
              title={"PENDING HARIAN"}
              value={`${summaryData?.pending.toLocaleString("id-ID")} / `}
              additionalInfo={`${(
                (summaryData?.pending ?? 0) * 3
              ).toLocaleString("id-ID")} Kg`}
            />

            <SummaryItems
              icon={<PackagePlus className="h-10 w-10 text-white" />}
              title={"TOTAL FAKULTATIF"}
              value={`${summaryData?.fakultatif.toLocaleString("id-ID")} / `}
              additionalInfo={`${(
                (summaryData?.fakultatif ?? 0) * 3
              ).toLocaleString("id-ID")} Kg`}
            />

            <SummaryItems
              icon={<CalendarX2 className="h-10 w-10 text-white" />}
              title={"TOTAL ALOKASI TIDAK DITEBUS"}
              value={`${summaryData?.tidakTembus.toLocaleString("id-ID")} / `}
              additionalInfo={`${(
                (summaryData?.tidakTembus ?? 0) * 3
              ).toLocaleString("id-ID")} Kg`}
            />
          </div>
        </Card>

        {/* FILTER DATA */}
        <Card className="p-4 sm:p-6 my-5 shadow-lg rounded-2xl bg-white border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold">
              Ringkasan
              <span className="text-xs sm:text-sm ml-2 font-semibold text-gray-500">
                {dateFilter?.from ? (
                  dateFilter.to ? (
                    <>
                      {format(dateFilter.from, "dd MMMM yyyy", { locale: id })}{" "}
                      - {format(dateFilter.to, "dd MMMM yyyy", { locale: id })}
                    </>
                  ) : (
                    format(dateFilter.from, "dd MMMM yyyy", { locale: id })
                  )
                ) : (
                  <span>Semua Tanggal</span>
                )}
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full sm:w-auto">
              <DatePickerWithRange
                value={dateFilter}
                onDateChange={(txt) => setDateFilter(txt)}
                placeholder={
                  dateFilter?.from && dateFilter?.to
                    ? `${format(dateFilter.from, "dd MMMM yyyy", {
                        locale: id,
                      })} - ${format(dateFilter.to, "dd MMMM yyyy", {
                        locale: id,
                      })}`
                    : "Semua Tanggal"
                }
                className="w-full"
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex-1 sm:flex-none"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Cari
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReset}
                  className="flex sm:flex-none"
                >
                  <X className="h-4 w-4 " />
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
            <SummaryItems
              icon={
                <CalendarCheck className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              }
              title={`TOTAL ALOKASI HARIAN (${
                allDataSummary?.allSummary?._count?._all?.toLocaleString(
                  "id-ID"
                ) || 0
              })`}
              value={`${(
                allDataSummary.allSummary._sum.allocatedQty ?? 0
              ).toLocaleString("id-ID")} / `}
              additionalInfo={`${(
                (allDataSummary.allSummary._sum.allocatedQty ?? 0) * 3
              ).toLocaleString("id-ID")} Kg`}
              cs="p-4"
            />
            <SummaryItems
              icon={
                <CalendarDays className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              }
              title={`TOTAL ALOKASI BULANAN (${allDataSummary.allMonthlyData._count._all.toLocaleString(
                "id-ID"
              )})`}
              value={`${(
                allDataSummary.allMonthlyData._sum.totalElpiji ?? 0
              ).toLocaleString("id-ID")} / `}
              additionalInfo={`${(
                (allDataSummary.allMonthlyData._sum.totalElpiji ?? 0) * 3
              ).toLocaleString("id-ID")} Kg`}
              cs="p-4"
            />
            <SummaryItems
              icon={
                <ScrollText className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              }
              title={`TOTAL PENYALURAN LPG (${allDataSummary.allDistributionSummary._count._all.toLocaleString(
                "id-ID"
              )})`}
              value={`${(
                allDataSummary.allDistributionSummary._sum.distributionQty ?? 0
              ).toLocaleString("id-ID")} / `}
              additionalInfo={`${(
                (allDataSummary.allDistributionSummary._sum.distributionQty ??
                  0) * 3
              ).toLocaleString("id-ID")} Kg`}
              cs="p-4"
            />
            <SummaryItems
              icon={<Clock4 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />}
              title="TOTAL PENDING HARIAN"
              value={`${allDataSummary.pending.toLocaleString("id-ID")} / `}
              additionalInfo={`${(allDataSummary.pending * 3).toLocaleString(
                "id-ID"
              )} Kg`}
              cs="p-4"
            />
            <SummaryItems
              icon={
                <PackagePlus className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              }
              title="TOTAL FAKULTATIF"
              value={`${allDataSummary.fakultatif.toLocaleString("id-ID")} / `}
              additionalInfo={`${(allDataSummary.fakultatif * 3).toLocaleString(
                "id-ID"
              )} Kg`}
              cs="p-4"
            />
            <SummaryItems
              icon={
                <CalendarX2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              }
              title="TOTAL ALOKASI TIDAK DITEBUS"
              value={`${allDataSummary.tidakTembus.toLocaleString("id-ID")} / `}
              additionalInfo={`${(
                allDataSummary.tidakTembus * 3
              ).toLocaleString("id-ID")} Kg`}
              cs="p-4"
            />
            <SummaryItems
              icon={
                <ChartSpline className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              }
              title={`RATA-RATA DISTRIBUSI (${
                allDataSummary?.allAvgDistribution._count.businessDays.toLocaleString(
                  "id-ID"
                ) || 0
              } Hari Kerja) `}
              value={`${Number(
                allDataSummary?.allAvgDistribution._sum.average
              ).toLocaleString("id-ID")} / `}
              additionalInfo={`${(
                Number(allDataSummary?.allAvgDistribution._sum.average) * 3
              ).toLocaleString("id-ID")} Kg`}
              cs="p-4"
            />
            {/* </>
            )} */}
          </div>
        </Card>
      </div>

      <div className="mb-16" />
      <div className="my-5">
        <div className="pl-2 mt-5">
          <div className="md:flex items-center justify-between mx-1 mb-4">
            <h1 className="text-2xl font-semibold">Chart Jumlah Tabung</h1>
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <Button
                onClick={() => {
                  downloadWeeklyChart(weeklyChartRef);
                }}
                className="w-full md:w-auto flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                <span className="truncate">Chart Mingguan</span>
              </Button>
              <Button
                onClick={() => {
                  downloadAnnuallyChart(annuallyChartRef);
                }}
                className="w-full md:w-auto flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                <span className="truncate">Chart Tahunan</span>
              </Button>
            </div>
          </div>
        </div>

        <div ref={weeklyChartRef} id="chart-weekly">
          <Card className="flex flex-col w-full h-[550px] pb-3 shadow-lg rounded-2xl bg-white ">
            <CardHeader className="pb-0">
              <CardTitle>Minggu ini</CardTitle>
              <CardDescription>
                {format(weeklySummary.startDate, "dd MMMM yyyy", {
                  locale: id,
                })}{" "}
                - {""}
                {format(weeklySummary.endDate, "dd MMMM yyyy", { locale: id })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 pl-2">
              <ChartComponent
                data={allocationData}
                data2={totalElpijiData}
                data3={distributionData}
                title="Tabung Elpiji"
                timeFrame="weekly"
              />
            </CardContent>
            <CardContent className="flex-1 pb-0 pl-2"></CardContent>
          </Card>
        </div>
        <div className="mb-6"></div>
        <div ref={annuallyChartRef} id="chart-annual">
          <Card className="flex flex-col w-full h-[550px] pb-3 shadow-lg rounded-2xl bg-white ">
            <CardHeader className="pb-0">
              <CardTitle>Tahun ini</CardTitle>
              <CardDescription>
                {format(new Date(), "MMMM yyyy", { locale: id })}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 pl-2">
              <ChartComponent
                data={allocationDataAnually}
                data2={totalElpijiDataAnually}
                data3={distributionDataAnually}
                title="Tabung Elpiji"
                timeFrame="monthly"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Summary;
