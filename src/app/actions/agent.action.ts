"use server";
import prisma from "@/lib/db";
import { Agents } from "@/lib/types";
import { getErrorMessage } from "./error.action";
import { revalidatePath } from "next/cache";
import { getCompaniesAll } from "./companies.action";
import { redirect } from "next/navigation";
import { getCurrentSession } from "./auth.actions";
import { cache } from "react";

export const getAgentsAll = cache(async () => {
  const companiesData = await getCompaniesAll();
  if (!companiesData) {
    redirect("/master-data/companies/form");
  }
  return prisma.agents.findMany({
    distinct: ["agentName"],
  });
});

export const postAgentData = async (formData: FormData) => {
  const agentName = formData.get("agentName")?.toString();
  const shipTo = formData.get("shipTo")?.toString() || null;
  const companyId = Number(formData.get("companyId"));
  const address = formData.get("address")?.toString();
  const city = formData.get("city")?.toString();
  const phone = formData.get("phone")?.toString();
  const fax = formData.get("fax")?.toString() || null;
  const companyName = formData.get("companyName")?.toString();
  if (!agentName || !address || !city || !phone || !companyName) {
    return {
      error: "Semua field harus di isi",
    };
  }
  const { user } = await getCurrentSession();
  if (!user) {
    return {
      error: "User tidak ditemukan. Silakan login kembali.",
    };
  }
  try {
    const postData: Agents = await prisma.agents.create({
      data: {
        agentName: agentName,
        shipTo: shipTo || null,
        companyId: companyId,
        address: address,
        city: city,
        phone: phone,
        fax: fax || null,
        companyName: companyName,
        updatedBy: user.id,
        createdBy: user.id,
      },
    });
    revalidatePath("/data-master/agents");
    return { success: true, data: postData };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Database Error: ", errorMessage);
    return {
      error: "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
    };
  }
};
export const updateAgentData = async (formData: FormData) => {
  const agentNameLabel = formData.get("agentName")?.toString();
  const shipTo = formData.get("shipTo")?.toString()
    ? formData.get("shipTo")?.toString()
    : null;
  const address = formData.get("address")?.toString();
  const city = formData.get("city")?.toString();
  const phone = formData.get("phone")?.toString();
  const fax = formData.get("fax")?.toString()
    ? formData.get("shipTo")?.toString()
    : null;
  const agentId = Number(formData.get("agentId"));

  if (!agentId) {
    return {
      error: "Id is missing",
    };
  }

  try {
    // Update data di tabel 'agents'
    const updatedData = await prisma.agents.update({
      where: {
        id: agentId,
      },
      data: {
        agentName: agentNameLabel,
        shipTo,
        address,
        city,
        fax,
        phone,
      },
    });

    if (updatedData) {
      await prisma.allocations.updateMany({
        where: {
          agentId: agentId,
        },
        data: {
          agentName: agentNameLabel,
        },
      });
    }

    if (updatedData) {
      // Dapatkan semua allocationId yang terkait dengan agentId
      const allocations = await prisma.allocations.findMany({
        where: { agentId: agentId },
        select: { id: true },
      });

      const allocationIds = allocations.map((allocation) => allocation.id);

      // Update agentName di LpgDistributions berdasarkan allocationId
      await prisma.lpgDistributions.updateMany({
        where: { allocationId: { in: allocationIds } },
        data: { agentName: agentNameLabel },
      });
    }
    revalidatePath("/data-master/agents");
    return { success: true, data: updatedData };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
