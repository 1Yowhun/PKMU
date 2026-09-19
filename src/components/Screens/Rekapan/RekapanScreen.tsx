"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ComboBoxNelsen from "@/components/FeatureComponents/ComboBoxNelsen";
import {
  adminLpgDistributionColumns,
  lpgDistributionColumns,
} from "@/lib/Column";
import Pagination from "@/components/FeatureComponents/Pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { format, set } from "date-fns";
import InfoCard from "@/components/InfoCard";
import {
  CalendarCheck,
  Database,
  Handshake,
  Loader2,
  Plus,
  Search,
  SearchX,
  Upload,
  Weight,
  X,
} from "lucide-react";
import { DataTableBackEnd } from "@/components/FeatureComponents/DataTableBackEnd";
import { DataTable } from "@/components/ui/data-table";
import { id } from "date-fns/locale";
import { User } from "../../../../generated/prisma_client";
import Link from "next/link";

type valuesFilter = {
  agentName: string;
  deliveryNumber: string;
  range: any;
};

type bpeNumberData = {
  agentName: string;
};

export default function RekapanScreen({
  user,
  dataBpeDeliveryAgent,
  defaultData,
}: {
  user: User;
  dataBpeDeliveryAgent: bpeNumberData[];
  defaultData: any[];
}) {
  const uniqueAgents = [
    ...new Set(defaultData.map((allocation: any) => allocation.agentName)),
  ];

  const totalQty = useMemo(
    () =>
      defaultData.reduce(
        (sum: any, allocation: any) => sum + Number(allocation.allocatedQty),
        0
      ),
    [defaultData]
  );

  const totalBeratQty = useMemo(() => totalQty * 3, [totalQty]);

  const formattedTotalQty = totalQty.toLocaleString("id-ID");
  const formattedTotalBeratQty = totalBeratQty.toLocaleString("id-ID");

  const [loading, setLoading] = useState(false);
  const [userCompanyId, setUserCompanyId] = useState(user.companiesId);
  const [isFiltered, setIsFiltered] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [tableData, setTableData] = useState(defaultData);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 15,
    total: 0,
    totalPages: defaultData.length > 15 ? 2 : 1,
  });
  const [data, setData] = useState({
    totalTabung: formattedTotalQty,
    totalBeratTabung: formattedTotalBeratQty,
    totalAgen: uniqueAgents.length,
    totalAlokasiHarian: defaultData.length,
  });

  const form = useForm<valuesFilter>({
    defaultValues: {
      agentName: "",
      deliveryNumber: "",
      range: {
        from: new Date(),
        to: null,
      },
    },
  });

  async function fetchData(values: valuesFilter, pageNumber: number) {
    setIsFiltered(true);
    setPaginationLoading(true);
    try {
      const { from, to } = values.range || {};
      const response = await fetch("/api/penyaluran-elpiji", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: userCompanyId,
          ...values,
          range: {
            from: from ? format(new Date(from), "yyyy-MM-dd") : null,
            to: to ? format(new Date(to), "yyyy-MM-dd") : null,
          },
          page: pageNumber,
          pageSize: pagination.pageSize,
        }),
      });
      const result = await response.json();
      setData({
        totalTabung: result.cardInfo.totalQty.toLocaleString("id-ID"),
        totalBeratTabung: result.cardInfo.totalBeratQty.toLocaleString("id-ID"),
        totalAgen: result.cardInfo.totalAgenCount,
        totalAlokasiHarian: result.cardInfo.totalDistribusi,
      });
      setTableData(result.data);
      setPagination((prev) => ({
        ...prev,
        page: pageNumber,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setPaginationLoading(false);
    }
  }

  // Fungsi untuk submit dengan loading
  async function onSubmit(values: valuesFilter) {
    setLoading(true);
    await fetchData(values, 1);
    setLoading(false);
  }

  function handlePageChange(newPage: number) {
    fetchData(form.getValues(), newPage);
  }

  // Reset form and fetch all data
  function handleReset() {
    form.reset({
      agentName: "",
      deliveryNumber: "",
      range: {
        from: null,
        to: null,
      },
    });

    fetchData(
      {
        agentName: "",
        deliveryNumber: "",
        range: {
          from: null,
          to: null,
        },
      },
      1
    );
    setIsFiltered(false);
  }

  return (
    <div className="mx-5">
      <div className="mb-4">
        <div className="pt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
          <InfoCard
            icon={<CalendarCheck className="h-10 w-10 text-white" />}
            title="TOTAL TABUNG"
            value={data.totalTabung}
          />
          <InfoCard
            icon={<Weight className="h-10 w-10 text-white" />}
            title="TOTAL BERAT TABUNG"
            value={data.totalBeratTabung}
            unit="Kg"
          />
          <InfoCard
            icon={<Handshake className="h-10 w-10 text-white" />}
            title="TOTAL AGEN"
            value={data.totalAgen}
          />
          <InfoCard
            icon={<Database className="h-10 w-10 text-white" />}
            title="TOTAL DISTRIBUSI LPG"
            value={data.totalAlokasiHarian}
          />
        </div>
        <Card className="px-6 py-6 my-3 shadow-lg rounded-2xl bg-white border border-gray-200">
          <div className="px-4 text-center">
            <h1 className="text-lg font-semibold py-2 pb-4">Filter Rekap</h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
                <FormField
                  control={form.control}
                  name="agentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Nama Agen</FormLabel>
                      <FormControl>
                        <ComboBoxNelsen
                          placeholder="Pilih Nama Agen"
                          data={dataBpeDeliveryAgent}
                          selectedValue={field.value}
                          onSelect={field.onChange}
                          valueKey="agentName"
                          displayKey="agentName"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-lg">Tanggal</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal my-2",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {field.value?.from ? (
                              field.value?.to ? (
                                <>
                                  {format(field.value.from, "PPP", {
                                    locale: id,
                                  })}{" "}
                                  -{" "}
                                  {format(field.value.to, "PPP", {
                                    locale: id,
                                  })}
                                </>
                              ) : (
                                format(field.value.from, "PPP", {
                                  locale: id,
                                })
                              )
                            ) : (
                              <span>Pilih Tanggal</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            selected={field.value}
                            onSelect={(newDate) => {
                              if (newDate == null) {
                                field.onChange(null);
                              } else {
                                field.onChange(newDate);
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("2000-01-01")
                            }
                            numberOfMonths={2}
                            locale={id}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-3 space-y-2 sm:space-y-0 sm:space-x-2">
                {user.role === "ADMIN" && (
                  <div className="w-full sm:w-auto">
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
                  </div>
                )}
                <div className="flex w-full sm:w-auto md:justify-end sm:justify-end">
                  <Button
                    type="submit"
                    className="flex w-full sm:w-auto items-center mr-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Cari
                  </Button>
                  {/* {isFiltered && ( */}
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex items-center justify-center"
                    onClick={() => {
                      handleReset();
                      setIsFiltered(false);
                    }}
                  >
                    <X className="h-4 w-4 cursor-pointer" />
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </Card>
        <div>
          <DataTableBackEnd
            columns={
              user.role === "ADMIN"
                ? adminLpgDistributionColumns
                : lpgDistributionColumns
            }
            data={tableData}
            onPageChange={handlePageChange}
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
          />
        </div>
      </div>
    </div>
  );
}
