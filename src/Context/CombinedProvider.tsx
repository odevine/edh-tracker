import { PropsWithChildren } from "react";

import {
  AppProvider,
  DeckProvider,
  MatchProvider,
  ThemeProvider,
  UserProvider,
} from "@/Context";

export const CombinedProvider = (props: PropsWithChildren) => {
  return (
    <AppProvider>
      <UserProvider>
        <ThemeProvider>
          <DeckProvider>
            <MatchProvider>{props.children}</MatchProvider>
          </DeckProvider>
        </ThemeProvider>
      </UserProvider>
    </AppProvider>
  );
};
