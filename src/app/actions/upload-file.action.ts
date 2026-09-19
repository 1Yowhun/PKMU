"use server";

import prisma from "@/lib/db";
import { MonthlyAllocation } from "@/lib/types";
import { Allocation } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth.actions";

export const uploadBulkExcel = async (
  datas: Omit<Allocation, "createdAt" | "updatedAt">[],
  companyId: number
) => {
  const missingAgents: string[] = [];

  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return {
        error: "User tidak ditemukan atau belum login",
      };
    }

    const effectiveCompanyId = user.companiesId || companyId;

    // Step 1: Validate if all agents exist before proceeding with upload
    const agentNames = datas.map((excel) => excel.agentName);
    const [checkAgentInDb, checkAgentWithCompaniesId] =
      await prisma.$transaction([
        prisma.agents.findMany({
          where: {
            agentName: {
              in: agentNames,
            },
          },
          select: {
            id: true,
            agentName: true,
          },
        }),
        prisma.agents.findMany({
          where: {
            companyId: effectiveCompanyId,
          },
          select: {
            agentName: true,
            companyId: true,
          },
        }),
      ]);

    if (checkAgentInDb.length === 0) {
      return {
        error: "Data agents tidak ada di penyimpanan",
      };
    }

    const validAgentNames = checkAgentInDb.map((agent) => agent.agentName);
    const validCompanyAgents = checkAgentWithCompaniesId.map(
      (agent) => agent.agentName
    );

    missingAgents.push(
      ...agentNames.filter((agentName) => !validAgentNames.includes(agentName))
    );

    if (missingAgents.length > 0) {
      return {
        missingAgents,
      };
    }

    const invalidCompanyAgents = datas.filter(
      (excel) => !validCompanyAgents.includes(excel.agentName)
    );

    if (invalidCompanyAgents.length > 0) {
      return {
        error: "Terdapat agent yang belum terdaftar di perusahaan",
        invalidAgents: invalidCompanyAgents.map((d) => d.agentName),
      };
    }

    const invalidData = datas.filter(
      (excel) =>
        !excel.shipTo ||
        !excel.materialName ||
        !excel.agentName ||
        !excel.plannedGiDate ||
        !excel.deliveryNumber ||
        !excel.allocatedQty
    );

    if (invalidData.length > 0) {
      return {
        error: "Terdapat data yang kosong",
      };
    }

    // Step 2: Process data with chunking (50 rows per batch) to prevent DB connection pool exhaustion
    const CHUNK_SIZE = 50;
    for (let i = 0; i < datas.length; i += CHUNK_SIZE) {
      const chunk = datas.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map(async (excel) => {
          const agentId = checkAgentInDb.find(
            (agent) => agent.agentName === excel.agentName
          )?.id;

          const existingRecord = await prisma.allocations.findFirst({
            where: {
              deliveryNumber: excel.deliveryNumber,
              creator: {
                companiesId: effectiveCompanyId,
              },
            },
          });

          const allocationData = {
            shipTo: excel.shipTo,
            materialName: excel.materialName,
            agentId: agentId,
            agentName: excel.agentName,
            plannedGiDate: excel.plannedGiDate,
            allocatedQty: excel.allocatedQty,
            updatedBy: user.id,
          };

          if (existingRecord) {
            await prisma.allocations.update({
              where: { id: existingRecord.id },
              data: allocationData,
            });
          } else {
            await prisma.allocations.create({
              data: {
                ...allocationData,
                giDate: excel.giDate ? new Date(excel.giDate) : null,
                deliveryNumber: excel.deliveryNumber,
                createdBy: user.id,
              },
            });
          }
        })
      );
    }

    revalidatePath("/dashboard/alokasi-harian");
    return { success: true };
  } catch (error) {
    console.error("Error uploadBulkExcel:", error);
    return {
      error: "Terjadi kesalahan saat memproses data alokasi",
    };
  }
};

export const uploadBulkExcelMonthly = async (datas: MonthlyAllocation[]) => {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return { error: "User belum login" };
    }

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
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

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

    const CHUNK_SIZE = 50;
    for (let i = 0; i < datas.length; i += CHUNK_SIZE) {
      const chunk = datas.slice(i, i + CHUNK_SIZE);
      await Promise.all(
        chunk.map(async (excel) => {
          const existingAllocation = await prisma.monthlyAllocations.findFirst({
            where: {
              date: excel.date,
              creator: {
                companiesId: user.companiesId,
              },
            },
          });

          if (existingAllocation) {
            await prisma.monthlyAllocations.update({
              where: { id: existingAllocation.id },
              data: {
                totalElpiji: excel.totalElpiji,
                volume: excel.volume,
                updatedBy: user.id,
              },
            });
          } else {
            await prisma.monthlyAllocations.create({
              data: {
                date: excel.date,
                totalElpiji: excel.totalElpiji,
                volume: excel.volume,
                updatedBy: user.id,
                createdBy: user.id,
              },
            });
          }
        })
      );
    }

    revalidatePath("/dashboard/alokasi-bulanan");
    return { success: true };
  } catch (error) {
    console.error("Error uploadBulkExcelMonthly:", error);
    return { error: "Terjadi masalah saat upload excel bulanan" };
  }
};
