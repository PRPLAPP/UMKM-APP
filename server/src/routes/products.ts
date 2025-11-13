import { FastifyInstance } from "fastify";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../services/product-service.js";
import { HttpError } from "../utils/http-error.js";

export async function registerProductRoutes(app: FastifyInstance) {
  app.get("/products", async (request) => {
    let ownerId: string | undefined;
    try {
      await request.jwtVerify();
      if (request.user.role === "msme") {
        ownerId = request.user.sub;
      }
    } catch {
      // unauthenticated request - return public catalog
    }
    return getProducts(ownerId);
  });

  app.post("/products", { preHandler: [app.authenticate] }, async (request, reply) => {
    if (request.user.role !== "msme") {
      return reply.status(403).send({ message: "Only MSME owners can create products" });
    }
    try {
      const product = await createProduct(request.body, request.user.sub);
      return reply.code(201).send(product);
    } catch (error) {
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(400).send({ message: (error as Error).message });
    }
  });

  app.put("/products/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    if (request.user.role !== "msme") {
      return reply.status(403).send({ message: "Only MSME owners can update products" });
    }
    const productId = (request.params as { id: string }).id;
    try {
      const product = await updateProduct(productId, request.user.sub, request.body);
      return reply.send(product);
    } catch (error) {
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(400).send({ message: (error as Error).message });
    }
  });

  app.delete("/products/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    if (request.user.role !== "msme") {
      return reply.status(403).send({ message: "Only MSME owners can delete products" });
    }
    const productId = (request.params as { id: string }).id;
    try {
      await deleteProduct(productId, request.user.sub);
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(400).send({ message: (error as Error).message });
    }
  });
}
