import { PropsWithChildren } from "react";

import {
  AppProvider,
  DecksProvider,
  ThemeProvider,
  UserProvider,
} from "@/Context";

export const CombinedProvider = (props: PropsWithChildren) => {
  return (
    <AppProvider>
      <UserProvider>
        <ThemeProvider>
          <DecksProvider>{props.children}</DecksProvider>
        </ThemeProvider>
      </UserProvider>
    </AppProvider>
  );
};
