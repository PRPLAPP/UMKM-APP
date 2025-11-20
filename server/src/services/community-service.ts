import { MsmeStatus } from "@prisma/client";

import { prisma } from "../db/client.js";
import { HttpError } from "../utils/http-error.js";
import { newsItemSchema, tourismSpotSchema } from "../schemas/community.js";
import { env } from "../config/env.js";

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
    fetchExternalEventsCount(),
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

async function fetchExternalEventsCount(): Promise<number> {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return 0;
  }

  const endpoint = `${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/events?select=id`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        apikey: env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
        Prefer: "count=exact",
        Range: "0-0"
      }
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Failed to fetch events (status ${response.status})`);
    }

    const contentRange = response.headers.get("content-range");
    if (contentRange) {
      const totalPart = contentRange.split("/").pop();
      const total = totalPart ? Number(totalPart) : NaN;
      if (!Number.isNaN(total)) {
        return total;
      }
    }

    const payload = (await response.json()) as unknown[];
    return payload.length;
  } catch (error) {
    console.error("Failed to fetch external events count", error);
    return 0;
  }
}

export async function createNewsItem(payload: unknown, userId: string) {
  const data = newsItemSchema.parse(payload);
  const news = await prisma.newsItem.create({
    data: {
      title: data.title,
      summary: data.summary,
      type: data.type,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      createdById: userId
    }
  });
  return {
    id: news.id,
    title: news.title,
    summary: news.summary,
    type: news.type,
    publishedAt: news.publishedAt.toISOString()
  };
}

export async function deleteNewsItem(newsId: string, userRole: string) {
  if (userRole !== "admin") {
    throw new HttpError("Only admins can delete news items", 403);
  }
  await prisma.newsItem.delete({ where: { id: newsId } });
}

export async function createTourismSpot(payload: unknown, userId: string) {
  const data = tourismSpotSchema.parse(payload);
  const spot = await prisma.tourismSpot.create({
    data: {
      ...data,
      createdById: userId
    }
  });
  return {
    id: spot.id,
    name: spot.name,
    description: spot.description,
    imageUrl: spot.imageUrl,
    location: spot.location
  };
}

export async function deleteTourismSpot(spotId: string, userRole: string) {
  if (userRole !== "admin") {
    throw new HttpError("Only admins can delete tourism spots", 403);
  }
  await prisma.tourismSpot.delete({ where: { id: spotId } });
}
