"use server";

import prisma from "@/lib/db";
import { cache } from "react";

export const getAllocationDefault = async (company_id: number) => {
  const now = new Date();
  const jakartaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  jakartaTime.setHours(0, 0, 0, 0);

  return await prisma.allocations.findMany({
    where: {
      AND: [
        {
          plannedGiDate: {
            gte: jakartaTime,
          },
        },
        {
          status: {
            equals: "Pending",
          },
        },
        {
          creator: {
            companiesId: company_id,
          },
        },
      ],
    },
    orderBy: { bpeNumber: "desc" },
    select: {
      id: true,
      status: true,
      deliveryNumber: true,
      shipTo: true,
      agentName: true,
      materialName: true,
      allocatedQty: true,
      plannedGiDate: true,
      giDate: true,
      bpeNumber: true,
      updatedAt: true,
    },
  });
};

export const getFilterDataAllocation = cache(async (company_id: number) => {
  return await prisma.agents.findMany({
    select: {
      agentName: true,
    },
    where: {
      creator: {
        companiesId: company_id,
      },
    },
    orderBy: { agentName: "asc" },
  });
});
