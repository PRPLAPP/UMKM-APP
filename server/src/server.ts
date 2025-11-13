import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";

import { env } from "./config/env.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerProductRoutes } from "./routes/products.js";
import { registerOrderRoutes } from "./routes/orders.js";
import { registerReportRoutes } from "./routes/reports.js";
import { prisma } from "./db/client.js";

const app = Fastify({
  logger: true
});

await app.register(cors, { origin: true });
await registerHealthRoutes(app);
await registerProductRoutes(app);
await registerOrderRoutes(app);
await registerReportRoutes(app);

app.addHook("onClose", async () => {
  await prisma.$disconnect();
});

const start = async () => {
  try {
    await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
