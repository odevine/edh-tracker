export type ColorKey = "W" | "U" | "B" | "R" | "G" | "C";
export const COLOR_CLASS_MAP: Record<ColorKey, string> = {
  W: "ms ms-w",
  U: "ms ms-u",
  B: "ms ms-b",
  R: "ms ms-r",
  G: "ms ms-g",
  C: "ms ms-c",
};

export const COLOR_MAP: Record<string, string> = {
  W: "white",
  U: "blue",
  B: "black",
  R: "red",
  G: "green",
  C: "colorless",
};

export const COLOR_ORDER = ["W", "B", "U", "R", "G", "C"];
