import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DateTime } from "luxon";
import { navigate } from "raviger";

import { useDeck } from "@/hooks";
import { User } from "@/types";
import { percentFormatter } from "@/utils";

interface ProfileMiniCardProps {
  profile: User;
  showActions?: boolean;
}

export const ProfileMiniCard: React.FC<ProfileMiniCardProps> = ({
  profile,
  showActions,
}) => {
  const { allDecks } = useDeck();

  const deckCount = allDecks.filter(
    (deck) => deck.userId === profile.id,
  ).length;
  const totalWins = Object.values(profile?.formatStats ?? {}).reduce(
    (acc, value) => acc + value.gamesWon,
    0,
  );
  const totalMatches = Object.values(profile?.formatStats ?? {}).reduce(
    (acc, value) => acc + value.gamesPlayed,
    0,
  );
  return (
    <Card>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ px: 2, pt: 2 }}
      >
        <Avatar
          src={profile?.profilePictureURL ?? ""}
          alt={profile.displayName}
        />
        <Typography
          variant="h6"
          sx={{
            color: (theme): string =>
              (theme.palette.mode === "light"
                ? profile.lightThemeColor
                : profile.darkThemeColor) ?? theme.palette.text.primary,
          }}
        >
          {profile.displayName}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ p: 2 }}>
        <Stack sx={{ mr: 2 }}>
          <Typography variant="caption" color="text.secondary">
            joined:
          </Typography>
          {profile.lastOnline && (
            <Typography variant="caption" color="text.secondary">
              last online:
            </Typography>
          )}
        </Stack>
        <Stack alignItems="flex-end">
          <Typography variant="caption" color="text.secondary">
            {DateTime.fromISO(profile.createdAt).toLocaleString(
              DateTime.DATETIME_SHORT,
            )}
          </Typography>
          {profile.lastOnline && (
            <Typography variant="caption" color="text.secondary">
              {DateTime.fromISO(profile.lastOnline).toLocaleString(
                DateTime.DATETIME_SHORT,
              )}
            </Typography>
          )}
        </Stack>
      </Stack>
      <Divider />
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <Stack spacing={1}>
              <Typography variant="body2">active decks:</Typography>
              <Typography variant="body2">wins:</Typography>
              <Typography variant="body2">matches&nbsp;played:</Typography>
              <Typography variant="body2">overall&nbsp;winrate:</Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack spacing={1} alignItems="flex-end">
              <Typography variant="body2">{deckCount}</Typography>
              <Typography variant="body2">{totalWins}</Typography>
              <Typography variant="body2">{totalMatches}</Typography>
              <Typography variant="body2">
                {percentFormatter.format(totalWins / (totalMatches ?? 1))}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
      {showActions && (
        <>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button onClick={() => navigate(`/users/${profile.id}`)}>
              view profile
            </Button>
          </CardActions>
        </>
      )}
    </Card>
  );
};
