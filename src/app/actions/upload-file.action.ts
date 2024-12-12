"use server";

import prisma from "@/lib/db";
import { MonthlyAllocation } from "@/lib/types";
import { Allocation } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const uploadBulkExcel = async (
  datas: Omit<Allocation, "createdAt" | "updatedAt">[]
) => {
  const missingAgents: string[] = []; // Array to store missing agent names

  try {
    // Step 1: Validate if all agents exist before proceeding with upload
    const agentNames = datas.map((excel) => excel.agentName); // Extract all agent names from data
    const findAgentName = await prisma.agents.findMany({
      where: {
        agentName: {
          in: agentNames, // Match against all agent names
        },
      },
      select: {
        id: true,
        agentName: true,
      },
    });

    const validAgentNames = findAgentName.map((agent) => agent.agentName); // Extract valid agent names
    missingAgents.push(
      ...agentNames.filter((agentName) => !validAgentNames.includes(agentName))
    ); // Add missing agents to the list

    // If there are missing agents, abort the upload
    if (missingAgents.length > 0) {
      return {
        missingAgents, // Return the missing agents so frontend can handle
      };
    }

    const invalidData = datas.filter(
      (excel) =>
        !excel.shipTo ||
        !excel.materialName ||
        !excel.agentName ||
        !excel.plannedGiDate ||
        !excel.deliveryNumber ||
        !excel.allocatedQty ||
        !excel.updatedBy
    );

    if (invalidData.length > 0) {
      return {
        error: "Terdapat data yang kosong",
      };
    }

    // Step 2: Process the data if all agents are valid
    await Promise.all(
      datas.map(async (excel) => {
        // Retrieve agent ID
        const agentId = findAgentName.find(
          (agent) => agent.agentName === excel.agentName
        )?.id;

        // Check if allocation with deliveryNumber exists
        const existingRecord = await prisma.allocations.findFirst({
          where: { deliveryNumber: excel.deliveryNumber },
        });

        const allocationData = {
          shipTo: excel.shipTo,
          materialName: excel.materialName,
          agentId: agentId,
          agentName: excel.agentName,
          plannedGiDate: excel.plannedGiDate,
          allocatedQty: excel.allocatedQty,
          updatedBy: excel.updatedBy,
        };

        if (existingRecord) {
          // Update existing allocation data
          await prisma.allocations.update({
            where: { id: existingRecord.id },
            data: allocationData,
          });
        } else {
          // Create new allocation data
          await prisma.allocations.create({
            data: {
              ...allocationData,
              giDate: excel.giDate ? new Date(excel.giDate) : null,
              deliveryNumber: excel.deliveryNumber,
              createdBy: excel.createdBy,
            },
          });
        }
      })
    );

    // Step 3: If no missing agents, proceed with success
    revalidatePath("/dashboard/alokasi-harian");
    return { success: true };
  } catch (error) {
    return {
      error: "terjadi kesalahan",
    };
  }
};

export const uploadBulkExcelMonthly = async (datas: MonthlyAllocation[]) => {
  try {
    // Guard clause untuk memastikan tidak ada data yang kosong
    const isValid = datas.every(
      (excel) => excel.date && excel.totalElpiji && excel.volume
    );
    if (!isValid) {
      return {
        error: "Terdapat data yang kosong. Pastikan semua data memiliki nilai.",
      };
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear(); // 2024

    // Ambil bulan dan tahun dari data yang masuk
    const isIncorrectMonthOrYear = datas.some((excel) => {
      const dataMonth = new Date(excel.date).getMonth();
      const dataYear = new Date(excel.date).getFullYear();
      return dataMonth !== currentMonth || dataYear !== currentYear;
    });

    if (isIncorrectMonthOrYear) {
      return {
        error: `Data harus sesuai dengan bulan dan tahun saat ini. Pastikan semua data memiliki bulan dan tahun yang sesuai dengan ${
          currentMonth + 1
        }-${currentYear}.`,
      };
    }

    await Promise.all(
      datas.map(async (excel) => {
        // Periksa apakah data untuk bulan ini sudah ada
        const existingAllocation = await prisma.monthlyAllocations.findFirst({
          where: {
            date: excel.date,
          },
        });

        if (existingAllocation) {
          // Jika data sudah ada, lakukan update
          await prisma.monthlyAllocations.update({
            where: { id: existingAllocation.id }, // Menggunakan ID unik
            data: {
              totalElpiji: excel.totalElpiji,
              volume: excel.volume,
              updatedBy: excel.updatedBy,
            },
          });
        } else {
          // Jika data belum ada, lakukan create
          await prisma.monthlyAllocations.create({
            data: {
              date: excel.date,
              totalElpiji: excel.totalElpiji,
              volume: excel.volume,
              updatedBy: excel.updatedBy,
              createdBy: excel.createdBy,
            },
          });
        }
      })
    );

    revalidatePath("/dashboard/alokasi-harian-bulanan");
  } catch (error) {
    return { error: "Terjadi masalah saat upload excel" };
  }
};
