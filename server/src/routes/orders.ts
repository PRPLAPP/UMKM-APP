import { FastifyInstance } from "fastify";

import { createOrder, getOrders } from "../services/order-service.js";

export async function registerOrderRoutes(app: FastifyInstance) {
  app.get("/orders", async (request) => {
    let ownerId: string | undefined;
    try {
      await request.jwtVerify();
      if (request.user.role === "msme") {
        ownerId = request.user.sub;
      }
    } catch {
      // unauthenticated requests see aggregate orders
    }
    return getOrders(ownerId);
  });

  app.post("/orders", { preHandler: [app.authenticate] }, async (request, reply) => {
    if (request.user.role !== "msme") {
      return reply.status(403).send({ message: "Only MSME owners can create orders" });
    }
    try {
      const order = await createOrder(request.body, request.user.sub);
      return reply.code(201).send(order);
    } catch (error) {
      return reply.status(400).send({ message: (error as Error).message });
    }
  });
}
