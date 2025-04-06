import { usePersistentState } from "@/hooks";

export const useUsersFilters = () => {
  const [filterFormat, setFilterFormat] = usePersistentState<string>(
    "users_filter_format",
    "",
  );
  const [includeUnranked, setIncludeUnranked] = usePersistentState<boolean>(
    "users_include_unranked",
    false,
  );
  const [activeRecentOnly, setActiveRecentOnly] = usePersistentState<boolean>(
    "users_active_recent_only",
    false,
  );

  const resetUserFilters = () => {
    setFilterFormat("");
    setIncludeUnranked(false);
    setActiveRecentOnly(false);
  };

  return {
    filterFormat,
    setFilterFormat,
    includeUnranked,
    setIncludeUnranked,
    activeRecentOnly,
    setActiveRecentOnly,
    resetUserFilters,
  };
};
