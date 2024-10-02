import { Deck, Match, MatchParticipant } from "@/API";

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
  allMatchParticipants: MatchParticipant[],
  format?: string,
  includeUnranked?: boolean,
): UserStats => {
  // Get all decks owned by the user and is in the format
  const userDecks = allDecks.filter(
    (deck) =>
      deck.deckOwnerId === userId && (format ? deck.deckType === format : true),
  );
  const userDeckIds = userDecks.map((deck) => deck.id);

  // Get all match participants where the user's deck participated
  const userParticipants = allMatchParticipants.filter((participant) =>
    userDeckIds.includes(participant.deckId),
  );

  // Get the match IDs where the user participated
  const userMatchIds = userParticipants.map(
    (participant) => participant.matchId,
  );


  // Filter matches based on the 'includeUnranked' flag
  const relevantMatches = allMatches.filter((match) => {
    const isUserInMatch = userMatchIds.includes(match.id);
    const isRankedMatch = match.matchType !== "none";
    return isUserInMatch && (includeUnranked ? true : isRankedMatch);
  });

  // Calculate total matches
  const totalMatches = relevantMatches.length;

  // Calculate total wins by checking if the user's deck is the winning deck in a match
  const totalWins = relevantMatches.filter((match) =>
    userDeckIds.includes(match.winningDeckId),
  ).length;

  const winRate = totalMatches > 0 ? totalWins / totalMatches : 0;

  return {
    totalMatches,
    totalWins,
    winRate,
    deckCount: userDecks.filter(deck => !deck.isInactive).length,
  };
};

export interface DeckStats {
  totalMatches: number;
  totalWins: number;
  winRate: number;
}

export const getDeckStats = (
  deckId: string,
  allMatches: Match[],
  allMatchParticipants: MatchParticipant[],
): DeckStats => {
  // Get all match participants where the specified deck participated
  const deckParticipants = allMatchParticipants.filter(
    (participant) => participant.deckId === deckId,
  );

  // Get the match IDs where the deck participated
  const deckMatchIds = deckParticipants.map(
    (participant) => participant.matchId,
  );

  // Calculate total matches
  const totalMatches = deckMatchIds.length;

  // Calculate total wins by checking if the deck is the winning deck in a match
  const totalWins = allMatches.filter(
    (match) => match.winningDeckId === deckId,
  ).length;

  const winRate = totalMatches > 0 ? totalWins / totalMatches : 0;

  return {
    totalMatches,
    totalWins,
    winRate,
  };
};
