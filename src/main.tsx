import { Authenticator } from "@aws-amplify/ui-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

import { ThemeProvider, UserProvider } from "@/Context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Authenticator.Provider>
        <UserProvider>
          <App />
        </UserProvider>
      </Authenticator.Provider>
    </ThemeProvider>
  </StrictMode>,
);
