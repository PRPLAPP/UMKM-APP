import { FastifyInstance } from "fastify";

import { getCommunityHomeData, createNewsItem, deleteNewsItem, createTourismSpot, deleteTourismSpot } from "../services/community-service.js";
import { newsItemSchema, tourismSpotSchema } from "../schemas/community.js";
import { HttpError } from "../utils/http-error.js";

export async function registerCommunityRoutes(app: FastifyInstance) {
  app.get("/community/home", async () => {
    return getCommunityHomeData();
  });

  app.post("/community/news", { preHandler: [app.authenticate] }, async (request, reply) => {
    if (request.user.role !== "admin") {
      return reply.status(403).send({ message: "Only admins can create news items" });
    }
    try {
      const news = await createNewsItem(request.body, request.user.sub);
      return reply.code(201).send(news);
    } catch (error) {
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(400).send({ message: (error as Error).message });
    }
  });

  app.delete("/community/news/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await deleteNewsItem(id, request.user.role);
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(400).send({ message: (error as Error).message });
    }
  });

  app.post("/community/tourism", { preHandler: [app.authenticate] }, async (request, reply) => {
    if (request.user.role !== "admin") {
      return reply.status(403).send({ message: "Only admins can create tourism spots" });
    }
    try {
      const spot = await createTourismSpot(request.body, request.user.sub);
      return reply.code(201).send(spot);
    } catch (error) {
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(400).send({ message: (error as Error).message });
    }
  });

  app.delete("/community/tourism/:id", { preHandler: [app.authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await deleteTourismSpot(id, request.user.role);
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      return reply.status(400).send({ message: (error as Error).message });
    }
  });
}
