"use server";

import prisma from "@/lib/db";
import { LpgDistributions } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "./error.action";
import { getCurrentSession } from "./auth.actions";
import { cache } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const searchDeliveryNumber = async (query: string, user: number) => {
  try {
    if (!query) return [];
    const getAllocationData = await prisma.allocations.findMany({
      where: {
        AND: [
          {
            status: {
              in: ["Pending", "Approved"],
            },
          },
          {
            deliveryNumber: {
              equals: query,
            },
          },
          {
            creator: {
              companiesId: user,
            },
          },
        ],
      },
      select: {
        id: true,
        shipTo: true,
        deliveryNumber: true,
        agentName: true,
        allocatedQty: true,
      },
    });
    return getAllocationData.length > 0 ? getAllocationData : [];
  } catch (error) {
    console.error("Error saat mencari delivery number:", error);
    throw error;
  }
};

export const postLpgData = async (formData: FormData) => {
  const allocationid = Number(formData.get("allocationid"));
  const nomorTransaksi = formData.get("nomorTransaksi")?.toString() || "";
  const nomorDo = formData.get("nomorDo")?.toString() || "";
  const namaAgen = formData.get("namaAgen")?.toString() || "";
  const waktuPengambilan = formData.get("waktuPengambilan")
    ? new Date(formData.get("waktuPengambilan")!.toString())
    : new Date();
  const platKendaraan = formData.get("platKendaraan")?.toString() || "";
  const namaSopir = formData.get("namaSopir")?.toString() || "";
  const status = formData.get("status")?.toString() || "Pending";
  const jumlahTabung = Number(formData.get("jumlahTabung")) || 0;
  const volumeTabung = Number(formData.get("volumeTabung")) || 0;
  const jumlahTabungBocor = formData.get("jumlahTabungBocor")
    ? Number(formData.get("jumlahTabungBocor"))
    : null;

  const isiKurang = formData.get("isiKurang")
    ? Number(formData.get("isiKurang"))
    : null;
  const shipTo = formData.get("shipTo")?.toString() || "";
  const superVisor = formData.get("superVisor")?.toString() || "";
  const administrasi = formData.get("administrasi")?.toString() || "";
  const gateKeeper = formData.get("gateKeeper")?.toString() || "";

  waktuPengambilan.setUTCHours(0, 0, 0, 0);
  if (
    !nomorTransaksi ||
    !nomorDo ||
    !namaAgen ||
    !waktuPengambilan ||
    !platKendaraan ||
    !namaSopir ||
    !status
  )
    return {
      error: "Semua field harus diisi",
    };
  const { user } = await getCurrentSession();
  if (!user)
    return {
      error: "User tidak ada atau user belum login",
    };

  const checkLpgData = await prisma.lpgDistributions.findMany({
    where: {
      giDate: waktuPengambilan,
      bpeNumber: nomorTransaksi,
      creator: {
        companiesId: user.companiesId,
      },
    },
  });

  if (checkLpgData.length > 0) {
    return {
      error: "Data penyaluran lpg ini sudah diisi",
    };
  }

  try {
    const dataLpg: LpgDistributions = await prisma.lpgDistributions.create({
      data: {
        allocationId: allocationid,
        deliveryNumber: nomorDo,
        bpeNumber: nomorTransaksi,
        agentName: namaAgen,
        giDate: waktuPengambilan,
        licensePlate: platKendaraan,
        driverName: namaSopir,
        status: status,
        allocatedQty: jumlahTabung,
        volume: volumeTabung,
        distributionQty: jumlahTabung,
        shipTo: shipTo,
        isiKurang: isiKurang || null,
        bocor: jumlahTabungBocor || null,
        superVisor: superVisor || null,
        administrasi: administrasi || null,
        gateKeeper: gateKeeper || null,
        createdBy: user.id,
        updatedBy: user.id,
      },
    });

    await prisma.allocations.update({
      where: { id: allocationid },
      data: {
        status: status,
        giDate: waktuPengambilan,
        bpeNumber: nomorTransaksi,
        updatedBy: user.id,
      },
    });
    revalidatePath("/dashboard/alokasi-harian");
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const getAllLpg = async (): Promise<LpgDistributions[]> => {
  try {
    const data = await prisma.lpgDistributions.findMany({
      where: {
        status: {
          in: ["Pending", "Approved"],
        },
      },
    });
    return data as LpgDistributions[];
  } catch (error) {
    throw error;
  }
};

export const UpdateLpgData = async (formData: FormData) => {
  const id = formData.get("id") as string; // ambil ID
  const platKendaraan = formData.get("platKendaraan") as string;
  const namaSopir = formData.get("namaSopir") as string;
  const giDate = new Date(formData.get("giDate") as string);
  const jumlahTabungBocor = parseInt(
    formData.get("jumlahTabungBocor") as string
  );
  const isiKurang = parseInt(formData.get("isiKurang") as string);
  const superVisor = formData.get("superVisor")?.toString() || "";
  const administrasi = formData.get("administrasi")?.toString() || "";
  const gateKeeper = formData.get("gateKeeper")?.toString() || "";
  if (!id) {
    return {
      error: "ID is missing.",
    };
  }

  try {
    // Update data ke database menggunakan Prisma
    const updatedData = await prisma.lpgDistributions.update({
      where: {
        id: parseInt(id),
      },
      data: {
        giDate: giDate,
        licensePlate: platKendaraan,
        driverName: namaSopir,
        bocor: jumlahTabungBocor,
        superVisor: superVisor,
        administrasi: administrasi,
        gateKeeper: gateKeeper,
        isiKurang: isiKurang,
      },
    });
    revalidatePath("/dashboard/penyaluran-elpiji");
    return { success: true, data: updatedData };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteLpgData = async (id: number) => {
  try {
    await prisma.lpgDistributions.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/dashboard/penyaluran-elpiji");
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const getNextNumber = async (company_id: number) => {
  try {
    const date = new Date();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(2);
    const prefix = `BPE-${mm}${yy}-`;

    const result = await prisma.lpgDistributions.findMany({
      where: {
        status: { in: ["Pending", "Approved"] },
        bpeNumber: { startsWith: prefix },
        creator: {
          companiesId: company_id,
        },
      },
      select: { bpeNumber: true },
      orderBy: { bpeNumber: "desc" },
      take: 1,
    });

    if (result.length === 0) {
      return `${prefix}0001`;
    }

    const lastBpeNumber = result[0].bpeNumber;
    const numericPart = parseInt(lastBpeNumber.slice(-4), 10);
    const nextNumericPart = numericPart + 1;
    const nextBpeNumber = `${prefix}${nextNumericPart
      .toString()
      .padStart(4, "0")}`;

    return nextBpeNumber;
  } catch (error) {
    console.error("Error getting next number:", error);
    throw error;
  }
};

export const getFilterData = cache(async (company_id: number) => {
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

export const getLpgDataDefault = async (company_id: number) => {
  const now = new Date();
  const gmt7Date = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  return await prisma.lpgDistributions.findMany({
    where: {
      AND: [
        {
          giDate: {
            gte: gmt7Date,
          },
        },
        {
          creator: {
            companiesId: company_id,
          },
        },
      ],
    },
    select: {
      id: true,
      bpeNumber: true,
      giDate: true,
      agentName: true,
      licensePlate: true,
      deliveryNumber: true,
      allocatedQty: true,
      distributionQty: true,
      volume: true,
      administrasi: true,
      superVisor: true,
      gateKeeper: true,
      driverName: true,
      bocor: true,
      isiKurang: true,
      updatedAt: true,
      createdBy: true,
    },
  });
};
