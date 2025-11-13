import "@fastify/jwt";
import type { UserRole } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      role: UserRole;
      email: string;
      name: string;
    };
    user: {
      sub: string;
      role: UserRole;
      email: string;
      name: string;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
