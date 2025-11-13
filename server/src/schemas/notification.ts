import { NewsType, UserRole } from "@prisma/client";
import { z } from "zod";

export const notificationSchema = z.object({
  title: z.string().min(3),
  message: z.string().min(5),
  type: z.enum(["system", "order", "announcement"]),
  targetRole: z.nativeEnum(UserRole).optional()
});

export type NotificationInput = z.infer<typeof notificationSchema>;
