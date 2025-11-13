import { UserRole } from "@prisma/client";

import { prisma } from "../db/client.js";
import { notificationSchema } from "../schemas/notification.js";

export async function listNotifications(userId: string, userRole: UserRole) {
  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { targetUserId: userId },
        { targetUserId: null, targetRole: userRole },
        { targetUserId: null, targetRole: null }
      ]
    },
    orderBy: { createdAt: "desc" },
    take: 15
  });

  return notifications.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    read: notification.read,
    createdAt: notification.createdAt.toISOString()
  }));
}

export async function createNotification(payload: unknown, authorId: string, targetRole?: UserRole, targetUserId?: string) {
  const data = notificationSchema.parse(payload);
  const notification = await prisma.notification.create({
    data: {
      title: data.title,
      message: data.message,
      type: data.type,
      authorId,
      targetRole: data.targetRole ?? targetRole ?? null,
      targetUserId: targetUserId ?? null
    }
  });

  return notification;
}

export async function markNotificationRead(notificationId: string, userId: string) {
  await prisma.notification.updateMany({
    where: { id: notificationId, targetUserId: userId },
    data: { read: true, readAt: new Date() }
  });
}
