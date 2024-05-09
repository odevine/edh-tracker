import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { GradientChip, UserProfileForm } from "@/Components";
import { useUser } from "@/Context";

const testDecks = [
  {
    deckName: "test1",
    deckType: "constructed",
    commanderName: "Kozilek, the Great Distortion",
    commanderColors: [],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "test2",
    deckType: "constructed",
    commanderName: "Mikaeus, the Unhallowed",
    commanderColors: ["B"],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "test3",
    deckType: "constructed",
    commanderName: "Obuun, Mul Daya Ancestor",
    commanderColors: ["W", "R", "G"],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "test4",
    deckType: "constructed",
    commanderName: "Thassa, Deep-Dwelling",
    commanderColors: ["U"],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "test5",
    deckType: "constructed",
    commanderName: "Sliver Gravemother",
    commanderColors: ["W", "U", "B", "R", "G"],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "test6",
    deckType: "constructed",
    commanderName: "Sergeant John Benton",
    commanderColors: ["W", "G"],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "test7",
    deckType: "constructed",
    commanderName: "Eight-and-a-Half-Tails",
    commanderColors: ["W"],
    cost: 299.69,
    link: "",
  },
];

const handleProfileUpdate = () => {};

const DeckEntry = (props: { deck: any }) => {
  return (
    <Stack direction="row">
      <Box flexGrow={1}>{props.deck?.deckName}</Box>
      <Box flexGrow={1}>
        <GradientChip
          label={props.deck?.commanderName}
          colors={props.deck?.commanderColors}
        />
      </Box>
      <Box flexGrow={1}>{props.deck?.cost}</Box>
      <Box flexGrow={1}>{props.deck?.deckType}</Box>
    </Stack>
  );
};

export const Profile = (): JSX.Element => {
  const { userProfile, loading, authenticatedUser } = useUser();
  const STACK_SPACING = 3;

  if (userProfile === null || authenticatedUser === null) {
    return <Typography>User not found</Typography>;
  } else {
    return (
      <>
        {loading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        <Container sx={{ p: STACK_SPACING }}>
          <Stack spacing={STACK_SPACING}>
            <Stack direction="row" spacing={STACK_SPACING}>
              <Card sx={{ flexGrow: 1 }}>
                <CardContent sx={{ height: "100%" }}>
                  <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: "100%" }}
                  >
                    <Avatar sx={{ height: 120, width: 120 }} />
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography>{authenticatedUser?.username}</Typography>
                      <Typography variant="caption">
                        {authenticatedUser?.username !== userProfile.displayName
                          ? ` (${userProfile.displayName})`
                          : ""}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ flexGrow: 3 }}>
                <UserProfileForm />
              </Card>
            </Stack>
            <Card>
              <CardHeader title="your decks" />
              <Divider />
              <CardContent>
                <Stack spacing={STACK_SPACING}>
                  {testDecks.map((deck) => (
                    <DeckEntry key={deck.deckName} deck={deck} />
                  ))}
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button variant="contained">add deck</Button>
              </CardActions>
            </Card>
            <Card>
              <CardHeader title="change password" />
              <Divider />
              <CardContent>
                <Stack spacing={STACK_SPACING}>
                  <TextField label="password" />
                  <TextField label="confirm password" />
                </Stack>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button variant="contained">update password</Button>
              </CardActions>
            </Card>
          </Stack>
        </Container>
      </>
    );
  }
};
