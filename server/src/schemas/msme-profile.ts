import { z } from "zod";

export const msmeProfileSchema = z.object({
  storeName: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(10),
  location: z.string().min(2),
  distanceKm: z.number().nonnegative()
});

export type MsmeProfileInput = z.infer<typeof msmeProfileSchema>;
