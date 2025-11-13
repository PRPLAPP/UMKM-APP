import { productInputSchema, type Product } from "../schemas/product.js";
import { prisma } from "../db/client.js";

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return products.map((product) => ({
    ...product,
    createdAt: product.createdAt.toISOString()
  }));
}

export async function createProduct(payload: unknown): Promise<Product> {
  const data = productInputSchema.parse(payload);
  const product = await prisma.product.create({
    data
  });

  return {
    ...product,
    createdAt: product.createdAt.toISOString()
  };
}
