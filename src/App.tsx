import { Box, Stack, Typography } from "@mui/material";
import { useRoutes } from "raviger";

import {
  AppAlertList,
  DecksPage,
  FormatsPage,
  LandingPage,
  LoadingBackdrop,
  LoginPage,
  MatchesPage,
  Profile,
  RequireAuth,
  Toolbar,
  UsersPage,
} from "@/components";
import { useApp, useDeck, useMatch, useUser } from "@/hooks";

const NotFoundPage = () => (
  <Stack sx={{ height: "100%" }} justifyContent="center" alignItems="center">
    <Typography variant="h1">404</Typography>
    <Typography variant="h5">couldn't find what you're looking for</Typography>
  </Stack>
);

const baseRoutes = {
  "/": () => <LandingPage />,
  "/login": () => <LoginPage />,
  "/*": () => <ProtectedRoutes />,
  "*": () => <NotFoundPage />,
};

const protectedRoutes = {
  "/formats": () => <FormatsPage />,
  "/decks": () => <DecksPage />,
  "/users": () => <UsersPage />,
  "/matches": () => <MatchesPage />,
  "/users/:profileId": (routeParams: { profileId: string }) => (
    <Profile profileId={routeParams.profileId} />
  ),
  "*": () => <NotFoundPage />,
};

const ProtectedRoutes = () => (
  <RequireAuth>{useRoutes(protectedRoutes)}</RequireAuth>
);

export const App = () => {
  const { appMessages, deleteAppMessage } = useApp();
  const { usersLoading } = useUser();
  const { matchesLoading } = useMatch();
  const { decksLoading } = useDeck();
  const routeResult = useRoutes(baseRoutes);

  const showLoading = usersLoading || matchesLoading || decksLoading;

  return (
    <Stack flexDirection="column" height="100vh" overflow="hidden">
      <Toolbar />
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          scrollbarGutter: "stable",
          p: 3,
        }}
      >
        {routeResult ?? <h1>404 Not Found</h1>}
      </Box>
      {showLoading && <LoadingBackdrop />}
      <AppAlertList messages={appMessages} onDelete={deleteAppMessage} />
    </Stack>
  );
};
