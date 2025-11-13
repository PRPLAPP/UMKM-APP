import { MsmeStatus } from "@prisma/client";

import { prisma } from "../db/client.js";

export async function getCommunityHomeData() {
  const [newsItems, tourismSpots, msmeProfiles, stats] = await Promise.all([
    prisma.newsItem.findMany({
      orderBy: { publishedAt: "desc" },
      take: 5
    }),
    prisma.tourismSpot.findMany({
      orderBy: { createdAt: "desc" },
      take: 6
    }),
    prisma.msmeProfile.findMany({
      where: { status: MsmeStatus.approved },
      orderBy: { distanceKm: "asc" },
      take: 6
    }),
    aggregateCommunityStats()
  ]);

  return {
    stats,
    news: newsItems.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      type: item.type,
      publishedAt: item.publishedAt.toISOString()
    })),
    tourismSpots: tourismSpots.map((spot) => ({
      id: spot.id,
      name: spot.name,
      description: spot.description,
      imageUrl: spot.imageUrl,
      location: spot.location
    })),
    msmes: msmeProfiles.map((profile) => ({
      id: profile.id,
      name: profile.storeName,
      category: profile.category,
      distanceKm: profile.distanceKm,
      rating: profile.rating,
      location: profile.location
    }))
  };
}

async function aggregateCommunityStats() {
  const [eventsCount, businessesCount, tourismSpotsCount, activeMembers] = await Promise.all([
    prisma.newsItem.count({ where: { type: "event" } }),
    prisma.msmeProfile.count({ where: { status: MsmeStatus.approved } }),
    prisma.tourismSpot.count(),
    prisma.user.count()
  ]);

  return {
    eventsCount,
    businessesCount,
    tourismSpotsCount,
    activeMembers
  };
}
