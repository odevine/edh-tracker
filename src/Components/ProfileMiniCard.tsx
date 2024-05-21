import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DateTime } from "luxon";
import { navigate } from "raviger";

import { User } from "@/API";
import { useDeck, useMatch } from "@/Context";
import { getUserStats } from "@/Logic";

interface ProfileMiniCardProps {
  profile?: User;
}

export const ProfileMiniCard: React.FC<ProfileMiniCardProps> = ({
  profile,
}) => {
  if (!profile) {
    return;
  }

  const { allDecks } = useDeck();
  const { allMatches, allMatchParticipants } = useMatch();
  const userStats = getUserStats(
    profile.id,
    allDecks,
    allMatches,
    allMatchParticipants,
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
        {profile.role && (
          <Chip variant="outlined" size="small" label={profile.role} />
        )}
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
              <Typography variant="body2">decks:</Typography>
              <Typography variant="body2">wins:</Typography>
              <Typography variant="body2">matches&nbsp;played:</Typography>
              <Typography variant="body2">overall&nbsp;winrate:</Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack spacing={1} alignItems="flex-end">
              <Typography variant="body2">{userStats.deckCount}</Typography>
              <Typography variant="body2">{userStats.totalWins}</Typography>
              <Typography variant="body2">{userStats.totalMatches}</Typography>
              <Typography variant="body2">
                {(userStats.winRate * 100).toFixed(2)}%
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button onClick={() => navigate(`/users/${profile.id}`)}>
          view profile
        </Button>
      </CardActions>
    </Card>
  );
};
