import { useRoutes, Link } from "raviger";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "./aws-exports";
import "./App.css";
import { HomePage, ProtectedPage } from "./pages";

Amplify.configure(config);

const baseRoutes = {
  "/": () => <HomePage />,
  "/*": () => <ProtectedRoutes />,
};

const protectedRoutes = {
  "/protected": () => <ProtectedPage />,
};

const ProtectedRoutes = () => {
  const routeResult = useRoutes(protectedRoutes);

  return (
    <Authenticator>
      {({ signOut }) => (
        <div>
          {routeResult || <h1>404 Not Found</h1>}
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
};

function App() {
  const routeResult = useRoutes(baseRoutes);

  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/protected">Protected</Link>
      </nav>
      {routeResult || <h1>404 Not Found</h1>}
    </div>
  );
}

export default App;
