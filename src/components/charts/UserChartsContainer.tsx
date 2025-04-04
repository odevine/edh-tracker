import { Card, CardContent, Stack } from "@mui/material";

import { UserDecksByFormatChart, UserFormatsChart } from "@/components";
import { Deck } from "@/types";

interface Props {
  userDecks: Deck[];
}

export const UserChartsContainer = ({ userDecks }: Props) => {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={3}
      sx={{ mt: 4 }}
    >
      <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: 1 }}>
          <UserFormatsChart userDecks={userDecks} />
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: 1 }}>
          <UserDecksByFormatChart userDecks={userDecks} />
        </CardContent>
      </Card>
    </Stack>
  );
};
