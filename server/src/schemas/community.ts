import { NewsType } from "@prisma/client";
import { z } from "zod";

export const newsItemSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  type: z.nativeEnum(NewsType),
  publishedAt: z.string().datetime().optional()
});

export type NewsItemInput = z.infer<typeof newsItemSchema>;

export const tourismSpotSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  imageUrl: z.string().url(),
  location: z.string().min(2)
});

export type TourismSpotInput = z.infer<typeof tourismSpotSchema>;
