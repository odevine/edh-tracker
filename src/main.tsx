import { Authenticator } from "@aws-amplify/ui-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

import { CombinedProvider } from "@/Context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Authenticator.Provider>
      <CombinedProvider>
        <App />
      </CombinedProvider>
    </Authenticator.Provider>
  </StrictMode>,
);
