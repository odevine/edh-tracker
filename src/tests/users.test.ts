import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from "@/functions/user/userService";
import { createTestUser } from "@/tests/testData";

const baseUser = createTestUser("user-test-user-1");

describe("user service (dynamo integration)", () => {
  beforeEach(async () => {
    await deleteUser(baseUser.id);
  });

  afterEach(async () => {
    await deleteUser(baseUser.id);
  });

  it("creates a user", async () => {
    await createUser(baseUser);
    const user = await getUser(baseUser.id);

    expect(user).toBeDefined();
    expect(user?.id).toBe(baseUser.id);
    expect(user?.displayName).toBe(baseUser.displayName);
  });

  it("fetches all users including the test user", async () => {
    await createUser(baseUser);
    const users = await listUsers();
    const found = users.find((u) => u.id === baseUser.id);
    expect(found).toBeDefined();
  });

  it("updates the user display name", async () => {
    await createUser(baseUser);
    const updated = await updateUser(baseUser.id, {
      displayName: "Updated User",
    });

    expect(updated.displayName).toBe("Updated User");

    const fetched = await getUser(baseUser.id);
    expect(fetched?.displayName).toBe("Updated User");
  });

  it("preserves and updates format stats", async () => {
    const userWithStats = createTestUser("user-test-user-2");
    userWithStats.formatStats = {
      commander: { gamesPlayed: 5, gamesWon: 2 },
    };

    await createUser(userWithStats);

    const updated = await updateUser(userWithStats.id, {
      formatStats: {
        commander: { gamesPlayed: 6, gamesWon: 3 },
        duel: { gamesPlayed: 1, gamesWon: 1 },
      },
    });

    expect(updated.formatStats.commander.gamesPlayed).toBe(6);
    expect(updated.formatStats.duel.gamesWon).toBe(1);

    await deleteUser(userWithStats.id);
  });

  it("deletes a user", async () => {
    await createUser(baseUser);
    await deleteUser(baseUser.id);

    const user = await getUser(baseUser.id);
    expect(user).toBeNull();
  });

  it("returns null for a nonexistent user", async () => {
    const missing = await getUser("nonexistent-user");
    expect(missing).toBeNull();
  });

  it("overwrites or rejects duplicate user creation", async () => {
    await createUser(baseUser);
    await expect(createUser(baseUser)).rejects.toThrow(/already exists/);
  });
});
