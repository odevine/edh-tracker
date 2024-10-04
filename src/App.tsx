import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Box, Stack, Typography } from "@mui/material";
import { Amplify } from "aws-amplify";
import { Redirect, useRoutes } from "raviger";

import { AppAlertList, LoadingBackdrop, Toolbar } from "@/Components";
import { useApp, useDeck, useMatch, useUser } from "@/Context";
import {
  DecksPage,
  LandingPage,
  MatchesPage,
  Profile,
  ToolsPage,
  UsersPage,
} from "@/Pages";
import awsmobile from "./aws-exports";

Amplify.configure(awsmobile);

const NotFoundPage = () => (
  <Stack sx={{ height: "100%" }} justifyContent="center" alignItems="center">
    <Typography variant="h1">404</Typography>
    <Typography variant="h5">couldn't find what you're looking for</Typography>
  </Stack>
);

const baseRoutes = {
  "/": () => <LandingPage />,
  "/*": () => <ProtectedRoutes />,
  "*": () => <NotFoundPage />,
};

const protectedRoutes = {
  "/login": () => <Redirect to="/users" />,
  "/tools": () => <ToolsPage />,
  "/decks": () => <DecksPage />,
  "/users": () => <UsersPage />,
  "/matches": () => <MatchesPage />,
  "/users/:profileId": (routeParams: { profileId: string }) => (
    <Profile profileId={routeParams.profileId} />
  ),
  "*": () => <NotFoundPage />,
};

const ProtectedRoutes = () => (
  <Authenticator hideSignUp>{useRoutes(protectedRoutes)}</Authenticator>
);

export const App = () => {
  const { appMessages, deleteAppMessage } = useApp();
  const { usersLoading } = useUser();
  const { matchesLoading } = useMatch();
  const { decksLoading } = useDeck();
  const routeResult = useRoutes(baseRoutes);

  const showLoading = usersLoading || matchesLoading || decksLoading;

  return (
    <>
      <Toolbar />
      <Box
        sx={{
          height: "calc(100% - 64px)",
          overflowY: "auto",
          scrollbarGutter: 8,
        }}
      >
        {routeResult || <h1>404 Not Found</h1>}
      </Box>
      {showLoading && <LoadingBackdrop />}
      <AppAlertList messages={appMessages} onDelete={deleteAppMessage} />
    </>
  );
};
