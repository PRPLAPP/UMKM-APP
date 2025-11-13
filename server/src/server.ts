import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";

import { env } from "./config/env";
import { registerHealthRoutes } from "./routes/health";

const app = Fastify({
  logger: true
});

await app.register(cors, { origin: true });
await registerHealthRoutes(app);

const start = async () => {
  try {
    await app.listen({ port: env.API_PORT, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
