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
      let start: Date;
      let end: Date;

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
        gte: start,
        lte: end,
      };
    }

    // Pastikan companyId berasal dari user session kecuali jika ADMIN
    const targetCompanyId =
      authUser.role === "ADMIN" && company_id
        ? company_id
        : authUser.companiesId;

    whereConditions.creator = {
      companiesId: targetCompanyId,
    };

    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const effectiveWhere =
      Object.keys(whereConditions).length > 0 ? whereConditions : undefined;

    // Jalankan semua query secara paralel tanpa duplikasi count
    const [totalQty, totalAgen, totalCount, filteredData] = await Promise.all([
      prisma.lpgDistributions.aggregate({
        where: effectiveWhere,
        _sum: {
          allocatedQty: true,
        },
      }),
      prisma.lpgDistributions.groupBy({
        by: ["agentName"],
        where: effectiveWhere,
      }),
      prisma.lpgDistributions.count({
        where: effectiveWhere,
      }),
      prisma.lpgDistributions.findMany({
        where: effectiveWhere,
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
      }),
    ]);

    const totalAgenCount = totalAgen.length;
    const totalDistribusi = totalCount;
    const totalBeratQty = (totalQty._sum.allocatedQty || 0) * 3;

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
