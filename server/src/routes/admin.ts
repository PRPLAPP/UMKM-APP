import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { getAdminDashboardData } from "../services/admin-service.js";

async function ensureAdmin(request: FastifyRequest, reply: FastifyReply) {
  if (request.user.role !== "admin") {
    return reply.status(403).send({ message: "Admin access required" });
  }
}

export async function registerAdminRoutes(app: FastifyInstance) {
  app.get(
    "/admin/dashboard",
    {
      preHandler: [app.authenticate, ensureAdmin]
    },
    async () => {
      return getAdminDashboardData();
    }
  );
}
