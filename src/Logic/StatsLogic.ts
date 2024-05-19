import { Deck, Match, MatchParticipant } from "@/API";

export interface UserStats {
  totalMatches: number;
  totalWins: number;
}

export const getUserStats = (
  userId: string,
  allDecks: Deck[],
  allMatches: Match[],
  allMatchParticipants: MatchParticipant[],
): UserStats => {
  // Get all decks owned by the user
  const userDecks = allDecks.filter((deck) => deck.deckOwnerId === userId);
  const userDeckIds = userDecks.map((deck) => deck.id);

  // Get all match participants where the user's deck participated
  const userParticipants = allMatchParticipants.filter((participant) =>
    userDeckIds.includes(participant.deckId),
  );

  // Get the match IDs where the user participated
  const userMatchIds = userParticipants.map(
    (participant) => participant.matchId,
  );

  // Calculate total matches
  const totalMatches = userMatchIds.length;

  // Calculate total wins by checking if the user's deck is the winning deck in a match
  const totalWins = allMatches.filter((match) =>
    userDeckIds.includes(match.winningDeckId),
  ).length;

  return {
    totalMatches,
    totalWins,
  };
};

export interface DeckStats {
  totalMatches: number;
  totalWins: number;
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

  return {
    totalMatches,
    totalWins,
  };
};
