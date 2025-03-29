import { PropsWithChildren } from "react";

import {
  AppProvider,
  AuthProvider,
  DeckProvider,
  MatchProvider,
  ThemeProvider,
  UserProvider,
} from "@/context";

export const CombinedProvider = (props: PropsWithChildren) => (
  <AuthProvider>
    <AppProvider>
      <UserProvider>
        <ThemeProvider>
          <DeckProvider>
            <MatchProvider>{props.children}</MatchProvider>
          </DeckProvider>
        </ThemeProvider>
      </UserProvider>
    </AppProvider>
  </AuthProvider>
);
