import { getContrastRatio } from "@mui/material";

export const getContrastText = (backgroundColor: string) => {
  return getContrastRatio(backgroundColor, "#000") >= 4.5 ? "#000" : "#fff";
};
