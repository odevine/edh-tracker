import { PropsWithChildren } from "react";

import {
  AppProvider,
  AuthProvider,
  DeckProvider,
  FormatProvider,
  MatchProvider,
  ThemeProvider,
  UserProvider,
} from "@/context";

export const CombinedProvider = (props: PropsWithChildren) => (
  <AuthProvider>
    <AppProvider>
      <UserProvider>
        <ThemeProvider>
          <FormatProvider>
            <DeckProvider>
              <MatchProvider>{props.children}</MatchProvider>
            </DeckProvider>
          </FormatProvider>
        </ThemeProvider>
      </UserProvider>
    </AppProvider>
  </AuthProvider>
);
