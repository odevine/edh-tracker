import { ProfileMiniCard } from "@/components";
import { UserWithStats } from "@/types";
import { Box, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { navigate } from "raviger";

export function getUsersColumns(): GridColDef[] {
  return [
    {
      field: "displayName",
      headerName: "name",
      minWidth: 220,
      flex: 1,
      renderCell: (params: GridRenderCellParams<UserWithStats>) => (
        <PopupState variant="popover">
          {(popupState) => (
            <Box>
              <Typography
                {...bindHover(popupState)}
                onClick={() => navigate(`/users/${params.row.id}`)}
                variant="body2"
                component="span"
                sx={{
                  cursor: "pointer",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {params.value}
              </Typography>
              <HoverPopover
                {...bindPopover(popupState)}
                anchorOrigin={{ vertical: "center", horizontal: "right" }}
                transformOrigin={{ vertical: "center", horizontal: "left" }}
              >
                <ProfileMiniCard profile={params.row} />
              </HoverPopover>
            </Box>
          )}
        </PopupState>
      ),
    },
    {
      field: "totalWins",
      headerName: "wins",
      type: "number",
      minWidth: 80,
      maxWidth: 120,
      flex: 1,
    },
    {
      field: "totalMatches",
      headerName: "matches",
      type: "number",
      minWidth: 90,
      maxWidth: 130,
      flex: 1,
    },
    {
      field: "winRate",
      headerName: "win rate",
      type: "number",
      minWidth: 100,
      maxWidth: 140,
      flex: 1,
      valueFormatter: (value?: number) =>
        value != null
          ? value.toLocaleString("en-US", {
              style: "percent",
              maximumFractionDigits: 2,
            })
          : "-",
    },
  ];
}
