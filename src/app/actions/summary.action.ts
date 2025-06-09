"use server";

import prisma from "@/lib/db";
import { startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns";

export const getSummaryToday = async (company_id: number) => {
  const today = new Date();
  const jakartaTime = new Date(
    today.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  jakartaTime.setHours(0, 0, 0, 0);

  const tomorrow = new Date(jakartaTime);
  tomorrow.setDate(jakartaTime.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const [dailySummary, dailySummaryPlanned, distributionSummary, monthlyData] =
    await prisma.$transaction([
      prisma.allocations.aggregate({
        _sum: { allocatedQty: true },
        _count: { _all: true },
        where: {
          AND: [
            {
              giDate: { gte: today, lt: tomorrow },
            },
            {
              creator: {
                companiesId: company_id,
              },
            },
          ],
        },
      }),
      prisma.allocations.aggregate({
        _sum: { allocatedQty: true },
        _count: { _all: true },
        where: {
          AND: [
            {
              plannedGiDate: { gte: today, lt: tomorrow },
            },
            {
              creator: {
                companiesId: company_id,
              },
            },
          ],
        },
      }),
      prisma.lpgDistributions.aggregate({
        _sum: { distributionQty: true },
        _count: { _all: true },
        where: {
          AND: [
            {
              giDate: { gte: today, lt: tomorrow },
            },
            {
              creator: {
                companiesId: company_id,
              },
            },
          ],
        },
      }),
      prisma.monthlyAllocations.findMany({
        where: {
          AND: [
            {
              date: { gte: today, lt: tomorrow },
            },
            {
              creator: {
                companiesId: company_id,
              },
            },
          ],
        },
        select: { totalElpiji: true, volume: true },
      }),
    ]);

  const safeMonthlyData =
    monthlyData.length > 0 ? monthlyData[0] : { totalElpiji: 0, volume: 0 };

  const dailyAllo = Number(dailySummaryPlanned._sum?.allocatedQty ?? 0);
  const dailyDistri = Number(distributionSummary._sum?.distributionQty ?? 0);

  const pending =
    (dailyAllo ?? 0) > (dailyDistri ?? 0)
      ? (dailyAllo ?? 0) - (dailyDistri ?? 0)
      : 0;

  const fakultatif =
    (dailyAllo ?? 0) > safeMonthlyData.totalElpiji
      ? (dailyAllo ?? 0) - safeMonthlyData.totalElpiji
      : 0;
  const tidakTembus =
    safeMonthlyData.totalElpiji >= (dailyAllo ?? 0)
      ? (safeMonthlyData.totalElpiji ?? 0) - (dailyAllo ?? 0)
      : 0;

  return {
    dailySummary,
    dailySummaryPlanned,
    distributionSummary,
    safeMonthlyData,
    pending,
    fakultatif,
    tidakTembus,
  };
};

export const getWeeklySummaryDefault = async (company_id: number) => {
  const today = new Date();
  const startMonth = startOfMonth(today);
  const endMonth = endOfMonth(today);
  const day = today.getDate();

  let startDate, endDate;

  if (day >= 1 && day <= 7) {
    startDate = new Date(
      Date.UTC(startMonth.getFullYear(), startMonth.getMonth(), 1)
    );
    endDate = new Date(
      Date.UTC(
        startMonth.getFullYear(),
        startMonth.getMonth(),
        7,
        23,
        59,
        59,
        999
      )
    );
  } else if (day >= 8 && day <= 14) {
    startDate = new Date(
      Date.UTC(startMonth.getFullYear(), startMonth.getMonth(), 8)
    );
    endDate = new Date(
      Date.UTC(
        startMonth.getFullYear(),
        startMonth.getMonth(),
        14,
        23,
        59,
        59,
        999
      )
    );
  } else if (day >= 15 && day <= 21) {
    startDate = new Date(startMonth.getFullYear(), startMonth.getMonth(), 15);
    endDate = new Date(
      startMonth.getFullYear(),
      startMonth.getMonth(),
      21,
      23,
      59,
      59,
      999
    );
  } else {
    startDate = new Date(
      Date.UTC(startMonth.getFullYear(), startMonth.getMonth(), 22)
    );
    endDate = new Date(
      Date.UTC(endMonth.getFullYear(), endMonth.getMonth(), endMonth.getDate())
    );
  }
  const [dailySummary, distributionSummary, monthlyData] =
    await prisma.$transaction([
      prisma.allocations.groupBy({
        by: ["plannedGiDate"],
        _sum: { allocatedQty: true },
        where: {
          AND: [
            {
              plannedGiDate: { gte: startDate, lte: endDate },
            },
            {
              creator: {
                companiesId: company_id,
              },
            },
          ],
        },
        orderBy: { plannedGiDate: "asc" },
      }),
      prisma.lpgDistributions.groupBy({
        by: ["giDate"],
        _sum: { distributionQty: true },
        where: {
          AND: [
            {
              giDate: { gte: startDate, lte: endDate },
            },
            {
              creator: {
                companiesId: company_id,
              },
            },
          ],
        },
        orderBy: { giDate: "asc" },
      }),
      prisma.monthlyAllocations.findMany({
        where: {
          AND: [
            {
              date: { gte: startDate, lte: endDate },
            },
            {
              creator: {
                companiesId: company_id,
              },
            },
          ],
        },
        select: { totalElpiji: true, date: true },
        orderBy: { date: "asc" },
      }),
    ]);

  const generateDateRange = (start: Date, end: Date) => {
    const dates = [];
    let currentDate = new Date(start);

    while (currentDate <= end) {
      dates.push(new Date(currentDate)); // Push sebagai object Date
      currentDate.setDate(currentDate.getDate() + 1); // Geser ke hari berikutnya
    }

    return dates;
  };

  const dateRange = generateDateRange(startDate, endDate);

  const weeklySummary = dateRange.map((date) => {
    const daily = dailySummary.find((item) => {
      if (!item.plannedGiDate) return false;
      return (
        new Date(item.plannedGiDate).toDateString() === date.toDateString()
      );
    });

    const distribution = distributionSummary.find(
      (item) => new Date(item.giDate).toDateString() === date.toDateString()
    );
    const monthly = monthlyData.find(
      (item) => new Date(item.date).toDateString() === date.toDateString()
    );

    return {
      date,
      dailySummary: daily?._sum?.allocatedQty || 0,
      totalElpiji: monthly?.totalElpiji || 0,
      distributionSummary: distribution?._sum?.distributionQty || 0,
    };
  });
  return { weeklySummary, startDate, endDate };
};

export const getAnnualSummaryData = async (company_id: number) => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);

  // Generate rentang bulan
  const months = eachMonthOfInterval({
    start: startOfYear,
    end: endOfYear,
  }).map((month) => ({
    startDate: new Date(Date.UTC(year, month.getMonth(), 1, 0, 0, 0, 0)),
    endDate: new Date(Date.UTC(year, month.getMonth() + 1, 0, 23, 59, 59, 999)),
    month: month.getMonth() + 1,
  }));

  const allData = await Promise.all(
    months.map(async ({ startDate, endDate, month }) => {
      const [dailySummary, distributionSummary, monthlySummary] =
        await prisma.$transaction([
          prisma.allocations.groupBy({
            by: ["giDate"],
            _sum: { allocatedQty: true },

            where: {
              AND: [
                {
                  giDate: { gte: startDate, lte: endDate },
                },
                {
                  creator: {
                    companiesId: company_id,
                  },
                },
              ],
            },
            orderBy: { giDate: "asc" },
          }),
          prisma.lpgDistributions.groupBy({
            by: ["giDate"],
            _sum: { distributionQty: true },
            where: {
              AND: [
                {
                  giDate: { gte: startDate, lte: endDate },
                },
                {
                  creator: {
                    companiesId: company_id,
                  },
                },
              ],
            },
            orderBy: { giDate: "asc" },
          }),
          prisma.monthlyAllocations.findMany({
            where: {
              AND: [
                {
                  date: { gte: startDate, lte: endDate },
                },
                {
                  creator: {
                    companiesId: company_id,
                  },
                },
              ],
            },
            select: { totalElpiji: true, date: true },
          }),
        ]);

      return {
        month,
        totalAllocatedQty: dailySummary.reduce(
          (sum, entry) => sum + (entry._sum?.allocatedQty || 0),
          0
        ),
        totalDistributionQty: distributionSummary.reduce(
          (sum, entry) => sum + (entry._sum?.distributionQty || 0),
          0
        ),
        totalMonthlyElpiji: monthlySummary.reduce(
          (sum, entry) => sum + (entry.totalElpiji || 0),
          0
        ),
      };
    })
  );

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  //test
  // Pastikan semua bulan ada, meskipun datanya kosong
  const mergedData = months.map(({ month }) => {
    const data = allData.find((item) => item.month === month) || {
      totalAllocatedQty: 0,
      totalDistributionQty: 0,
      totalMonthlyElpiji: 0,
    };

    return {
      month: String(`${monthNames[month - 1]}`),
      totalAllocatedQty: data.totalAllocatedQty,
      totalDistributionQty: data.totalDistributionQty,
      totalMonthlyElpiji: data.totalMonthlyElpiji,
    };
  });

  return mergedData;
};

// Dengan ini, datanya jadi lebih ringkas, langsung teragregasi per bulan, dan kalau nggak ada data, nilainya jadi 0. 🚀

export const allDataDefault = async (company_id: number) => {
  const [allSummary, allDistributionSummary, allMonthlyData, uniqueDate] =
    await prisma.$transaction([
      prisma.allocations.aggregate({
        _sum: { allocatedQty: true },
        _count: { _all: true },
        where: {
          creator: {
            companiesId: company_id,
          },
        },
      }),
      prisma.lpgDistributions.aggregate({
        _sum: { distributionQty: true },
        _count: { _all: true },
        where: {
          creator: {
            companiesId: company_id,
          },
        },
      }),
      prisma.monthlyAllocations.aggregate({
        _sum: { totalElpiji: true },
        _count: { _all: true },
        where: {
          creator: {
            companiesId: company_id,
          },
        },
      }),
      prisma.lpgDistributions.findMany({
        distinct: ["giDate"], // Ambil tanggal unik
        where: {
          creator: {
            companiesId: company_id,
          },
        },
        select: {
          giDate: true, // Cuma ambil tanggalnya aja
        },
        orderBy: {
          giDate: "asc", // Urutkan dari yang paling awal
        },
      }),
    ]);

  const totalProps = uniqueDate.reduce(
    (a, obj) => a + Object.keys(obj).length,
    0
  );

  const dailyAllo = allSummary._sum?.allocatedQty;
  const dailyDistri = allDistributionSummary._sum?.distributionQty;
  const dailyMonthly = allMonthlyData._sum?.totalElpiji;

  const pending =
    (dailyAllo ?? 0) > (dailyDistri ?? 0)
      ? (dailyAllo ?? 0) - (dailyDistri ?? 0)
      : 0;

  const fakultatif =
    (dailyAllo ?? 0) > (dailyMonthly ?? 0)
      ? (dailyAllo ?? 0) - (dailyMonthly ?? 0)
      : 0;

  const tidakTembus =
    (dailyMonthly ?? 0) > (dailyAllo ?? 0)
      ? (dailyMonthly ?? 0) - (dailyAllo ?? 0)
      : 0;

  // console.log(allDistributionSummary._count?._all);

  const average = totalProps ? ((dailyAllo ?? 0) / totalProps).toFixed(2) : "0";

  return {
    allSummary,
    allDistributionSummary,
    allMonthlyData,
    pending,
    fakultatif,
    tidakTembus,
    average,
  };
};
