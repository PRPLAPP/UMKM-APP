import { MsmeStatus } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { getAdminDashboardData, updateMsmeStatus } from "../services/admin-service.js";
import { HttpError } from "../utils/http-error.js";

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

  app.patch(
    "/admin/msmes/:id",
    {
      preHandler: [app.authenticate, ensureAdmin]
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: MsmeStatus };
      if (!status || !Object.values(MsmeStatus).includes(status)) {
        return reply.status(400).send({ message: "Invalid status" });
      }
      try {
        const profile = await updateMsmeStatus(id, status);
        return reply.send(profile);
      } catch (error) {
        if (error instanceof HttpError) {
          return reply.status(error.statusCode).send({ message: error.message });
        }
        request.log.error(error);
        return reply.status(500).send({ message: "Failed to update MSME status" });
      }
    }
  );
}
