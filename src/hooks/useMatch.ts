import { useContext } from "react";

import { MatchContext } from "@/context";

export const useMatch = () => {
  const ctx = useContext(MatchContext);
  if (!ctx) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return ctx;
};
