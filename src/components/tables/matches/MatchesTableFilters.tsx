import { DeckSelector, FormatSelector, PlayerSelector } from "@/components";
import { Box, Grid, Popover } from "@mui/material";

interface MatchesTableFiltersProps {
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
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
  filterFormat,
  setFilterFormat,
  filterDecks,
  setFilterDecks,
  filterUsers,
  setFilterUsers,
}: MatchesTableFiltersProps) => {
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
            <FormatSelector
              filterFormat={filterFormat}
              setFilterFormat={setFilterFormat}
            />
          </Grid>
          <Grid item xs={12}>
            <DeckSelector
              filterFormat={filterFormat}
              filterDeck={filterDecks}
              setFilterDeck={setFilterDecks as (ids: string | string[]) => void}
              multi
            />
          </Grid>
          <Grid item xs={12}>
            <PlayerSelector
              filterUser={filterUsers}
              setFilterUser={setFilterUsers as (ids: string | string[]) => void}
              multi
            />
          </Grid>
        </Grid>
      </Box>
    </Popover>
  );
};
