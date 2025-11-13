import { FastifyInstance } from "fastify";
import { createOrder, getOrders } from "../services/order-service.js";

export async function registerOrderRoutes(app: FastifyInstance) {
  app.get("/orders", async () => {
    return getOrders();
  });

  app.post("/orders", async (request, reply) => {
    try {
      const order = await createOrder(request.body);
      return reply.code(201).send(order);
    } catch (error) {
      return reply.status(400).send({ message: (error as Error).message });
    }
  });
}
