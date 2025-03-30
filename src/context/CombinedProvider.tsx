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

const providers = [
  AuthProvider,
  AppProvider,
  UserProvider,
  ThemeProvider,
  FormatProvider,
  DeckProvider,
  MatchProvider,
];

export const CombinedProvider = ({ children }: PropsWithChildren<{}>) => (
  <>
    {providers.reduceRight((acc, Provider) => {
      return <Provider>{acc}</Provider>;
    }, children)}
  </>
);
