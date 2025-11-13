import { FastifyInstance } from "fastify";
import { createProduct, getProducts } from "../services/product-service.js";

export async function registerProductRoutes(app: FastifyInstance) {
  app.get("/products", async () => {
    return getProducts();
  });

  app.post("/products", async (request, reply) => {
    try {
      const product = await createProduct(request.body);
      return reply.code(201).send(product);
    } catch (error) {
      return reply.status(400).send({ message: (error as Error).message });
    }
  });
}
