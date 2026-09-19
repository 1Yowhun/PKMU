import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    id,
    status,
    agentName,
    deliveryNumber,
    range,
    page = 1,
    pageSize = 15,
  } = body;

  try {
    const whereConditions: any = {};

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

      // Set jam agar filter berlaku untuk seluruh hari
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      whereConditions.plannedGiDate = {
        gte: start,
        lte: end,
      };
      // .OR = [
      //   {
      //     giDate: null,
      //     updatedAt: {
      //       gte: start,
      //       lte: end,
      //     },
      //   },
      //   {
      //     giDate: {
      //       not: null,
      //       gte: start,
      //       lte: end,
      //     },
      //   },
      // ];
    }

    whereConditions.creator = {
      companiesId: id,
    };

    if (agentName) {
      whereConditions.agentName = {
        equals: agentName,
        mode: "insensitive",
      };
    }

    if (status) {
      whereConditions.status = {
        equals: status,
        mode: "insensitive",
      };
    }

    if (deliveryNumber) {
      whereConditions.deliveryNumber = {
        equals: deliveryNumber,
        mode: "insensitive",
      };
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const totalQty = await prisma.allocations.aggregate({
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      _sum: {
        allocatedQty: true,
      },
    });

    const totalAgen = await prisma.allocations.groupBy({
      by: ["agentName"],
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
    });

    const totalAgenCount = totalAgen.length;

    const totalAlokasiHarian = await prisma.allocations.count({
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
    });

    // Hitung total berat
    const totalBeratQty = (totalQty._sum.allocatedQty || 0) * 3;

    // Query total count untuk pagination
    const totalCount = await prisma.allocations.count({
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined, // Jika tidak ada filter, where akan diabaikan
    });

    const filteredData = await prisma.allocations.findMany({
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined, // Jika tidak ada filter, where akan diabaikan
      skip,
      take,
      orderBy: { bpeNumber: "desc" },
      select: {
        id: true,
        status: true,
        deliveryNumber: true,
        shipTo: true,
        agentName: true,
        materialName: true,
        allocatedQty: true,
        plannedGiDate: true,
        giDate: true,
        bpeNumber: true,
        updatedAt: true,
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
          totalAlokasiHarian,
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
