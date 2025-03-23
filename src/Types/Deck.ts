export interface Deck {
  id: string;
  deckOwnerId: string; // should be userId in the new table
  deckType: string; // should be "formatId" in the new table
  deckName: string;
  commanderName: string;
  commanderColors?: string[];
  secondCommanderName?: string;
  secondCommanderColors?: (string | null)[];
  link?: string;
  cost?: number;
  isInactive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateDeckInput = Omit<Deck, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export type UpdateDeckInput = Partial<Omit<Deck, "createdAt" | "updatedAt">> & {
  id: string;
};
