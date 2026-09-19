import prisma from "@/lib/db";
import { endOfMonth, startOfMonth } from "date-fns";

export const getDefaultMonthlyData = async (company_id: number) => {
  const start = startOfMonth(new Date()); // Awal bulan (misal: 2025-03-01)
  const end = endOfMonth(new Date());
  const data = await prisma.monthlyAllocations.findMany({
    where: {
      AND: [
        {
          date: {
            gte: start,
            lte: end,
          },
        },
        {
          creator:{
            companiesId: company_id
          }
        },
      ],
    },
    select: {
      date: true,
      totalElpiji: true,
      volume: true,
      updatedAt: true,
    },
    orderBy: {
      date: "asc",
    },
    take: 31,
  });
  return data;
};
