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
    const { company_id, agentName, deliveryNumber, range } = body;
    const whereConditions: any = {};
    let fromDate = range?.from ? new Date(range.from) : null;
    let toDate = range?.to ? new Date(range.to) : null;

    if (agentName) {
      whereConditions.agentName = {
        equals: agentName,
        mode: "insensitive",
      };
    }

    if (deliveryNumber) {
      whereConditions.deliveryNumber = {
        equals: deliveryNumber,
        mode: "insensitive",
      };
    }

    if (fromDate) {
      const start = new Date(fromDate);
      if (isNaN(start.getTime())) {
        return NextResponse.json(
          { message: "Invalid date format" },
          { status: 400 }
        );
      }
      fromDate.setUTCHours(0, 0, 0, 0);
    }

    if (toDate) {
      const end = new Date(toDate);
      if (isNaN(end.getTime())) {
        return NextResponse.json(
          { message: "Invalid date format" },
          { status: 400 }
        );
      }
      end.setUTCHours(23, 59, 59, 999);
    } else if (fromDate && !toDate) {
      // Jika hanya ada fromDate, ambil data untuk hari itu saja
      toDate = new Date(fromDate);
      toDate.setUTCHours(23, 59, 59, 999);
    }
    const dateFilter = fromDate && toDate ? { gte: fromDate, lte: toDate } : {};

    // Pastikan companyId berasal dari user session kecuali jika ADMIN
    const targetCompanyId =
      authUser.role === "ADMIN" && company_id
        ? company_id
        : authUser.companiesId;

    // Jalankan semua query pembacaan secara paralel dengan Promise.all
    const [company, filteredData, allocationData, monthlyData] =
      await Promise.all([
        prisma.companies.findUnique({
          where: {
            id: targetCompanyId,
          },
          select: {
            companyName: true,
            address: true,
            telephone: true,
          },
        }),
        prisma.lpgDistributions.findMany({
          where: {
            AND: [
              {
                giDate: dateFilter,
              },
              {
                creator: {
                  companiesId: targetCompanyId,
                },
              },
              ...(whereConditions.agentName
                ? [{ agentName: whereConditions.agentName }]
                : []),
              ...(whereConditions.deliveryNumber
                ? [{ deliveryNumber: whereConditions.deliveryNumber }]
                : []),
            ],
          },
          orderBy: { bpeNumber: "desc" },
          select: {
            id: true,
            bpeNumber: true,
            agentName: true,
            giDate: true,
            licensePlate: true,
            deliveryNumber: true,
            allocatedQty: true,
            distributionQty: true,
            volume: true,
            driverName: true,
            allocationId: true,
          },
        }),
        prisma.allocations.findMany({
          where: {
            AND: [
              {
                plannedGiDate: dateFilter,
              },
              {
                creator: {
                  companiesId: targetCompanyId,
                },
              },
            ],
          },
          select: {
            id: true,
            materialName: true,
            plannedGiDate: true,
            allocatedQty: true,
          },
        }),
        prisma.monthlyAllocations.findMany({
          where: {
            AND: [
              {
                date: dateFilter,
              },
              {
                creator: {
                  companiesId: targetCompanyId,
                },
              },
            ],
          },
          select: {
            date: true,
            totalElpiji: true,
          },
        }),
      ]);

    // 1. Pre-index allocation dan monthly data ke Map untuk lookup O(1)
    const plannedAllocationByDate = allocationData.reduce((acc: any, item) => {
      const plannedDateKey = item.plannedGiDate
        ? new Date(item.plannedGiDate).toISOString().split("T")[0]
        : null;

      if (plannedDateKey) {
        if (!acc[plannedDateKey]) {
          acc[plannedDateKey] = 0;
        }

        acc[plannedDateKey] += item.allocatedQty || 0;
      }

      return acc;
    }, {});

    const allocationMap = new Map(
      allocationData.map((item) => [
        item.id,
        {
          materialName: item.materialName.includes("REFILL")
            ? "REFILL"
            : item.materialName,
          plannedGiDate: item.plannedGiDate,
          plannedAllocationQty: item.allocatedQty,
        },
      ])
    );

    const monthlyDataMap = new Map(
      monthlyData.map((m) => [
        new Date(m.date).toISOString().split("T")[0],
        m.totalElpiji,
      ])
    );

    // Gabungkan data berdasarkan allocationId
    const mergedData = filteredData.map((item) => ({
      ...item,
      materialName: allocationMap.get(item.allocationId)?.materialName || null,
      plannedGiDate:
        allocationMap.get(item.allocationId)?.plannedGiDate || null,
      plannedAllocationQty:
        allocationMap.get(item.allocationId)?.plannedAllocationQty || 0,
    }));

    const jsonObject = company
      ? {
          companyName: company.companyName,
          address: company.address,
          telephone: company.telephone,
        }
      : {
          companyName: "",
          address: "",
          telephone: "",
        };

    // Group data by date dengan O(1) lookup ke monthlyDataMap
    const groupedData = mergedData.reduce((acc: any, item) => {
      const dateKey = new Date(item.giDate).toISOString().split("T")[0];

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          records: [],
          quantity: {
            totalElpiji: 0,
            totalAllocatedQty: 0,
            totalDistributionQty: 0,
            totalLo: 0,
            totalPending: 0,
            totalFakultatif: 0,
          },
        };
      }

      acc[dateKey].records.push(item);

      const matchingElpiji = monthlyDataMap.get(dateKey) || 0;

      acc[dateKey].quantity.totalElpiji = matchingElpiji;
      acc[dateKey].quantity.totalAllocatedQty =
        plannedAllocationByDate[dateKey] || 0;
      acc[dateKey].quantity.totalDistributionQty += item.distributionQty || 0;
      acc[dateKey].quantity.totalLo =
        acc[dateKey].quantity.totalElpiji >
        acc[dateKey].quantity.totalAllocatedQty
          ? acc[dateKey].quantity.totalElpiji -
            acc[dateKey].quantity.totalAllocatedQty
          : 0;
      acc[dateKey].quantity.totalPending =
        acc[dateKey].quantity.totalAllocatedQty >
        acc[dateKey].quantity.totalDistributionQty
          ? acc[dateKey].quantity.totalAllocatedQty -
            acc[dateKey].quantity.totalDistributionQty
          : 0;

      acc[dateKey].quantity.totalFakultatif =
        acc[dateKey].quantity.totalAllocatedQty >
        acc[dateKey].quantity.totalElpiji
          ? acc[dateKey].quantity.totalAllocatedQty -
            acc[dateKey].quantity.totalElpiji
          : 0;
      return acc;
    }, {});

    // Convert grouped data to an array
    const resultData = Object.values(groupedData);

    return NextResponse.json({
      message: resultData.length
        ? "Data fetched successfully"
        : "No data found",
      result: {
        data: resultData,
        companyData: jsonObject,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
