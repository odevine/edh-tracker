import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Modal,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import {
  LoadingBackdrop,
  UserChartsContainer,
  UserProfileForm,
} from "@/components";
import {
  useAuth,
  useDeck,
  useFormat,
  useMatch,
  useTheme,
  useUser,
} from "@/hooks";
import {
  dateTimeFormatter,
  getNemesisLabel,
  getRivalryLabel,
  getUserStats,
  getVictimLabel,
  percentFormatter,
} from "@/utils";

const StatRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <Stack direction="row" justifyContent="space-between" width="100%">
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={500}>{value}</Typography>
  </Stack>
);

export const Profile = ({ profileId }: { profileId: string }) => {
  const { userId } = useAuth();
  const { allUsers, usersLoading } = useUser();
  const { allDecks } = useDeck();
  const { allFormats } = useFormat();
  const { allMatches } = useMatch();
  const { mode } = useTheme();

  const [editOpen, setEditOpen] = useState(false);
  const [includeUnranked, setIncludeUnranked] = useState(false);

  const currentProfile = allUsers.find((u) => u.id === profileId);

  if (!currentProfile) {
    return null;
  }

  const ownUser = profileId === userId;

  const userColor =
    mode === "light"
      ? currentProfile?.lightThemeColor
      : currentProfile?.darkThemeColor;

  const userStats = useMemo(
    () =>
      getUserStats(profileId, includeUnranked, {
        allDecks,
        allFormats,
        allMatches,
        allUsers,
      }),
    [allDecks, allFormats, allUsers, allMatches, includeUnranked],
  );
  const userDecks = useMemo(
    () => allDecks.filter((deck) => deck.userId === currentProfile.id),
    [allDecks],
  );

  return (
    <>
      {usersLoading && <LoadingBackdrop />}
      <Container>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="stretch"
          spacing={3}
        >
          {/* profile card */}
          <Card
            sx={{
              minWidth: 300,
              flex: ownUser ? "0 0 35%" : "1",
            }}
          >
            <CardContent sx={{ height: "100%" }}>
              <Stack spacing={2} alignItems="center" sx={{ height: "100%" }}>
                <Avatar
                  sx={{ height: 120, width: 120 }}
                  src={currentProfile.profilePictureURL ?? ""}
                />
                <Typography
                  variant="h5"
                  sx={{ color: userColor ?? "inherit", fontWeight: 600 }}
                >
                  {currentProfile.displayName}
                </Typography>

                {ownUser && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setEditOpen(true)}
                  >
                    edit profile
                  </Button>
                )}

                <Divider sx={{ width: "100%", my: 1 }} />

                <Stack
                  spacing={1}
                  sx={{ width: "100%", height: "100%" }}
                  justifyContent="center"
                >
                  <StatRow
                    label="account created"
                    value={dateTimeFormatter.format(
                      new Date(currentProfile.createdAt),
                    )}
                  />
                  {currentProfile.lastOnline && (
                    <StatRow
                      label="last online"
                      value={dateTimeFormatter.format(
                        new Date(currentProfile.lastOnline),
                      )}
                    />
                  )}
                  <StatRow label="wins" value={userStats.totalWins} />
                  <StatRow
                    label="matches played"
                    value={userStats.totalMatches}
                  />
                  <StatRow
                    label="win rate"
                    value={`${(userStats.winRate * 100).toFixed(1)}%`}
                  />
                  <StatRow label="deck count" value={userStats.deckCount} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* enhanced stats card */}
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ height: "100%" }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h4">stats</Typography>
                <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
                  <Typography component="span" variant="caption">
                    include unranked
                  </Typography>
                  <Switch
                    checked={includeUnranked}
                    onChange={(event) =>
                      setIncludeUnranked(event.target.checked)
                    }
                  />
                </Stack>
              </Stack>
              <Stack
                spacing={1}
                sx={{ height: "100%" }}
                justifyContent="center"
              >
                {userStats.bestDecks && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      most successful deck
                      {userStats.bestDecks.decks.length > 1 ? "" : ""} (&gt;5
                      matches)
                    </Typography>
                    <Typography fontWeight={500}>
                      {`${userStats.bestDecks.decks.map((d) => `${d.displayName} - (${d.gamesPlayed} matches)`).join("\n")} (${percentFormatter.format(userStats.bestDecks.winRate)} win rate)`}
                    </Typography>
                  </Box>
                )}
                {userStats.mostPlayedDecks && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      most played deck
                      {userStats.mostPlayedDecks.displayNames.length > 1
                        ? "s"
                        : ""}
                    </Typography>
                    <Typography fontWeight={500}>
                      {`${userStats.mostPlayedDecks.displayNames.join(", ")} (${userStats.mostPlayedDecks.gamesPlayed} games)`}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                {userStats.bestFormats && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      best format
                      {userStats.bestFormats.formats.length > 1 ? "" : ""}{" "}
                      (&gt;5 matches)
                    </Typography>
                    <Typography fontWeight={500}>
                      {`${userStats.bestFormats.formats.map((f) => `${f.displayName} - (${f.gamesPlayed} matches)`)} (${percentFormatter.format(userStats.bestFormats.winRate)} win rate)`}
                    </Typography>
                  </Box>
                )}
                {userStats.mostPlayedFormats && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      most played format
                      {userStats.mostPlayedFormats.displayNames.length > 1
                        ? "s"
                        : ""}
                    </Typography>
                    <Typography fontWeight={500}>
                      {`${userStats.mostPlayedFormats.displayNames.join(", ")} (${userStats.mostPlayedFormats.gamesPlayed} games)`}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                {userStats.victim && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {getVictimLabel(
                        userStats.victim.wins,
                        userStats.victim.displayNames.length > 1,
                      )}
                    </Typography>
                    <Typography fontWeight={500}>
                      {`${userStats.victim.displayNames.join(", ")} (${userStats.victim.wins} wins)`}
                    </Typography>
                  </Box>
                )}
                {userStats.nemesis && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {getNemesisLabel(
                        userStats.nemesis.losses,
                        userStats.nemesis.displayNames.length > 1,
                      )}
                    </Typography>
                    <Typography fontWeight={500}>
                      {`${userStats.nemesis.displayNames.join(", ")} (${userStats.nemesis.losses} losses)`}
                    </Typography>
                  </Box>
                )}
                {userStats.rivalry && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {getRivalryLabel(
                        userStats.rivalry.wins,
                        userStats.rivalry.losses,
                        userStats.rivalry.displayNames.length > 1,
                      )}
                    </Typography>
                    <Typography fontWeight={500}>
                      {`${userStats.rivalry.displayNames.join(", ")} (${userStats.rivalry.wins} wins and ${userStats.rivalry.losses} losses)`}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        {/* deck format charts */}
        {userDecks.length > 0 && <UserChartsContainer userDecks={userDecks} />}
      </Container>

      {/* profile edit modal */}
      {ownUser && (
        <Modal open={editOpen} onClose={() => setEditOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              minWidth: { xs: 310, sm: 420 },
              maxWidth: "90vw",
              outline: "none",
            }}
          >
            <Typography variant="h6" gutterBottom>
              edit profile
            </Typography>
            <UserProfileForm />
          </Box>
        </Modal>
      )}
    </>
  );
};
