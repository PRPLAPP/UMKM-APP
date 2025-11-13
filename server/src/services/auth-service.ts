import { hash, compare } from "bcryptjs";
import type { User } from "@prisma/client";

import { prisma } from "../db/client.js";
import { registerInputSchema, loginInputSchema, type RegisterInput } from "../schemas/auth.js";
import { HttpError } from "../utils/http-error.js";

const SALT_ROUNDS = 12;

function toPublicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString()
  };
}

export async function registerUser(payload: unknown) {
  const data = registerInputSchema.parse(payload);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new HttpError("Email already registered", 409);
  }

  const passwordHash = await hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      passwordHash
    }
  });

  return toPublicUser(user);
}

export async function authenticateUser(payload: unknown) {
  const data = loginInputSchema.parse(payload);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new HttpError("Invalid credentials", 401);
  }

  const isValid = await compare(data.password, user.passwordHash);
  if (!isValid) {
    throw new HttpError("Invalid credentials", 401);
  }

  return toPublicUser(user);
}

export type PublicUser = ReturnType<typeof toPublicUser>;
