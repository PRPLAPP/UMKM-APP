import { MsmeStatus } from "@prisma/client";

import { prisma } from "../db/client.js";

interface GrowthRecord {
  month: string;
  users: number;
  msmes: number;
  orders: number;
}

export async function getAdminDashboardData() {
  const [totalUsers, activeMsmes, totalOrders, pendingRequests, verificationRequests, msmeCategories, growth] =
    await Promise.all([
      prisma.user.count(),
      prisma.msmeProfile.count({ where: { status: MsmeStatus.approved } }),
      prisma.order.count(),
      prisma.msmeProfile.count({ where: { status: MsmeStatus.pending } }),
      prisma.msmeProfile.findMany({
        where: { status: MsmeStatus.pending },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 10
      }),
      prisma.msmeProfile.groupBy({
        by: ["category"],
        _count: { category: true },
        where: { status: MsmeStatus.approved }
      }),
      buildGrowthData()
    ]);

  const population = buildPopulationStats(totalUsers);

  return {
    stats: {
      totalUsers,
      activeMsmes,
      totalOrders,
      pendingRequests
    },
    growth,
    verificationRequests: verificationRequests.map((request) => ({
      id: request.id,
      name: request.storeName,
      category: request.category,
      submittedAt: request.createdAt.toISOString(),
      owner: request.user.name
    })),
    msmeCategories: msmeCategories.map((entry) => ({
      category: entry.category,
      count: entry._count.category
    })),
    population
  };
}

async function buildGrowthData(): Promise<GrowthRecord[]> {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [users, msmes, orders] = await Promise.all([
    prisma.user.findMany({ where: { createdAt: { gte: start } }, select: { createdAt: true } }),
    prisma.msmeProfile.findMany({ where: { createdAt: { gte: start }, status: MsmeStatus.approved }, select: { createdAt: true } }),
    prisma.order.findMany({ where: { createdAt: { gte: start } }, select: { createdAt: true } })
  ]);

  const months: GrowthRecord[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = formatMonth(date);
    months.push({ month: key, users: 0, msmes: 0, orders: 0 });
  }

  type GrowthKey = Exclude<keyof GrowthRecord, "month">;
  const increment = (records: { createdAt: Date }[], field: GrowthKey) => {
    for (const record of records) {
      const key = formatMonth(record.createdAt);
      const target = months.find((item) => item.month === key);
      if (target) {
        target[field] += 1;
      }
    }
  };

  increment(users, "users");
  increment(msmes, "msmes");
  increment(orders, "orders");

  return months;
}

function buildPopulationStats(totalUsers: number) {
  const households = Math.max(1, Math.round(totalUsers / 4));
  const workingAge = Math.round(totalUsers * 0.62);
  const students = Math.max(0, totalUsers - workingAge);
  const lastChange = totalUsers ? `+${(Math.min(0.2, workingAge / totalUsers)).toFixed(1)}%` : "+0%";

  return {
    entries: [
      { category: "Total Users", value: totalUsers.toLocaleString(), change: lastChange },
      { category: "Households", value: households.toLocaleString(), change: "+1.8%" },
      { category: "Working Age", value: workingAge.toLocaleString(), change: "+3.1%" },
      { category: "Students", value: students.toLocaleString(), change: "+2.0%" }
    ]
  };
}

function formatMonth(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}
