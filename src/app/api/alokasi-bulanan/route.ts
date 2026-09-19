import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { month, user } = body;

    const dateObj = new Date(month);

    // Cek apakah dateObj valid
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    // Ambil tanggal terakhir dari bulan yang dikirim
    const lastDayOfMonth = new Date(
      dateObj.getFullYear(),
      dateObj.getMonth() + 1,
      0
    );

    lastDayOfMonth.setUTCDate(lastDayOfMonth.getUTCDate() + 1);
    lastDayOfMonth.setUTCHours(17, 0, 0, 0);

    if (!month) {
      return NextResponse.json(
        { message: "Month is required" },
        { status: 400 }
      );
    }

    const data = await prisma.monthlyAllocations.findMany({
      where: {
        AND: [
          {
            date: {
              gte: dateObj,
              lte: lastDayOfMonth,
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
        date: true,
        totalElpiji: true,
        volume: true,
        updatedAt: true,
      },
      orderBy: {
        date: "asc",
      },
    });


    return NextResponse.json(
      {
        message: data.length ? "Data fetched successfully" : "No data found",
        month,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
