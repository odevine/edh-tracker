import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { reverseStatsFromMatch } from "@/Functions/Common";
import { createDeck, deleteDeck, getDeck } from "@/Functions/Deck/Service";
import {
  createMatch,
  deleteMatch,
  getMatch,
  updateMatch,
} from "@/Functions/Match/Service";
import { createUser, deleteUser, getUser } from "@/Functions/User/Service";
import {
  createMatchInput,
  createTestDeck,
  createTestUser,
} from "@/Tests/utils/testData";

const formatId = "match-test-format-1";
const testMatchId = "match-test-match-4p";
const playerIds = [
  "match-test-user-1",
  "match-test-user-2",
  "match-test-user-3",
  "match-test-user-4",
];
const deckIds = [
  "match-test-deck-1",
  "match-test-deck-2",
  "match-test-deck-3",
  "match-test-deck-4",
];
const initialWinner = "match-test-deck-2";
const updatedWinner = "match-test-deck-4";

async function seedPlayersAndDecks() {
  for (let i = 0; i < 4; i++) {
    await deleteUser(playerIds[i]);
    await deleteDeck(deckIds[i]);
    await createUser(createTestUser(playerIds[i]));
    await createDeck(createTestDeck(deckIds[i], playerIds[i]));
  }
}

async function assertStats(winner: string) {
  for (let i = 0; i < 4; i++) {
    const user = await getUser(playerIds[i]);
    const deck = await getDeck(deckIds[i]);
    const expectedWins = deckIds[i] === winner ? 1 : 0;

    expect(user?.formatStats?.[formatId]?.gamesPlayed).toBe(1);
    expect(deck?.formatStats?.[formatId]?.gamesPlayed).toBe(1);
    expect(user?.formatStats?.[formatId]?.gamesWon).toBe(expectedWins);
    expect(deck?.formatStats?.[formatId]?.gamesWon).toBe(expectedWins);
  }
}

