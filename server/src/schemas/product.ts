import { z } from "zod";

export const productInputSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(4),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  category: z.string().min(2)
});

export const productSchema = productInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime()
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type Product = z.infer<typeof productSchema>;
