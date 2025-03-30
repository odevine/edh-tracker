import { useContext } from "react";

import { FormatContext } from "@/context";

export const useFormat = () => {
  const ctx = useContext(FormatContext);
  if (!ctx) {
    throw new Error("useFormat must be used within a FormatProvider");
  }
  return ctx;
};