describe("match service + stat propagation (dynamo integration)", () => {
  beforeEach(async () => {
    await seedPlayersAndDecks();
    await deleteMatch(testMatchId);
  });

  afterEach(async () => {
    // delete the match and all participants
    await deleteMatch(testMatchId);

    // delete all test users and decks
    for (let i = 0; i < 4; i++) {
      await deleteUser(playerIds[i]);
      await deleteDeck(deckIds[i]);
    }
  });

  it("creates a match and updates stats", async () => {
    const matchInput = createMatchInput(
      testMatchId,
      formatId,
      playerIds,
      deckIds,
      initialWinner,
    );

    const created = await createMatch(matchInput);
    expect(created?.matchParticipants?.length).toBe(4);

    await assertStats(initialWinner);
  });

  it("updates the winner and reflects stat changes", async () => {
    const matchInput = createMatchInput(
      testMatchId,
      formatId,
      playerIds,
      deckIds,
      initialWinner,
    );

    await createMatch(matchInput);
    const original = await getMatch(testMatchId);
    expect(original).toBeDefined();

    if (original) await reverseStatsFromMatch(original);

    const updated = await updateMatch(testMatchId, {
      matchUpdates: { winningDeckId: updatedWinner },
    });

    expect(updated?.winningDeckId).toBe(updatedWinner);
    await assertStats(updatedWinner);
  });

  it("adds participants and updates stats", async () => {
    const matchInput = createMatchInput(
      testMatchId,
      formatId,
      playerIds.slice(0, 2),
      deckIds.slice(0, 2),
      deckIds[0],
    );

    await createMatch(matchInput);

    const updated = await updateMatch(testMatchId, {
      addParticipants: [
        { userId: playerIds[2], deckId: deckIds[2] },
        { userId: playerIds[3], deckId: deckIds[3] },
      ],
    });

    expect(updated.matchParticipants?.length).toBe(4);

    // all players should now have stats
    for (let i = 0; i < 4; i++) {
      const user = await getUser(playerIds[i]);
      const deck = await getDeck(deckIds[i]);

      expect(user?.formatStats?.[formatId]?.gamesPlayed).toBe(1);
      expect(deck?.formatStats?.[formatId]?.gamesPlayed).toBe(1);
    }
  });

  it("removes a participant and reverts their stats", async () => {
    const matchInput = createMatchInput(
      testMatchId,
      formatId,
      playerIds,
      deckIds,
      initialWinner,
    );

    await createMatch(matchInput);

    const original = await getMatch(testMatchId);
    if (!original || !original.matchParticipants) {
      throw new Error("match or participants not found");
    }

    const participant = original.matchParticipants.find(
      (p) => p.userId === playerIds[0],
    );

    if (!participant) {
      throw new Error("participant to remove not found");
    }

    const toRemove = participant.id;
    const removedUserId = participant.userId;
    const removedDeckId = participant.deckId;

    const updated = await updateMatch(testMatchId, {
      removeParticipantIds: [toRemove],
    });

    if (!updated.matchParticipants) {
      throw new Error("matchParticipants missing in updated match");
    }

    expect(updated.matchParticipants.length).toBe(3);

    const user = await getUser(removedUserId);
    const deck = await getDeck(removedDeckId);

    expect(user?.formatStats?.[formatId]?.gamesPlayed ?? 0).toBe(0);
    expect(deck?.formatStats?.[formatId]?.gamesPlayed ?? 0).toBe(0);
  });

  it("deletes a match and reverts all stats", async () => {
    const matchInput = createMatchInput(
      testMatchId,
      formatId,
      playerIds,
      deckIds,
      initialWinner,
    );

    await createMatch(matchInput);
    await new Promise((res) => setTimeout(res, 1000));

    const created = await getMatch(testMatchId);
    expect(created).not.toBeNull();

    await deleteMatch(testMatchId);

    const deleted = await getMatch(testMatchId);
    expect(deleted).toBeNull();

    for (let i = 0; i < 4; i++) {
      const user = await getUser(playerIds[i]);
      const deck = await getDeck(deckIds[i]);

      expect(user?.formatStats?.[formatId]?.gamesPlayed ?? 0).toBe(0);
      expect(deck?.formatStats?.[formatId]?.gamesPlayed ?? 0).toBe(0);
    }
  });

  it("manually reverses match stats", async () => {
    const matchInput = createMatchInput(
      testMatchId,
      formatId,
      playerIds,
      deckIds,
      initialWinner,
    );

    await createMatch(matchInput);
    const created = await getMatch(testMatchId);
    expect(created).toBeDefined();

    if (created) await reverseStatsFromMatch(created);

    for (let i = 0; i < 4; i++) {
      const user = await getUser(playerIds[i]);
      const deck = await getDeck(deckIds[i]);

      expect(user?.formatStats?.[formatId]?.gamesPlayed ?? 0).toBe(0);
      expect(deck?.formatStats?.[formatId]?.gamesPlayed ?? 0).toBe(0);
      expect(user?.formatStats?.[formatId]?.gamesWon ?? 0).toBe(0);
      expect(deck?.formatStats?.[formatId]?.gamesWon ?? 0).toBe(0);
    }
  });

  it("returns null for a nonexistent match", async () => {
    const result = await getMatch("nonexistent-id");
    expect(result).toBeNull();
  });

  it("throws when creating a match without participants", async () => {
    await expect(() =>
      createMatch({
        id: testMatchId,
        formatId,
        winningDeckId: deckIds[0],
        datePlayed: new Date().toISOString(),
        archived: false,
        matchParticipants: [],
      }),
    ).rejects.toThrow();
  });

  it("handles winner not being part of the match", async () => {
    const input = createMatchInput(
      testMatchId,
      formatId,
      playerIds,
      deckIds,
      "nonexistent-deck-id",
    );

    await expect(() => createMatch(input)).rejects.toThrow();
  });
});
