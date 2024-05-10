import { PropsWithChildren } from "react";

import { DecksProvider, ThemeProvider, UserProvider } from "@/Context";

export const CombinedProvider = (props: PropsWithChildren) => {
  return (
    <UserProvider>
      <ThemeProvider>
        <DecksProvider>{props.children}</DecksProvider>
      </ThemeProvider>
    </UserProvider>
  );
};
