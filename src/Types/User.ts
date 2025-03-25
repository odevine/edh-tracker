import type { FormatStats } from "@/Types";

export interface User {
  id: string;
  displayName: string;
  formatStats: FormatStats;
  description?: string;
  lightThemeColor?: string;
  darkThemeColor?: string;
  profilePictureURL?: string;
  lastOnline?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export type UpdateUserInput = Partial<Omit<User, "createdAt" | "updatedAt">> & {
  id: string;
};
