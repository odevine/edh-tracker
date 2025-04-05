import type { FormatStats } from "@/types";

export interface Deck {
  id: string;
  userId: string;
  formatId: string;
  displayName: string;
  formatStats: FormatStats;
  deckColors: string[];
  commanderName?: string;
  secondCommanderName?: string;
  link?: string;
  cost?: number;
  inactive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateDeckInput = Omit<Deck, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export type UpdateDeckInput = Partial<
  Omit<Deck, "id" | "createdAt" | "updatedAt">
>;

export type DeckWithStats = Deck & {
  totalMatches: number;
  totalWins: number;
  winRate: number;
};
