import { usePersistentState } from "@/hooks";

export const useMatchesFilters = () => {
  const [filterDecks, setFilterDecks] = usePersistentState<string[]>(
    "matches_filter_decks",
    [],
  );

  const [filterFormat, setFilterFormat] = usePersistentState<string>(
    "matches_filter_format",
    "",
  );

  const [filterUsers, setFilterUsers] = usePersistentState<string[]>(
    "matches_filter_users",
    [],
  );

  const resetMatchFilters = () => {
    setFilterDecks([]);
    setFilterFormat("");
    setFilterUsers([]);
  }

  return {
    filterFormat,
    setFilterFormat,
    filterDecks,
    setFilterDecks,
    filterUsers,
    setFilterUsers,
    resetMatchFilters,
  };
};
