import { usePersistentState } from "@/hooks";

export const useMatchesFilters = () => {
  const [filterFormat, setFilterFormat] = usePersistentState<string>(
    "matches_filter_format",
    "",
  );

  const [filterDecks, setFilterDecks] = usePersistentState<string[]>(
    "matches_filter_decks",
    [],
  );

  const [filterUsers, setFilterUsers] = usePersistentState<string[]>(
    "matches_filter_users",
    [],
  );

  return {
    filterFormat,
    setFilterFormat,
    filterDecks,
    setFilterDecks,
    filterUsers,
    setFilterUsers,
  };
};
