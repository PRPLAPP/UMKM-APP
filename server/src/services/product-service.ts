import { prisma } from "../db/client.js";
import { productInputSchema, type Product } from "../schemas/product.js";
import { HttpError } from "../utils/http-error.js";

export async function getProducts(ownerId?: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: ownerId ? { ownerId } : undefined,
    orderBy: { createdAt: "desc" }
  });

  return products.map((product) => toProduct(product));
}

export async function createProduct(payload: unknown, ownerId?: string): Promise<Product> {
  const data = productInputSchema.parse(payload);
  const product = await prisma.product.create({
    data: {
      ...data,
      ownerId
    }
  });

  return toProduct(product);
}

export async function updateProduct(productId: string, ownerId: string, payload: unknown): Promise<Product> {
  const data = productInputSchema.partial().refine((values) => Object.keys(values).length > 0, {
    message: "Provide at least one field to update"
  }).parse(payload);

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing || existing.ownerId !== ownerId) {
    throw new HttpError("Product not found", 404);
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data
  });

  return toProduct(product);
}

export async function deleteProduct(productId: string, ownerId: string) {
  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing || existing.ownerId !== ownerId) {
    throw new HttpError("Product not found", 404);
  }

  await prisma.product.delete({ where: { id: productId } });
}

function toProduct(product: { id: string; name: string; description: string; price: number; stock: number; category: string; createdAt: Date }) {
  return {
    ...product,
    createdAt: product.createdAt.toISOString()
  } satisfies Product;
}
