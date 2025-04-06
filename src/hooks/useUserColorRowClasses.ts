import { useMemo } from "react";

import { User } from "@/types";

export const useUserColorRowClasses = (
  users: User[],
  themeMode: "light" | "dark",
) => {
  return useMemo(() => {
    const styles: Record<string, any> = {};
    users.forEach((user) => {
      const color =
        themeMode === "light" ? user.lightThemeColor : user.darkThemeColor;
      if (color) {
        styles[`.user-row-${user.id}`] = {
          backgroundColor: `${color}26`,
          border: `1px solid transparent`,
          "&:hover": {
            border: (theme: any) => `1px solid ${theme.palette.primary.main}`,
          },
        };
      }
    });
    return styles;
  }, [users, themeMode]);
};
