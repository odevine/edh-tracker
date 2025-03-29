import type { FormatStats } from "@/types";

export interface Deck {
  id: string;
  userId: string;
  formatId: string;
  displayName: string;
  formatStats: FormatStats;
  commanderName: string;
  commanderColors?: string[];
  secondCommanderName?: string;
  secondCommanderColors?: (string | null)[];
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
