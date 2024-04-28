import { useRoutes, Redirect } from "raviger";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import config from "./aws-exports";
import { HomePage, ProtectedPage } from "@/Pages";
import { Toolbar } from "@/Components";

Amplify.configure(config);

const baseRoutes = {
  "/": () => <HomePage />,
  "/*": () => <ProtectedRoutes />,
};

const protectedRoutes = {
  "/login": () => <Redirect to="/" />,
  "/protected": () => <ProtectedPage />,
};



const ProtectedRoutes = () => {
  const routeResult = useRoutes(protectedRoutes);

  return (
    <Authenticator hideSignUp>
      {routeResult}
    </Authenticator>
  );
};

export const App = () => {
  const routeResult = useRoutes(baseRoutes);

  return (
    <>
      <Toolbar />
      {routeResult || <h1>404 Not Found</h1>}
    </>
  );
}
