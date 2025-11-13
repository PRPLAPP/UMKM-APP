import { FastifyInstance, FastifyReply } from "fastify";

import { authenticateUser, registerUser, type PublicUser } from "../services/auth-service.js";
import { HttpError } from "../utils/http-error.js";
import { prisma } from "../db/client.js";

async function sendAuthResponse(reply: FastifyReply, user: PublicUser) {
  const token = await reply.jwtSign({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name
  });

  return reply.send({ token, user });
}

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (request, reply) => {
    try {
      const user = await registerUser(request.body);
      return await sendAuthResponse(reply, user);
    } catch (error) {
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      app.log.error(error);
      return reply.status(500).send({ message: "Unexpected error" });
    }
  });

  app.post("/auth/login", async (request, reply) => {
    try {
      const user = await authenticateUser(request.body);
      return await sendAuthResponse(reply, user);
    } catch (error) {
      if (error instanceof HttpError) {
        return reply.status(error.statusCode).send({ message: error.message });
      }
      app.log.error(error);
      return reply.status(500).send({ message: "Unexpected error" });
    }
  });

  app.get("/auth/me", { preHandler: [app.authenticate] }, async (request, reply) => {
    const user = await prisma.user.findUnique({ where: { id: request.user.sub } });
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString()
      }
    };
  });
}
