import { usePersistentState } from "./usePersistentState";

export const useDecksFilters = () => {
  const [filterColor, setFilterColor] = usePersistentState<string[]>(
    "decks_filter_color",
    [],
  );
  const [filterFormat, setFilterFormat] = usePersistentState<string>(
    "decks_filter_format",
    "",
  );
  const [filterUser, setFilterUser] = usePersistentState<string>(
    "decks_filter_user",
    "",
  );
  const [includeInactive, setIncludeInactive] = usePersistentState<boolean>(
    "decks_include_inactive",
    false,
  );
  const [includeUnranked, setIncludeUnranked] = usePersistentState<boolean>(
    "decks_include_unranked",
    false,
  );

  const resetDeckFilters = () => {
    setFilterColor([]);
    setFilterFormat("");
    setFilterUser("");
    setIncludeInactive(false);
    setIncludeUnranked(false);
  } 

  return {
    filterColor,
    setFilterColor,
    filterFormat,
    setFilterFormat,
    filterUser,
    setFilterUser,
    includeInactive,
    setIncludeInactive,
    includeUnranked,
    setIncludeUnranked,
    resetDeckFilters,
  };
};
