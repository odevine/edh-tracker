import {
  Box,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { UserDecksByFormatChart, UserFormatsChart } from "@/components";
import { Deck, Format } from "@/types";

interface Props {
  userDecks: Deck[];
  allFormats: Format[];
}

export const UserChartsContainer = ({ userDecks, allFormats }: Props) => {
  const formatIdsWithDecks = useMemo(() => {
    const formatIds = new Set<string>();
    for (const deck of userDecks) {
      for (const formatId of Object.keys(deck.formatStats ?? {})) {
        if ((deck.formatStats?.[formatId]?.gamesPlayed ?? 0) > 0) {
          formatIds.add(formatId);
        }
      }
    }
    return [...formatIds];
  }, [userDecks]);

  const [selectedFormatId, setSelectedFormatId] = useState(
    formatIdsWithDecks[0] ?? "",
  );

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ mt: 4 }}>
      <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CardHeader
          title={<Typography variant="h6">format participation</Typography>}
        />
        <CardContent sx={{ flex: 1 }}>
          <UserFormatsChart userDecks={userDecks} allFormats={allFormats} />
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CardHeader
          title={
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">decks by format</Typography>
              <Box>
                <Select
                  value={selectedFormatId}
                  onChange={(e) => setSelectedFormatId(e.target.value)}
                  size="small"
                >
                  {formatIdsWithDecks.map((id) => {
                    const formatName =
                      allFormats.find((f) => f.id === id)?.displayName ?? id;
                    return (
                      <MenuItem key={id} value={id}>
                        {formatName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>
            </Stack>
          }
        />
        <CardContent sx={{ flex: 1 }}>
          <UserDecksByFormatChart
            userDecks={userDecks}
            selectedFormatId={selectedFormatId}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};
