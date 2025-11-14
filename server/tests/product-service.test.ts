import { describe, it, expect, vi, beforeEach } from "vitest";

const prismaMock = vi.hoisted(() => ({
  product: {
    findMany: vi.fn(),
    create: vi.fn()
  }
}));

vi.mock("../src/db/client", () => ({
  prisma: prismaMock
}));

import { getProducts, createProduct } from "../src/services/product-service";

function resetMocks() {
  prismaMock.product.findMany.mockReset();
  prismaMock.product.create.mockReset();
}

describe("product-service", () => {
  beforeEach(() => {
    resetMocks();
  });

  it("returns products with ISO timestamps", async () => {
    prismaMock.product.findMany.mockResolvedValue([
      {
        id: "prod-1",
        name: "Item",
        description: "desc",
        price: 10,
        stock: 5,
        category: "Cat",
        createdAt: new Date("2024-01-01T00:00:00.000Z")
      }
    ]);

    const result = await getProducts();

    expect(prismaMock.product.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" }
    });
    expect(result[0]).toMatchObject({
      id: "prod-1",
      createdAt: "2024-01-01T00:00:00.000Z"
    });
  });

  it("creates products with optional owner id", async () => {
    prismaMock.product.create.mockResolvedValue({
      id: "prod-2",
      name: "New",
      description: "desc",
      price: 5,
      stock: 10,
      category: "Cat",
      ownerId: "owner-1",
      createdAt: new Date("2024-02-02T00:00:00.000Z")
    });

    const payload = {
      name: "New",
      description: "desc",
      price: 5,
      stock: 10,
      category: "Cat"
    };
    const result = await createProduct(payload, "owner-1");

    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: { ...payload, ownerId: "owner-1" }
    });
    expect(result.id).toBe("prod-2");
  });
});
