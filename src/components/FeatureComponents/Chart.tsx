import * as React from "react";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, Line } from "recharts";
import {
  ChartConfig,
  ChartContainer,
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
  config: ChartConfig;
  data: Array<{ date: string; qty: number }>;
  data2: Array<{ date: string; qty: number }>; 
  data3: Array<{ date: string; qty: number }>; 
  title?: string;
  timeFrame: "weekdays" | "monthly"; 
}

export function ChartComponent<TData extends DataItem>({
  data,
  data2,
  data3,
  config,
  title,
  timeFrame,
}: ChartProps<TData>) {
  // console.log(data);
  // console.log(data2);
  // console.log(data3);
  const startDate = startOfWeek(new Date());
  const endDate = endOfWeek(new Date());

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

    return Array.from(map.values());
  }, [data, data2, data3]);

  const isAllDataEmpty = !data.length && !data2.length && !data3.length;

  if (isAllDataEmpty) {
    return <div className="text-center text-gray-500 py-4">No data available</div>;
  }

  // const combinedData = React.useMemo(() => {
  //   const map = new Map<string, { date: string; dailyQty?: number; monthlyQty?: number; distributionQty? :number}>();
  
  //   // Process data as dailyQty
  //   data.forEach(({ date, qty }) => {
  //     if (!map.has(date)) {
  //       map.set(date, { date, dailyQty: qty });
  //     } else {
  //       map.get(date)!.dailyQty = qty;
  //     }
  //   });
  
  //   // Process data2 as monthlyQty
  //   data2.forEach(({ date, qty }) => {
  //     if (!map.has(date)) {
  //       map.set(date, { date, monthlyQty: qty });
  //     } else {
  //       map.get(date)!.monthlyQty = qty;
  //     }
  //   });

  //   data3.forEach(({ date, qty }) => {
  //     if (!map.has(date)) {
  //       map.set(date, { date, distributionQty: qty });
  //     } else {
  //       map.get(date)!.distributionQty = qty;
  //     }
  //   });
  
  
  //   const result = Array.from(map.values());
  //   return result;
  // }, [data, data2]);

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
        <ChartContainer config={config} className="mx-auto w-full max-w-[600px] md:max-w-full aspect-square" style={{ height: '400px', maxHeight: '400px' }}>
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
            {/* <LabelList dataKey="dailyQty" position="top" /> */}
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
