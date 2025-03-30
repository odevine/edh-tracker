import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const queryClient = new QueryClient();

export const CombinedProvider = ({ children }: PropsWithChildren<{}>) => (
  <QueryClientProvider client={queryClient}>
    {providers.reduceRight((acc, Provider) => {
      return <Provider>{acc}</Provider>;
    }, children)}
  </QueryClientProvider>
);
