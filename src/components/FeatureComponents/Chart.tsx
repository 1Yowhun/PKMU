import * as React from "react";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, Line, Bar } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { generateColor } from "@/utils/page";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { id } from "date-fns/locale";

interface DataItem {
  qty: number;
  giDate: Date;
}

interface ChartProps<TData> {
  data: Array<{ date: string; qty: number }>;
  data2: Array<{ date: string; qty: number }>; 
  data3: Array<{ date: string; qty: number }>; 
  title?: string;
  timeFrame: "weekly" | "monthly"; 
}

export function ChartComponent<TData extends DataItem>({
  data,
  data2,
  data3,
  title,
  timeFrame,
}: ChartProps<TData>) {
  const startDate = startOfWeek(new Date());
  const endDate = endOfWeek(new Date());


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
      label: "Penyaluran LPG",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const combinedData = React.useMemo(() => {
    const map = new Map<string, { date: string; dailyQty?: number; monthlyQty?: number; distributionQty?: number }>();

    data.forEach(({ date, qty }) => {
      if (!map.has(date)) {
        map.set(date, { date, dailyQty: qty });
      } else {
        map.get(date)!.dailyQty = qty;
      }
    });

    data2.forEach(({ date, qty }) => {
      if (!map.has(date)) {
        map.set(date, { date, monthlyQty: qty });
      } else {
        map.get(date)!.monthlyQty = qty;
      }
    });

    data3.forEach(({ date, qty }) => {
      if (!map.has(date)) {
        map.set(date, { date, distributionQty: qty });
      } else {
        map.get(date)!.distributionQty = qty;
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const dateA = new Date(a.date.split("-").reverse().join("-")); 
      const dateB = new Date(b.date.split("-").reverse().join("-"));
      return dateA.getTime() - dateB.getTime();
    });
  }, [data, data2, data3]);

  const isAllDataEmpty = !data.length && !data2.length && !data3.length;

  if (isAllDataEmpty) {
    return <div className="text-center text-gray-500 py-4">Tidak ada Data</div>;
  }

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    if (timeFrame === "monthly") {
      return format(date, "MMM yyyy", { locale: id }); // Format in Indonesian
    }
    return format(date, "dd-MM-yyyy", { locale: id }); // Format in Indonesian
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-4 py-4">
      <div className="flex-grow my-5">
        <ChartContainer config={chartConfig} className="mx-auto w-full max-w-[600px] md:max-w-full aspect-square" style={{ height: '400px', maxHeight: '400px' }}>
          <AreaChart data={combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              // tickFormatter={timeFrame === 'monthly' ? format(new Date(), "MMMM", { locale: id }) : format(new Date(), "dd-MM-yyyy", { locale: id })} 
            />
            <YAxis />
            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              type="monotone"
              dataKey="dailyQty"
              stroke={generateColor(0)}
              fill="url(#colorQty)"
              dot={{ r: 4 }} 
            />
            <Area
              type="monotone"
              dataKey="monthlyQty"
              stroke={generateColor(10)}
              strokeWidth={2}
              fill="url(#colorQty)"
              dot={{ r: 4 }} 
              activeDot={{
                r: 6,
              }}
            />
            <Area
              type="monotone"
              dataKey="distributionQty"
              stroke={generateColor(20)}
              strokeWidth={2}
              fill="url(#colorQty)"
              dot={{ r: 4 }} 
              activeDot={{
                r: 6,
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
