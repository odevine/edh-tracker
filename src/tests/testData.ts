import { CreateMatchInput, Deck, Format, User } from "@/types";

export const createTestUser = (id: string): User => ({
  id,
  displayName: `Test User ${id}`,
  formatStats: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createTestDeck = (id: string, userId: string): Deck => ({
  id,
  userId,
  formatId: "commander",
  displayName: `Deck for ${userId}`,
  commanderName: "Test Commander",
  commanderColors: ["U"],
  formatStats: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createTestFormat = (id: string): Format => ({
  id,
  displayName: `Test Format ${id}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  inactive: false,
});

export const createMatchInput = (
  matchId: string,
  formatId: string,
  userIds: string[],
  deckIds: string[],
  winningDeckId: string,
): CreateMatchInput => ({
  id: matchId,
  formatId,
  winningDeckId,
  archived: false,
  datePlayed: new Date().toISOString(),
  matchParticipants: userIds.map((userId, i) => ({
    userId,
    deckId: deckIds[i],
  })),
});
