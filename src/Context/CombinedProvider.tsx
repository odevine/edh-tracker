import { PropsWithChildren } from "react";

import { DecksProvider, ThemeProvider, UserProvider } from "@/Context";

export const CombinedProvider = (props: PropsWithChildren) => {
  return (
    <ThemeProvider>
      <UserProvider>
        <DecksProvider>{props.children}</DecksProvider>
      </UserProvider>
    </ThemeProvider>
  );
};
