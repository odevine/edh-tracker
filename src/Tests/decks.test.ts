import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  createDeck,
  deleteDeck,
  getDeck,
  listDecks,
  updateDeck,
} from "@/Functions/Deck/Service";
import { createUser, deleteUser } from "@/Functions/User/Service";
import { createTestDeck, createTestUser } from "@/Tests/utils/testData";

const userId = "decks-test-user-1";
const deckId = "decks-test-deck-1";

const baseDeck = createTestDeck(deckId, userId);
const baseUser = createTestUser(userId);

describe("deck service (dynamo integration)", () => {
  beforeEach(async () => {
    await deleteDeck(deckId);
    await deleteUser(userId);
    await createUser(baseUser);
  });

  afterEach(async () => {
    await deleteDeck(deckId);
    await deleteUser(userId);
  });

  it("creates and fetches a deck", async () => {
    await createDeck(baseDeck);
    const fetched = await getDeck(deckId);

    expect(fetched).toBeDefined();
    expect(fetched?.displayName).toBe(baseDeck.displayName);
    expect(fetched?.commanderName).toBe(baseDeck.commanderName);
  });

  it("lists all decks including the test deck", async () => {
    await createDeck(baseDeck);
    const decks = await listDecks();
    const match = decks.find((d) => d.id === deckId);
    expect(match).toBeDefined();
  });

  it("updates the deck name and commander", async () => {
    await createDeck(baseDeck);
    const updated = await updateDeck(deckId, {
      displayName: "Updated Deck",
      commanderName: "Kraum, Ludevic's Opus",
    });

    expect(updated.displayName).toBe("Updated Deck");
    expect(updated.commanderName).toBe("Kraum, Ludevic's Opus");
  });

  it("preserves and updates format stats", async () => {
    const deckWithStats = {
      ...createTestDeck("deck2", userId),
      formatStats: {
        commander: { gamesPlayed: 5, gamesWon: 2 },
      },
    };

    await createDeck(deckWithStats);

    const updated = await updateDeck(deckWithStats.id, {
      formatStats: {
        commander: { gamesPlayed: 6, gamesWon: 3 },
        duel: { gamesPlayed: 1, gamesWon: 1 },
      },
    });

    expect(updated.formatStats.commander.gamesPlayed).toBe(6);
    expect(updated.formatStats.duel.gamesWon).toBe(1);

    await deleteDeck(deckWithStats.id);
  });

  it("sets deck as inactive", async () => {
    await createDeck(baseDeck);
    const updated = await updateDeck(deckId, { inactive: true });

    expect(updated.inactive).toBe(true);
  });

  it("deletes a deck", async () => {
    await createDeck(baseDeck);
    await deleteDeck(deckId);

    const result = await getDeck(deckId);
    expect(result).toBeNull();
  });

  it("returns null for a nonexistent deck", async () => {
    const result = await getDeck("nonexistent-deck");
    expect(result).toBeNull();
  });
});
