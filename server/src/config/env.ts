import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().min(1024).max(65535).default(5000)
});

export const env = envSchema.parse(process.env);
