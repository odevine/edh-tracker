import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { usePath, useRoutes } from "raviger";

import {
  AppAlertList,
  DecksPage,
  FormatsPage,
  LandingPage,
  LoadingBackdrop,
  LoginPage,
  MatchesPage,
  NavToolbar,
  ProfilePage,
  RequireAuth,
  UsersPage,
} from "@/components";
import { useApp, useDeck, useMatch, useUser } from "@/hooks";

const NotFoundPage = () => (
  <Stack sx={{ height: "100%" }} justifyContent="center" alignItems="center">
    <Typography variant="h1">404</Typography>
    <Typography variant="h5">couldn't find what you're looking for</Typography>
  </Stack>
);

const ProfileRoute = ({ profileId }: { profileId: string }) => {
  const { allUsers, usersLoading } = useUser();

  if (usersLoading) {
    return <LoadingBackdrop />;
  }

  const exists = allUsers.some((u) => u.id === profileId);

  if (!exists) {
    return (
      <Stack
        sx={{ height: "100%" }}
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h1">404</Typography>
        <Typography variant="h5">user not found</Typography>
      </Stack>
    );
  }

  return <ProfilePage profileId={profileId} />;
};

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
  "/users/:profileId": ({ profileId }: { profileId: string }) => (
    <ProfileRoute profileId={profileId} />
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

  const isLandingPage = usePath() === "/";

  const showLoading = usersLoading || matchesLoading || decksLoading;

  return (
    <>
      <Stack
        flexDirection="column"
        height={isLandingPage ? "calc(100vh - 36px)" : "100vh"}
        overflow="hidden"
      >
        <NavToolbar />
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
      {isLandingPage && (
        <Box sx={{ bgcolor: "background.paper", py: 1 }}>
          <Container maxWidth="xl">
            <Typography variant="body2" align="center">
              © {new Date().getFullYear()} odevine | licensed under the{" "}
              <Link
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noopener"
              >
                MIT License
              </Link>
            </Typography>
          </Container>
        </Box>
      )}
    </>
  );
};
