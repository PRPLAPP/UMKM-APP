import { describe, it, expect, vi, beforeEach } from "vitest";

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn()
  }
}));

const hashMock = vi.fn(async () => "hashed");
const compareMock = vi.fn(async () => true);

vi.mock("../src/db/client", () => ({
  prisma: prismaMock
}));

vi.mock("bcryptjs", () => ({
  hash: (...args: unknown[]) => hashMock(...args),
  compare: (...args: unknown[]) => compareMock(...args)
}));

import { registerUser, authenticateUser } from "../src/services/auth-service";
import { HttpError } from "../src/utils/http-error";

describe("auth-service", () => {
  beforeEach(() => {
    prismaMock.user.findUnique.mockReset();
    prismaMock.user.create.mockReset();
    hashMock.mockClear();
    compareMock.mockClear();
  });

  it("registers a new user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      role: "villager",
      passwordHash: "hashed",
      createdAt: new Date("2024-01-01T00:00:00.000Z")
    });

    const result = await registerUser({
      name: "Alice",
      email: "alice@example.com",
      password: "StrongPass1",
      role: "villager"
    });

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: "alice@example.com" } });
    expect(hashMock).toHaveBeenCalled();
    expect(result.email).toBe("alice@example.com");
  });

  it("rejects duplicate email", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "existing" });

    await expect(
      registerUser({ name: "Bob", email: "bob@example.com", password: "Password123", role: "villager" })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("authenticates valid credentials", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      role: "villager",
      passwordHash: "hashed",
      createdAt: new Date("2024-01-01T00:00:00.000Z")
    });

    const result = await authenticateUser({ email: "alice@example.com", password: "StrongPass1" });
    expect(compareMock).toHaveBeenCalled();
    expect(result.id).toBe("user-1");
  });

  it("throws on invalid password", async () => {
    compareMock.mockResolvedValueOnce(false);
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      role: "villager",
      passwordHash: "hashed",
      createdAt: new Date("2024-01-01T00:00:00.000Z")
    });

    await expect(
      authenticateUser({ email: "alice@example.com", password: "WrongPass1" })
    ).rejects.toBeInstanceOf(HttpError);
  });
});
