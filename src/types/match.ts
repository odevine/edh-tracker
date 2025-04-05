export interface Match {
  id: string;
  formatId: string;
  winningDeckId: string;
  archived: boolean;
  datePlayed: string;
  createdAt: string;
  updatedAt: string;
  matchParticipants?: MatchParticipant[];
}

export interface MatchParticipant {
  id: string;
  matchId: string;
  deckId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateMatchInput = Omit<
  Match,
  "id" | "createdAt" | "updatedAt" | "matchParticipants"
> & {
  id?: string;
  matchParticipants: Omit<
    MatchParticipant,
    "id" | "createdAt" | "updatedAt" | "matchId"
  >[];
};

export type UpdateMatchInput = {
  matchUpdates?: Partial<
    Omit<Match, "id" | "createdAt" | "updatedAt" | "matchParticipants">
  >;
  addParticipants?: Omit<
    MatchParticipant,
    "id" | "createdAt" | "updatedAt" | "matchId"
  >[];
  removeParticipantIds?: string[];
};
