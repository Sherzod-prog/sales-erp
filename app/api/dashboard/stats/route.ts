import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalProducts,
      totalCustomers,
      totalOrders,
      pendingOrders,
      paidOrders,
      cancelledOrders,
      lowStockProducts,
      recentOrders,
      ordersForTimeline,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.count(),
      prisma.order.count({
        where: { status: "PENDING" },
      }),
      prisma.order.count({
        where: { status: "PAID" },
      }),
      prisma.order.count({
        where: { status: "CANCELLED" },
      }),
      prisma.product.findMany({
        where: {
          stock: {
            lte: 5,
          },
        },
        orderBy: {
          stock: "asc",
        },
        take: 5,
      }),
      prisma.order.findMany({
        include: {
          customer: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
      prisma.order.findMany({
        select: {
          id: true,
          total: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    ]);

    const statusChart = [
      { name: "Pending", value: pendingOrders },
      { name: "Paid", value: paidOrders },
      { name: "Cancelled", value: cancelledOrders },
    ];

    const groupedByDate = ordersForTimeline.reduce<
      Record<string, { date: string; orders: number; revenue: number }>
    >((acc, order) => {
      const date = new Date(order.createdAt).toISOString().slice(0, 10);

      if (!acc[date]) {
        acc[date] = {
          date,
          orders: 0,
          revenue: 0,
        };
      }

      acc[date].orders += 1;

      if (order.status === "PAID") {
        acc[date].revenue += order.total;
      }

      return acc;
    }, {});

    const ordersTimeline = Object.values(groupedByDate).slice(-7);

    return NextResponse.json(
      {
        totalProducts,
        totalCustomers,
        totalOrders,
        pendingOrders,
        paidOrders,
        cancelledOrders,
        lowStockProducts,
        recentOrders,
        statusChart,
        ordersTimeline,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/dashboard/stats error:", error);

    return NextResponse.json(
      { message: "Dashboard statistikani olishda xatolik" },
      { status: 500 }
    );
  }
}