import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company_id, agentName, deliveryNumber, range } = body;
    const whereConditions: any = {};
    let fromDate = range.from ? new Date(range.from) : null;
    let toDate = range.to ? new Date(range.to) : null;

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

    const companyData = await prisma.companies.findMany({
      where: {
        id: company_id,
      },
      select: {
        companyName: true,
        address: true,
        telephone: true,
      },
    });
    const filteredData = await prisma.lpgDistributions.findMany({
      where: {
        AND: [
          {
            giDate: dateFilter,
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
    });

    // Pastikan filteredData punya allocationId sebelum query allocation & monthly data
    const [allocationData, monthlyData] = await prisma.$transaction([
      prisma.allocations.findMany({
        where: {
          AND: [
            {
              plannedGiDate: dateFilter,
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
                companiesId: company_id,
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

    // 1. Reduce allocatedQty berdasarkan plannedGiDate dari allocationData
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
    const totalPlannedAllocation = Object.values(plannedAllocationByDate)[0];

    // Mengambil semua data yang difilter tanpa pagination
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

    // Gabungkan data berdasarkan allocationId
    const mergedData = filteredData.map((item) => ({
      ...item,
      materialName: allocationMap.get(item.allocationId)?.materialName || null,
      plannedGiDate:
        allocationMap.get(item.allocationId)?.plannedGiDate || null,
      plannedAllocationQty:
        allocationMap.get(item.allocationId)?.plannedAllocationQty || 0,
    }));

    const firstCompany = companyData[0];

    const jsonObject = {
      companyName: firstCompany.companyName,
      address: firstCompany.address,
      telephone: firstCompany.telephone,
    };

    // Group data by date
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

      const matchingMonthly = monthlyData.find(
        (m) => new Date(m.date).toISOString().split("T")[0] === dateKey
      );

      acc[dateKey].quantity.totalElpiji = matchingMonthly
        ? matchingMonthly.totalElpiji
        : 0;
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
