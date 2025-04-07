import { Stack, Switch, Typography } from "@mui/material";

import { FilterPopoverWrapper, FormatSelector } from "@/components";

interface UsersTableFiltersProps {
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  resetUserFilters: () => void;
  filterFormat: string;
  setFilterFormat: (newFormat: string) => void;
  includeUnranked: boolean;
  setIncludeUnranked: (checked: boolean) => void;
  activeRecentOnly: boolean;
  setActiveRecentOnly: (activeOnly: boolean) => void;
}

export const UsersTableFilters = ({
  anchorEl,
  onClose,
  resetUserFilters,
  filterFormat,
  setFilterFormat,
  includeUnranked,
  setIncludeUnranked,
  activeRecentOnly,
  setActiveRecentOnly,
}: UsersTableFiltersProps) => {
  return (
    <FilterPopoverWrapper
      anchorEl={anchorEl}
      onClose={onClose}
      handleResetFilters={resetUserFilters}
    >
      <FormatSelector
        filterFormat={filterFormat}
        setFilterFormat={setFilterFormat}
      />
      <Stack direction="row" alignItems="center">
        <Switch
          checked={includeUnranked}
          onChange={(event) => setIncludeUnranked(event.target.checked)}
        />
        <Typography component="span">
          include unranked matches in stats?
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Switch
          checked={activeRecentOnly}
          onChange={(e) => setActiveRecentOnly(e.target.checked)}
        />
        <Typography component="span">
          only show users active in last 60 days?
        </Typography>
      </Stack>
    </FilterPopoverWrapper>
  );
};
