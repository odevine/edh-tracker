import { Deck, Match } from "@/types";

export interface UserStats {
  totalMatches: number;
  totalWins: number;
  winRate: number;
  deckCount: number;
}

export const getUserStats = (
  userId: string,
  allDecks: Deck[],
  allMatches: Match[],
  formatId?: string,
  includeUnranked?: boolean,
): UserStats => {
  // get all user-owned decks in the given format
  const userDecks = allDecks.filter(
    (deck) =>
      deck.userId === userId && (formatId ? deck.formatId === formatId : true),
  );
  const userDeckIds = new Set(userDecks.map((deck) => deck.id));

  // helper to check if user's deck is in a match
  const isUserInMatch = (match: Match) =>
    match.matchParticipants?.some((p) => userDeckIds.has(p.deckId));

  // filter to matches the user participated in
  const relevantMatches = allMatches.filter((match) => {
    const userPlayed = isUserInMatch(match);
    const isRanked = match.formatId !== "unranked";
    return userPlayed && (includeUnranked ? true : isRanked);
  });

  const totalMatches = relevantMatches.length;

  const totalWins = relevantMatches.filter((match) =>
    userDeckIds.has(match.winningDeckId),
  ).length;

  const winRate = totalMatches > 0 ? totalWins / totalMatches : 0;

  return {
    totalMatches,
    totalWins,
    winRate,
    deckCount: userDecks.filter((deck) => !deck.inactive).length,
  };
};

export interface DeckStats {
  totalMatches: number;
  totalWins: number;
  winRate: number;
}

export interface DeckWithStats extends DeckStats, Deck {}

export const getDeckStats = (
  deckId: string,
  allMatches: Match[],
  includeUnranked?: boolean,
): DeckStats => {
  const relevantMatches = allMatches.filter((match) => {
    const deckInMatch = match.matchParticipants?.some(
      (p) => p.deckId === deckId,
    );
    const isRankedMatch = match.formatId !== "unranked";
    return deckInMatch && (includeUnranked ? true : isRankedMatch);
  });

  const totalMatches = relevantMatches.length;

  const totalWins = relevantMatches.filter(
    (match) => match.winningDeckId === deckId,
  ).length;

  const winRate = totalMatches > 0 ? totalWins / totalMatches : 0;

  return {
    totalMatches,
    totalWins,
    winRate,
  };
};
