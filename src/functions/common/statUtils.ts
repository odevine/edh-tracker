import { getDeck, updateDeck } from "@/functions/deck/deckService";
import { getUser, updateUser } from "@/functions/user/userService";
import { Match } from "@/types";

export const updateStatsFromMatch = async (match: Match) => {
  const formatId = match.formatId;
  const winningDeckId = match.winningDeckId;

  if (!match.matchParticipants?.length) {
    return;
  }

  for (const p of match.matchParticipants) {
    const isWinner = p.deckId === winningDeckId;

    // update deck stats
    const deck = await getDeck(p.deckId);
    if (deck) {
      deck.formatStats ??= {};
      deck.formatStats[formatId] ??= { gamesPlayed: 0, gamesWon: 0 };

      deck.formatStats[formatId].gamesPlayed += 1;
      if (isWinner) {
        deck.formatStats[formatId].gamesWon += 1;
      }

      await updateDeck(deck.id, { formatStats: deck.formatStats });
    }

    // update user stats
    const user = await getUser(p.userId);
    if (user) {
      user.formatStats ??= {};
      user.formatStats[formatId] ??= { gamesPlayed: 0, gamesWon: 0 };

      user.formatStats[formatId].gamesPlayed += 1;
      if (isWinner) {
        user.formatStats[formatId].gamesWon += 1;
      }

      await updateUser(user.id, { formatStats: user.formatStats });
    }
  }
};

export const reverseStatsFromMatch = async (match: Match) => {
  const formatId = match.formatId;
  const winningDeckId = match.winningDeckId;

  if (!match.matchParticipants?.length) {
    return;
  }

  for (const p of match.matchParticipants) {
    const wasWinner = p.deckId === winningDeckId;

    // reverse deck stats
    const deck = await getDeck(p.deckId);
    if (deck?.formatStats?.[formatId]) {
      deck.formatStats[formatId].gamesPlayed = Math.max(
        0,
        deck.formatStats[formatId].gamesPlayed - 1,
      );
      if (wasWinner) {
        deck.formatStats[formatId].gamesWon = Math.max(
          0,
          deck.formatStats[formatId].gamesWon - 1,
        );
      }

      await updateDeck(deck.id, { formatStats: deck.formatStats });
    }

    // reverse user stats
    const user = await getUser(p.userId);
    if (user?.formatStats?.[formatId]) {
      user.formatStats[formatId].gamesPlayed = Math.max(
        0,
        user.formatStats[formatId].gamesPlayed - 1,
      );
      if (wasWinner) {
        user.formatStats[formatId].gamesWon = Math.max(
          0,
          user.formatStats[formatId].gamesWon - 1,
        );
      }

      await updateUser(user.id, { formatStats: user.formatStats });
    }
  }
};
