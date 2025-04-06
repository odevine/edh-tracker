import { Stack, Switch, Typography } from "@mui/material";

import {
  ColorSelector,
  FilterPopoverWrapper,
  FormatSelector,
  PlayerSelector,
} from "@/components";

interface DecksTableFiltersProps {
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  resetDeckFilters: () => void;
  filterColor: string[];
  setFilterColor: (newColor: string[]) => void;
  filterFormat: string;
  setFilterFormat: (newType: string) => void;
  filterUser: string;
  setFilterUser: (newUser: string | string[]) => void;
  includeInactive: boolean;
  setIncludeInactive: (checked: boolean) => void;
  includeUnranked: boolean;
  setIncludeUnranked: (checked: boolean) => void;
}

export const DecksTableFilters = ({
  anchorEl,
  onClose,
  resetDeckFilters,
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
}: DecksTableFiltersProps) => {
  return (
    <FilterPopoverWrapper
      anchorEl={anchorEl}
      onClose={onClose}
      handleResetFilters={resetDeckFilters}
    >
      <ColorSelector
        filterColor={filterColor}
        setFilterColor={setFilterColor}
      />
      <FormatSelector
        filterFormat={filterFormat}
        setFilterFormat={setFilterFormat}
      />
      <PlayerSelector
        filterUser={filterUser}
        setFilterUser={setFilterUser}
        multi={false}
      />
      <Stack direction="row" alignItems="center">
        <Switch
          checked={includeInactive}
          onChange={(event) => setIncludeInactive(event.target.checked)}
        />
        <Typography component="span">include inactive decks?</Typography>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Switch
          checked={includeUnranked}
          onChange={(event) => setIncludeUnranked(event.target.checked)}
        />
        <Typography component="span">
          include unranked matches in stats?
        </Typography>
      </Stack>
    </FilterPopoverWrapper>
  );
};
