export interface Format {
  id: string;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  description: string;
  playerRange: string;
  inactive?: boolean;
  singleton?: boolean;
  requiresCommander?: boolean;
  validCommanderFilters?: string;
}

export type CreateFormatInput = Omit<
  Format,
  "id" | "createdAt" | "updatedAt"
> & {
  id?: string;
};

export type UpdateFormatInput = Partial<
  Omit<Format, "id" | "createdAt" | "updatedAt">
>;

export type FormatStatsResult = {
  totalMatches: number;
  uniqueUsers: number;
  uniqueDecks: number;
  // <userId, winCount>
  userWins: Record<string, number>;
  // <deckId, winCount>
  deckWins: Record<string, number>;
};
