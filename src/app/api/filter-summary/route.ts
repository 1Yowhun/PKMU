import prisma from "@/lib/db";
import { validateRequest } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { session, user: authUser } = await validateRequest();
    if (!session || !authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { from, to, company_id } = body;

    let fromDate = from ? new Date(from) : null;
    let toDate = to ? new Date(to) : null;

    if (fromDate) {
      fromDate.setUTCDate(fromDate.getUTCDate() + 1);
      fromDate.setUTCHours(0, 0, 0, 0);
    }

    if (toDate) {
      toDate.setUTCDate(toDate.getUTCDate() + 1);
      toDate.setUTCHours(23, 59, 59, 999);
    } else if (fromDate && !toDate) {
      // Kalau hanya ada fromDate, set toDate ke akhir hari yang sama
      toDate = new Date(fromDate);
      toDate.setUTCHours(23, 59, 59, 999);
    }

    const dateFilter = fromDate && toDate ? { gte: fromDate, lte: toDate } : {};

    const targetCompanyId =
      authUser.role === "ADMIN" && company_id
        ? company_id
        : authUser.companiesId;

    const [
      dailySummary,
      dailySummaryGiDate,
      distributionSummary,
      monthlyData,
      uniqueDate,
    ] = await Promise.all([
      prisma.allocations.aggregate({
        _sum: { allocatedQty: true },
        _count: { allocatedQty: true },
        where: {
          AND: [
            { plannedGiDate: dateFilter },
            {
              creator: {
                companiesId: targetCompanyId,
              },
            },
          ],
        },
      }),
      prisma.allocations.aggregate({
        _sum: { allocatedQty: true },
        _count: { allocatedQty: true },
        where: {
          AND: [
            { giDate: dateFilter },
            {
              creator: {
                companiesId: targetCompanyId,
              },
            },
          ],
        },
      }),
      prisma.lpgDistributions.aggregate({
        _sum: { distributionQty: true },
        _count: { distributionQty: true },
        where: {
          AND: [
            { giDate: dateFilter },
            {
              creator: {
                companiesId: targetCompanyId,
              },
            },
          ],
        },
      }),
      prisma.monthlyAllocations.aggregate({
        _sum: { totalElpiji: true },
        _count: { totalElpiji: true },
        where: {
          AND: [
            { date: dateFilter },
            {
              creator: {
                companiesId: targetCompanyId,
              },
            },
          ],
        },
      }),
      prisma.lpgDistributions.findMany({
        distinct: ["giDate"],
        select: {
          giDate: true,
        },
        where: {
          AND: [
            { giDate: dateFilter },
            {
              creator: {
                companiesId: targetCompanyId,
              },
            },
          ],
        },
        orderBy: {
          giDate: "asc",
        },
      }),
    ]);

    const totalProps = uniqueDate.length;

    // Pake buat PlannedGi
    const dailyAllo = dailySummary._sum?.allocatedQty;

    // Pake buat GiDate
    const dailyAlloGiDate = dailySummaryGiDate._sum?.allocatedQty;
    const dailyDistri = distributionSummary._sum?.distributionQty;
    const dailyMonthly = monthlyData._sum?.totalElpiji;

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

    const average = ((dailyDistri ?? 0) / (totalProps || 1)).toFixed(2);

    const avgDistriSummary = {
      _sum: { average: average },
      _count: { businessDays: totalProps },
    };

    return NextResponse.json(
      {
        message: "Date range received",
        dailySummary,
        distributionSummary,
        avgDistriSummary,
        monthlyData,
        pending,
        fakultatif,
        tidakTembus,
        average,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in filter-summary:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
