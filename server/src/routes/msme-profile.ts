import { FastifyInstance } from "fastify";

import { getMsmeProfile, updateMsmeProfile } from "../services/msme-profile-service.js";

export async function registerMsmeProfileRoutes(app: FastifyInstance) {
  app.get(
    "/msme/profile",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      if (request.user.role !== "msme") {
        return reply.status(403).send({ message: "MSME access required" });
      }
      const profile = await getMsmeProfile(request.user.sub);
      return profile;
    }
  );

  app.put(
    "/msme/profile",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      if (request.user.role !== "msme") {
        return reply.status(403).send({ message: "MSME access required" });
      }
      const profile = await updateMsmeProfile(request.user.sub, request.body);
      return profile;
    }
  );
}
