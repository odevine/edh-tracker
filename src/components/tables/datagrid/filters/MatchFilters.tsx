import {
  DeckSelector,
  FilterPopoverWrapper,
  FormatSelector,
  PlayerSelector,
} from "@/components";

interface MatchesTableFiltersProps {
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  resetMatchFilters: () => void;
  filterFormat: string;
  setFilterFormat: (newFormat: string) => void;
  filterDecks: string[];
  setFilterDecks: (newDecks: string[]) => void;
  filterUsers: string[];
  setFilterUsers: (newUsers: string[]) => void;
}

export const MatchesTableFilters = ({
  anchorEl,
  onClose,
  resetMatchFilters,
  filterFormat,
  setFilterFormat,
  filterDecks,
  setFilterDecks,
  filterUsers,
  setFilterUsers,
}: MatchesTableFiltersProps) => {
  return (
    <FilterPopoverWrapper
      anchorEl={anchorEl}
      onClose={onClose}
      handleResetFilters={resetMatchFilters}
    >
      <FormatSelector
        filterFormat={filterFormat}
        setFilterFormat={setFilterFormat}
      />
      <DeckSelector
        filterFormat={filterFormat}
        filterDeck={filterDecks}
        setFilterDeck={setFilterDecks as (ids: string | string[]) => void}
        multi
      />
      <PlayerSelector
        filterUser={filterUsers}
        setFilterUser={setFilterUsers as (ids: string | string[]) => void}
        multi
      />
    </FilterPopoverWrapper>
  );
};
