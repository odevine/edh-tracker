import {
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { DeckPodiumChart, UserPodiumChart } from "@/components";
import { useAuth, useFormat, useTheme } from "@/hooks";
import { Format } from "@/types";

interface FormatDetailPanelProps {
  format: Format | null;
}

export function FormatDetailPanel({ format }: FormatDetailPanelProps) {
  const { isAdmin } = useAuth();
  const { getFormatStats } = useFormat();
  const { muiTheme } = useTheme();
  const showFormatTitle = useMediaQuery(muiTheme.breakpoints.up("lg"));

  if (!format) {
    return (
      <Paper sx={{ p: 3, height: 600 }}>
        <Stack height="100%" justifyContent="center" alignItems="center">
          <Typography variant="body1" color="text.secondary">
            select a format to view details
          </Typography>
        </Stack>
      </Paper>
    );
  }

  const formatStats = getFormatStats(format.id);

  return (
    <Paper sx={{ p: 3, pt: 2, borderRadius: "10px" }}>
      <Stack
        direction="row"
        justifyContent={showFormatTitle ? "space-between" : "flex-end"}
        alignItems="center"
      >
        {showFormatTitle && (
          <Typography variant="h4">{format.displayName}</Typography>
        )}
        {isAdmin && <Button variant="contained">edit format</Button>}
      </Stack>
      <Typography paragraph sx={{ mt: 1 }}>
        {format.description}
      </Typography>
      <Divider />
      {formatStats.totalMatches === 0 && (
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          no matches have been played in this format yet
        </Typography>
      )}
      {formatStats.totalMatches > 0 && (
        <>
          <Stack spacing={2} mt={4}>
            <Typography>
              total matches played: <strong>{formatStats.totalMatches}</strong>
            </Typography>
            <Typography>
              unique players: <strong>{formatStats.uniqueUsers}</strong>
            </Typography>
            <Typography>
              unique decks: <strong>{formatStats.uniqueDecks}</strong>
            </Typography>
          </Stack>
          <Stack mt={4} direction="row">
            <UserPodiumChart userWins={formatStats.userWins} flex={1} />
            <DeckPodiumChart deckWins={formatStats.deckWins} flex={1} />
          </Stack>
        </>
      )}
    </Paper>
  );
}
