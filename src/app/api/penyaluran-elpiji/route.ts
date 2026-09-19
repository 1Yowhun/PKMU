import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      company_id,
      agentName,
      deliveryNumber,
      range,
      page = 1,
      pageSize = 15,
    } = body;

    const whereConditions: any = {};

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

    if (range?.from || range?.to) {
      let start, end;

      if (range?.from && range?.to) {
        start = new Date(range.from);
        end = new Date(range.to);
      } else {
        start = new Date(range.from || range.to);
        end = new Date(range.from || range.to);
      }

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json(
          { message: "Invalid date format" },
          { status: 400 }
        );
      }

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      whereConditions.giDate = {
        gte: new Date(start.setHours(0, 0, 0, 0)), // Set waktu awal hari
        lte: new Date(end.setHours(23, 59, 59, 999)), // Set waktu akhir hari
      };
    }

    whereConditions.creator = {
      companiesId: company_id,
    };


    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const totalQty = await prisma.lpgDistributions.aggregate({
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      _sum: {
        allocatedQty: true,
      },
    });

    // Query jumlah unique agentName langsung di database
    const totalAgen = await prisma.lpgDistributions.groupBy({
      by: ["agentName"],
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
    });

    const totalAgenCount = totalAgen.length;

    // Query total alokasi harian (jumlah record)
    const totalDistribusi = await prisma.lpgDistributions.count({
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
    });

    // Hitung total berat
    const totalBeratQty = (totalQty._sum.allocatedQty || 0) * 3;

    // Query total count untuk pagination
    const totalCount = await prisma.lpgDistributions.count({
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined, // Jika tidak ada filter, where akan diabaikan
    });

    const filteredData = await prisma.lpgDistributions.findMany({
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined, // Jika tidak ada filter, where akan diabaikan
      skip,
      take,
      orderBy: { bpeNumber: "desc" },
      select: {
        id: true,
        bpeNumber: true,
        giDate: true,
        agentName: true,
        licensePlate: true,
        deliveryNumber: true,
        allocatedQty: true,
        distributionQty: true,
        driverName: true,
        administrasi: true,
        superVisor: true,
        gateKeeper: true,
        volume: true,
        bocor: true,
        isiKurang: true,
        updatedAt: true,
        createdBy: true,
      },
    });

    return NextResponse.json(
      {
        message: filteredData.length
          ? "Data fetched successfully"
          : "No data found",
        data: filteredData,
        cardInfo: {
          totalQty: totalQty._sum.allocatedQty || 0,
          totalBeratQty,
          totalAgenCount,
          totalDistribusi,
        },
        pagination: {
          total: totalCount,
          page,
          pageSize,
          totalPages: Math.ceil(totalCount / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
