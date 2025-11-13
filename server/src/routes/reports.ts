import { FastifyInstance } from "fastify";
import { getSalesSummary } from "../services/report-service.js";

export async function registerReportRoutes(app: FastifyInstance) {
  app.get("/reports/sales", async () => {
    return getSalesSummary();
  });
}
