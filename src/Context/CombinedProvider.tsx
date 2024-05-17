import { PropsWithChildren } from "react";

import {
  AppProvider,
  DecksProvider,
  MatchesProvider,
  ThemeProvider,
  UserProvider,
} from "@/Context";

export const CombinedProvider = (props: PropsWithChildren) => {
  return (
    <AppProvider>
      <UserProvider>
        <ThemeProvider>
          <MatchesProvider>
            <DecksProvider>{props.children}</DecksProvider>
          </MatchesProvider>
        </ThemeProvider>
      </UserProvider>
    </AppProvider>
  );
};
