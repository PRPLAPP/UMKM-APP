import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import fastifyStatic from "@fastify/static";
import type { FastifyReply, FastifyRequest } from "fastify";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

import { env } from "./config/env.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerProductRoutes } from "./routes/products.js";
import { registerOrderRoutes } from "./routes/orders.js";
import { registerReportRoutes } from "./routes/reports.js";
import { registerAuthRoutes } from "./routes/auth.js";
import { registerCommunityRoutes } from "./routes/community.js";
import { registerAdminRoutes } from "./routes/admin.js";
import { registerMsmeProfileRoutes } from "./routes/msme-profile.js";
import { registerNotificationRoutes } from "./routes/notifications.js";
import { prisma } from "./db/client.js";

const app = Fastify({
  logger: true
});

await app.register(cors, { origin: true });
await app.register(jwt, { secret: env.JWT_SECRET });

app.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.send(err);
    }
  }
);
await registerHealthRoutes(app);
await registerProductRoutes(app);
await registerOrderRoutes(app);
await registerReportRoutes(app);
await registerAuthRoutes(app);
await registerCommunityRoutes(app);
await registerAdminRoutes(app);
await registerMsmeProfileRoutes(app);
await registerNotificationRoutes(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../client");
const hasClientBundle = fs.existsSync(clientDistPath);

if (hasClientBundle) {
  await app.register(fastifyStatic, {
    root: clientDistPath,
    prefix: "/",
    decorateReply: false
  });

  app.setNotFoundHandler((request, reply) => {
    if (request.raw.url?.startsWith("/api")) {
      return reply.status(404).send({ message: "Not Found" });
    }
    return reply.sendFile("index.html");
  });
} else {
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ message: "Not Found" });
  });
}

app.addHook("onClose", async () => {
  await prisma.$disconnect();
});

const port = process.env.PORT ? Number(process.env.PORT) : env.API_PORT;

const start = async () => {
  try {
    await app.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
