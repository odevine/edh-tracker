import { Delete, Edit } from "@mui/icons-material";
import { Box, Chip, IconButton, Link, Stack, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { navigate } from "raviger";

import {
  CardImageMiniCard,
  CommanderColors,
  ProfileMiniCard,
} from "@/components";
import { Deck, DeckWithStats, Format, User } from "@/types";

interface DeckColumnOptions {
  usersMap: Map<string, User>;
  formatsMap: Map<string, Format>;
  currentUserId: string;
  onEdit: (deck: Deck) => void;
  onDelete: (deck: Deck) => void;
  hasDeckBeenUsed: (deckId: string) => boolean;
}

export const getDecksColumns = ({
  usersMap,
  formatsMap,
  currentUserId,
  onEdit,
  onDelete,
  hasDeckBeenUsed,
}: DeckColumnOptions): GridColDef[] => {
  return [
    {
      field: "displayName",
      headerName: "name",
      minWidth: 300,
      flex: 1,
      renderCell: (params: GridRenderCellParams<DeckWithStats>) => (
        <Stack direction="row" alignItems="center">
          {params.row.inactive && (
            <Chip size="small" label="inactive" sx={{ mr: 1 }} />
          )}
          {params.row.link ? (
            <Link href={params.row.link} color="text.primary" fontWeight={600}>
              {params.value}
            </Link>
          ) : (
            params.value
          )}
        </Stack>
      ),
    },
    {
      field: "commanderName",
      headerName: "commander",
      flex: 1,
      minWidth: 300,
      valueGetter: (_value, row) =>
        `${row.commanderName ?? ""} ${row.secondCommanderName ?? ""}`,
      renderCell: (params: GridRenderCellParams<DeckWithStats>) => (
        <>
          {[params.row.commanderName, params.row.secondCommanderName].map(
            (name, index) =>
              name && (
                <PopupState key={index} variant="popover">
                  {(popupState) => (
                    <Box>
                      <Typography
                        {...bindHover(popupState)}
                        variant="body2"
                        component="span"
                        sx={{
                          cursor: "pointer",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {name}
                      </Typography>
                      <HoverPopover
                        {...bindPopover(popupState)}
                        anchorOrigin={{ vertical: "top", horizontal: "left" }}
                        transformOrigin={{
                          vertical: "center",
                          horizontal: "right",
                        }}
                      >
                        <CardImageMiniCard cardName={name} />
                      </HoverPopover>
                    </Box>
                  )}
                </PopupState>
              ),
          )}
        </>
      ),
    },
    {
      field: "userId",
      headerName: "player",
      minWidth: 120,
      maxWidth: 130,
      flex: 1,
      valueGetter: (value) => usersMap.get(value)?.displayName,
      renderCell: (params: GridRenderCellParams<DeckWithStats>) => {
        const ownerProfile = usersMap.get(params.row.userId);
        if (!ownerProfile) {
          return params.value;
        }

        return (
          <PopupState variant="popover">
            {(popupState) => (
              <Box>
                <Typography
                  {...bindHover(popupState)}
                  onClick={() => navigate(`/users/${ownerProfile.id}`)}
                  variant="body2"
                  component="span"
                  sx={{
                    cursor: "pointer",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {ownerProfile.displayName}
                </Typography>
                <HoverPopover
                  {...bindPopover(popupState)}
                  anchorOrigin={{ vertical: "center", horizontal: "left" }}
                  transformOrigin={{ vertical: "center", horizontal: "right" }}
                >
                  <ProfileMiniCard profile={ownerProfile} />
                </HoverPopover>
              </Box>
            )}
          </PopupState>
        );
      },
    },
    {
      field: "formatId",
      headerName: "type",
      width: 120,
      valueGetter: (value) => formatsMap.get(value)?.displayName ?? "-",
    },
    {
      field: "commanderColors",
      headerName: "colors",
      width: 100,
      sortable: false,
      type: "custom",
      renderCell: (params: GridRenderCellParams<DeckWithStats>) => (
        <CommanderColors colors={params.row.deckColors} />
      ),
    },
    {
      field: "totalWins",
      headerName: "wins",
      type: "number",
      minWidth: 60,
      maxWidth: 110,
      flex: 1,
    },
    {
      field: "totalMatches",
      headerName: "matches",
      type: "number",
      minWidth: 80,
      maxWidth: 140,
      flex: 1,
    },
    {
      field: "winRate",
      headerName: "win rate",
      type: "number",
      minWidth: 90,
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
    {
      field: "cost",
      headerName: "cost",
      type: "number",
      width: 110,
      valueFormatter: (value?: number) =>
        value != null
          ? value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })
          : "-",
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      width: 80,
      renderCell: (params: GridRenderCellParams<Deck>) =>
        params.row.userId === currentUserId && (
          <Stack direction="row" spacing={0.5}>
            {onEdit && (
              <IconButton size="small" onClick={() => onEdit(params.row)}>
                <Edit fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete(params.row)}
                disabled={hasDeckBeenUsed(params.row.id)}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Stack>
        ),
    },
  ];
};
