// buildFilterDescriptions.ts
import { Format, User } from "@/types";
import { getFullColorNames } from "@/utils";

export function buildDeckFilterDescription({
  filterUser,
  filterFormat,
  filterColor,
  includeInactive,
  includeUnranked,
  allUsers,
  allFormats,
}: {
  filterUser: string;
  filterFormat: string;
  filterColor: string[];
  includeInactive: boolean;
  includeUnranked: boolean;
  allUsers: User[];
  allFormats: Format[];
}) {
  const clauses: string[] = ["showing"];

  clauses.push(includeInactive ? "all" : "active");

  if (filterFormat) {
    const format = allFormats.find((f) => f.id === filterFormat);
    if (format) clauses.push(`"${format.displayName}"`);
  }

  clauses.push("decks");

  if (filterUser) {
    const user = allUsers.find((u) => u.id === filterUser);
    if (user) clauses.push(`owned by ${user.displayName}`);
  }

  if (filterColor.length > 0) {
    clauses.push(
      filterColor.includes("C") && filterColor.length === 1
        ? "that are colorless"
        : `that are ${getFullColorNames(filterColor)}`,
    );
  }

  if (includeUnranked) {
    clauses.push("while including unranked matches in stats");
  }

  return clauses.join(" ");
}

export function buildMatchFilterDescription({
  filterFormat,
  filterDecks,
  filterUsers,
  allFormats,
}: {
  filterFormat: string;
  filterDecks: string[];
  filterUsers: string[];
  allFormats: Format[];
}) {
  const clauses: string[] = ["showing matches"];

  if (filterFormat) {
    const format = allFormats.find((f) => f.id === filterFormat);
    if (format) clauses.push(`in format "${format.displayName}"`);
  }

  if (filterDecks.length > 0) {
    clauses.push("filtered by selected decks");
  }

  if (filterUsers.length > 0) {
    clauses.push("filtered by selected users");
  }

  return clauses.join(" ");
}

export function buildUserFilterDescription({
  filterFormat,
  includeUnranked,
  activeRecentOnly,
  allFormats,
}: {
  filterFormat: string;
  includeUnranked: boolean;
  activeRecentOnly: boolean;
  allFormats: Format[];
}) {
  const format = allFormats.find((f) => f.id === filterFormat)?.displayName;
  const clauses = ["showing stats for users"];

  if (activeRecentOnly) {
    clauses.push("active in the last 60 days");
  }

  if (format) {
    clauses.push(`for the format "${format}"`);
  } else if (includeUnranked) {
    clauses.push("(including unranked matches)");
  }

  return clauses.join(" ");
}
