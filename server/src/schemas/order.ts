import { z } from "zod";

export const orderStatusSchema = z.enum(["pending", "processing", "completed"]);

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive()
});

export const orderInputSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  items: z.array(orderItemSchema).min(1),
  status: orderStatusSchema.default("pending")
});

export const orderSchema = orderInputSchema.extend({
  id: z.string().uuid(),
  total: z.number().nonnegative(),
  createdAt: z.string().datetime()
});

export type OrderInput = z.infer<typeof orderInputSchema>;
export type Order = z.infer<typeof orderSchema>;
