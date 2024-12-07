"use server";

import prisma from "@/lib/db";
import { Allocation } from "@/lib/types";
import type { MonthlyAllocations } from "@prisma/client";

export async function getAllokasiAll() {
  const data = await prisma.allocations.findMany({
    where: {
      AND: {
        status: {
          in: ["Pending", "Approved"],
        },
      },
    },
  });
  return data as Allocation[];
}

export async function getMonthlyAllocation() {
  const data = await prisma.monthlyAllocations.findMany();
  return data as MonthlyAllocations[];
}

export const getSummary = async () => {
  const data = await prisma.allocations.findMany({
    select: {
      allocatedQty: true,
      plannedGiDate: true,
      lpgDistribution: {
        select: {
          distributionQty: true,
          giDate: true,
        },
      },
    },
  });
  const monthlyAllocations = await prisma.monthlyAllocations.findMany({
    select: {
      date: true,
      totalElpiji: true,
    },
  });
  return { data, monthlyAllocations };
};
