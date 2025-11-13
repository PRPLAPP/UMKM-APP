import { prisma } from "../db/client.js";
import { orderInputSchema, orderStatusSchema, type Order } from "../schemas/order.js";

export async function getOrders(ownerId?: string): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    where: ownerId ? { userId: ownerId } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: true }
  });

  return orders.map((order) => ({
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  }));
}

export async function createOrder(payload: unknown, userId?: string): Promise<Order> {
  const data = orderInputSchema.parse(payload);
  const productIds = data.items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  if (products.length !== productIds.length) {
    const missing = productIds.filter(
      (id) => !products.find((product) => product.id === id)
    );
    throw new Error(`Product(s) not found: ${missing.join(", ")}`);
  }

  const total = data.items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      status: data.status ?? "pending",
      total,
      userId,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }
    },
    include: { items: true }
  });

  return {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  };
}

export async function updateOrderStatus(orderId: string, ownerId: string, status: string): Promise<Order> {
  const parsedStatus = orderStatusSchema.parse(status);
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order || order.userId !== ownerId) {
    throw new Error("Order not found");
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: parsedStatus },
    include: { items: true }
  });

  return {
    id: updated.id,
    customerName: updated.customerName,
    customerEmail: updated.customerEmail,
    status: updated.status,
    total: updated.total,
    createdAt: updated.createdAt.toISOString(),
    items: updated.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  };
}
