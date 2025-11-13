import { MsmeStatus } from "@prisma/client";

import { prisma } from "../db/client.js";
import { msmeProfileSchema } from "../schemas/msme-profile.js";

function toProfile(profile: { storeName: string; category: string; description: string; location: string; distanceKm: number; rating: number; status: MsmeStatus }) {
  return {
    storeName: profile.storeName,
    category: profile.category,
    description: profile.description,
    location: profile.location,
    distanceKm: profile.distanceKm,
    rating: profile.rating,
    status: profile.status
  };
}

export async function getMsmeProfile(userId: string) {
  const profile = await prisma.msmeProfile.findUnique({ where: { userId } });
  if (!profile) {
    const created = await prisma.msmeProfile.create({
      data: {
        userId,
        storeName: "My Store",
        category: "General",
        description: "Describe your store",
        location: "Village Center",
        distanceKm: 0.5,
        status: MsmeStatus.pending
      }
    });
    return toProfile(created);
  }
  return toProfile(profile);
}

export async function updateMsmeProfile(userId: string, payload: unknown) {
  const data = msmeProfileSchema.parse(payload);
  const profile = await prisma.msmeProfile.upsert({
    where: { userId },
    update: { ...data },
    create: {
      userId,
      ...data,
      status: MsmeStatus.pending
    }
  });
  return toProfile(profile);
}
