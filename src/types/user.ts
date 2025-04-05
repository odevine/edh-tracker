import type { FormatStats } from "@/types";

export type AuthContext = {
  userId: string;
  isAdmin: boolean;
};

export interface User {
  createdAt: string;
  updatedAt: string;
  id: string;
  displayName: string;
  formatStats: FormatStats;
  status?: string;
  lightThemeColor?: string;
  darkThemeColor?: string;
  profilePictureURL?: string;
  lastOnline?: string;
}

export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export type UpdateUserInput = Partial<
  Omit<User, "id" | "createdAt" | "updatedAt">
>;

export type UserWithStats = User & {
  totalMatches: number;
  totalWins: number;
  winRate: number;
};

type UserDeckStat = {
  displayName: string;
  gamesPlayed: number;
};

type UserFormatStat = {
  displayName: string;
  gamesPlayed: number;
};

export type UserStatsResult = {
  totalMatches: number;
  totalWins: number;
  winRate: number;
  deckCount: number;
  bestDecks?: { decks: UserDeckStat[]; winRate: number };
  mostPlayedDecks?: { displayNames: string[]; gamesPlayed: number };
  bestFormats?: { formats: UserFormatStat[]; winRate: number };
  mostPlayedFormats?: { displayNames: string[]; gamesPlayed: number };
  nemesis?: { displayNames: string[]; losses: number };
  victim?: { displayNames: string[]; wins: number };
  rivalry?: { displayNames: string[]; wins: number; losses: number };
};
