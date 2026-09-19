"use server";
import prisma from "@/lib/db";
import { Companies } from "@/lib/types";
import { getErrorMessage } from "./error.action";
import { revalidatePath } from "next/cache";
import { getCurrentSession } from "./auth.actions";
import { cache } from "react";

export const getCompaniesAll = cache(async () => {
  return await prisma.companies.findMany();
});

export const getCompaniesNameData = async () => {
  return await prisma.companies.findMany({
    select: {
      id: true,
      companyName: true,
    },
  });
};

export const postCompaniesData = async (formData: FormData) => {
  const companyName = formData.get("companyName")?.toString();
  const address = formData.get("address")?.toString();
  const telephone = formData.get("telephone")?.toString();

  const { user } = await getCurrentSession();
  if (!user) {
    return {
      error: "User tidak ada atau user belum login",
    };
  }

  if (!companyName || !address || !telephone) {
    return {
      error: "Semua field harus diisi",
    };
  }

  try {
    const data: Companies = await prisma.companies.create({
      data: {
        companyName: companyName,
        address: address,
        telephone: telephone,
        createdBy: user.id,
        updatedBy: user.id,
      },
    });
    revalidatePath("/data-master/companies");
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const updateCompaniesData = async (formData: FormData) => {
  const { user } = await getCurrentSession();
  if (!user || user.role !== "ADMIN") {
    return {
      error: "Hanya admin yang dapat mengubah data perusahaan",
    };
  }

  const id = Number(formData.get("id"));
  const companyName = formData.get("companyName")?.toString();
  const address = formData.get("address")?.toString();
  const telephone = formData.get("telephone")?.toString();

  if (!id) {
    return {
      error: "ID perusahaan tidak valid",
    };
  }

  try {
    const updatedData = await prisma.companies.update({
      where: {
        id: id,
      },
      data: {
        companyName: companyName,
        address: address,
        telephone: telephone,
      },
    });
    revalidatePath("/data-master/companies");
    return { success: true, data: updatedData };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteCompanyData = async (id: number) => {
  const { user } = await getCurrentSession();
  if (!user || user.role !== "ADMIN") {
    return {
      error: "Hanya admin yang dapat menghapus data perusahaan",
    };
  }

  try {
    await prisma.companies.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/data-master/companies");
    return { success: true };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const deleteLpgData = deleteCompanyData;

export const getCompaniesMetaData = cache(async (id?: string) => {
  const metadata = await prisma.companies.findMany({
    ...(id && {
      where: {
        createdBy: id,
      },
    }),
  });
  return metadata;
});

const companyImageCache = new Map<number, { data: any; expires: number }>();

export const getCompaniesImage = async (id: number) => {
  const now = Date.now();
  const cached = companyImageCache.get(id);

  if (cached && cached.expires > now) {
    return cached.data;
  }

  const data = await prisma.companies.findMany({
    select: {
      imageUrl: true,
    },
    where: {
      id: id,
    },
  });

  companyImageCache.set(id, {
    data,
    expires: now + 60 * 60 * 1000, 
  });

  return data;
};
