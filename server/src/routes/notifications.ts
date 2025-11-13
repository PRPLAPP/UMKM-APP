import { FastifyInstance } from "fastify";

import { createNotification, listNotifications, markNotificationRead } from "../services/notification-service.js";

export async function registerNotificationRoutes(app: FastifyInstance) {
  app.get(
    "/notifications",
    { preHandler: [app.authenticate] },
    async (request) => {
      const notifications = await listNotifications(request.user.sub, request.user.role);
      return notifications;
    }
  );

  app.post(
    "/notifications",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      if (request.user.role !== "admin") {
        return reply.status(403).send({ message: "Admin access required" });
      }
      const notification = await createNotification(request.body, request.user.sub);
      return reply.code(201).send(notification);
    }
  );

  app.post(
    "/notifications/:id/read",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      await markNotificationRead(id, request.user.sub);
      return reply.status(204).send();
    }
  );
}
