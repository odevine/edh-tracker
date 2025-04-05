import { Box, Grid, Popover, Stack, Switch, Typography } from "@mui/material";

import { ColorSelector, FormatSelector, PlayerSelector } from "@/components";

interface DecksTableFiltersProps {
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
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
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      sx={{ mt: "80px", width: 500 }}
    >
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ColorSelector
              filterColor={filterColor}
              setFilterColor={setFilterColor}
            />
          </Grid>
          <Grid item xs={12}>
            <FormatSelector
              filterFormat={filterFormat}
              setFilterFormat={setFilterFormat}
            />
          </Grid>
          <Grid item xs={12}>
            <PlayerSelector
              filterUser={filterUser}
              setFilterUser={setFilterUser}
              multi={false}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center">
              <Switch
                checked={includeInactive}
                onChange={(event) => setIncludeInactive(event.target.checked)}
              />
              <Typography component="span">include inactive decks?</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center">
              <Switch
                checked={includeUnranked}
                onChange={(event) => setIncludeUnranked(event.target.checked)}
              />
              <Typography component="span">
                include unranked matches in stats?
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Popover>
  );
};
