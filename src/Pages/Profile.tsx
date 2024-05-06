import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { GradientChip } from "@/Components";

const testDecks = [
  {
    deckName: "Royale with Marcheese",
    deckType: "constructed",
    commanderName: "Kozilek, the Great Distortion",
    commanderColors: [],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "Royale with Marcheese",
    deckType: "constructed",
    commanderName: "Mikaeus, the Unhallowed",
    commanderColors: ["B"],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "Royale with Marcheese",
    deckType: "constructed",
    commanderName: "Obuun, Mul Daya Ancestor",
    commanderColors: ["W", "R", "G"],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "Royale with Marcheese",
    deckType: "constructed",
    commanderName: "Thassa, Deep-Dwelling",
    commanderColors: ["U"],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "Royale with Marcheese",
    deckType: "constructed",
    commanderName: "Sliver Gravemother",
    commanderColors: ["W", "U", "B", "R", "G"],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "Royale with Marcheese",
    deckType: "constructed",
    commanderName: "Sergeant John Benton",
    commanderColors: ["W", "G"],
    cost: 299.69,
    link: "",
  },
  {
    deckName: "Royale with Marcheese",
    deckType: "constructed",
    commanderName: "Eight-and-a-Half-Tails",
    commanderColors: ["W"],
    cost: 299.69,
    link: "",
  },
];

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
  const { user } = useAuthenticator((context) => [context.user]);
  const STACK_SPACING = 3;
  return (
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
                <Typography>{user.username}</Typography>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ flexGrow: 3 }}>
            <CardHeader title="profile" />
            <Divider />
            <CardContent>
              <Stack spacing={STACK_SPACING}>
                <TextField label="display name" />
                <TextField label="theme color" />
              </Stack>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button variant="contained">update profile</Button>
            </CardActions>
          </Card>
        </Stack>
        <Card>
          <CardHeader title="your decks" />
          <Divider />
          <CardContent>
            <Stack spacing={STACK_SPACING}>
              {testDecks.map((deck) => (
                <DeckEntry deck={deck} />
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
  );
};
