import { Authenticator } from "@aws-amplify/ui-react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/App";
import { CombinedProvider } from "@/context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Authenticator.Provider>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <CombinedProvider>
          <App />
        </CombinedProvider>
      </LocalizationProvider>
    </Authenticator.Provider>
  </StrictMode>,
);
