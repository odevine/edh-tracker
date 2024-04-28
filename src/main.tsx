import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";

import { App } from "./App";

import { ThemeProvider } from "@/Context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    </ThemeProvider>
  </StrictMode>,
);
