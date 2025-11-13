import { FastifyInstance } from "fastify";

import { getCommunityHomeData } from "../services/community-service.js";

export async function registerCommunityRoutes(app: FastifyInstance) {
  app.get("/community/home", async () => {
    return getCommunityHomeData();
  });
}
