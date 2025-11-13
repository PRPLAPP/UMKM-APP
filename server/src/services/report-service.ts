import { prisma } from "../db/client.js";

export async function getSalesSummary() {
  const [totals, lastOrder] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      _count: { _all: true }
    }),
    prisma.order.findFirst({
      orderBy: { createdAt: "desc" }
    })
  ]);

  return {
    totalRevenue: totals._sum.total ?? 0,
    ordersCount: totals._count._all,
    lastOrderAt: lastOrder ? lastOrder.createdAt.toISOString() : null
  };
}
