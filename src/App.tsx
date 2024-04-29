import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Box } from "@mui/material";
import { Amplify } from "aws-amplify";
import { Redirect, useRoutes } from "raviger";

import { Toolbar } from "@/Components";
import { Decks, Home, Matches, Profile } from "@/Pages";
import config from "./aws-exports";

Amplify.configure(config);

const baseRoutes = {
  "/": () => <Home />,
  "/*": () => <ProtectedRoutes />,
};

const protectedRoutes = {
  "/login": () => <Redirect to="/" />,
  "/decks": () => <Decks />,
  "/matches": () => <Matches />,
  "/profile": () => <Profile />,
};

const ProtectedRoutes = () => (
  <Authenticator hideSignUp>{useRoutes(protectedRoutes)}</Authenticator>
);

export const App = () => {
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
    </>
  );
};
