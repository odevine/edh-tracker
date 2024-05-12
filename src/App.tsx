import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Box, Stack, Typography } from "@mui/material";
import { Amplify } from "aws-amplify";
import { Redirect, useRoutes } from "raviger";

import { AppAlertList, Toolbar } from "@/Components";
import { useApp } from "@/Context";
import { DecksPage, HomePage, MatchesPage, Profile } from "@/Pages";
import config from "./aws-exports";

Amplify.configure(config);

const NotFoundPage = () => (
  <Stack sx={{ height: "100%" }} justifyContent="center" alignItems="center">
    <Typography variant="h1">404</Typography>
    <Typography variant="h5">couldn't find what you're looking for</Typography>
  </Stack>
);

const baseRoutes = {
  "/": () => <HomePage />,
  "/*": () => <ProtectedRoutes />,
  "*": () => <NotFoundPage />,
};

const protectedRoutes = {
  "/login": () => <Redirect to="/" />,
  "/decks": () => <DecksPage />,
  "/matches": () => <MatchesPage />,
  "/profile/:profileId": (routeParams: { profileId: string }) => (
    <Profile profileId={routeParams.profileId} />
  ),
  "*": () => <NotFoundPage />,
};

const ProtectedRoutes = () => (
  <Authenticator hideSignUp>{useRoutes(protectedRoutes)}</Authenticator>
);

export const App = () => {
  const { appMessages, deleteAppMessage } = useApp();
  const routeResult = useRoutes(baseRoutes);

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
      <AppAlertList messages={appMessages} onDelete={deleteAppMessage} />
    </>
  );
};
