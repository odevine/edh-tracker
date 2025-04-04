import { FormatSelector } from "@/components";
import { Box, Grid, Popover, Stack, Switch, Typography } from "@mui/material";

interface UsersTableFiltersProps {
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
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
  filterFormat,
  setFilterFormat,
  includeUnranked,
  setIncludeUnranked,
  activeRecentOnly,
  setActiveRecentOnly,
}: UsersTableFiltersProps) => {
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
            <Stack direction="row" alignItems="center">
              <Switch
                checked={includeUnranked}
                onChange={(event) => setIncludeUnranked(event.target.checked)}
              />
              <Typography component="span">
                include unranked matches in stats?
              </Typography>
            </Stack>
            <Switch
              checked={activeRecentOnly}
              onChange={(e) => setActiveRecentOnly(e.target.checked)}
            />
            <Typography component="span">
              only show users active in last 60 days?
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Popover>
  );
};
