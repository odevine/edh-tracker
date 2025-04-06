import {
  AddCircleOutline,
  Delete,
  Edit,
  MoreVert,
  RemoveCircleOutline,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { navigate } from "raviger";
import { useState } from "react";

import {
  CardImageMiniCard,
  DeckColorCell,
  ProfileMiniCard,
} from "@/components";
import { Deck, DeckWithStats, Format, User } from "@/types";

interface DeckColumnOptions {
  usersMap: Map<string, User>;
  formatsMap: Map<string, Format>;
  currentUserId: string;
  filterFormat: string;
  onEdit: (deck: Deck) => void;
  onDelete: (deck: Deck) => void;
  onActiveToggle: (deck: Deck) => void;
  hasDeckBeenUsed: (deckId: string) => boolean;
}

export const getDecksColumns = ({
  usersMap,
  formatsMap,
  currentUserId,
  filterFormat,
  onEdit,
  onDelete,
  onActiveToggle,
  hasDeckBeenUsed,
}: DeckColumnOptions): GridColDef[] => {
  const filteredFormat = formatsMap.get(filterFormat);
  let includeCommanderColumn = true;
  if (filteredFormat && !filteredFormat.requiresCommander) {
    includeCommanderColumn = false;
  }

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
    ...(includeCommanderColumn
      ? [
          {
            field: "commanderName",
            headerName: "commander",
            flex: 1,
            minWidth: 300,
            filterable: false,
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
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
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
          } as GridColDef,
        ]
      : []),
    {
      field: "userId",
      headerName: "player",
      minWidth: 120,
      maxWidth: 130,
      flex: 1,
      filterable: false,
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
      field: "deckColors",
      headerName: "colors",
      width: 100,
      sortable: false,
      filterable: false,
      type: "custom",
      renderCell: (params: GridRenderCellParams<DeckWithStats>) => (
        <DeckColorCell deckColors={params.row.deckColors} />
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
      width: 56,
      renderCell: (params: GridRenderCellParams<Deck>) => {
        if (params.row.userId !== currentUserId) {
          return null;
        }

        const usedDeck = hasDeckBeenUsed(params.row.id);
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);

        const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
          setAnchorEl(null);
        };

        return (
          <>
            <IconButton size="small" onClick={handleOpen}>
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  onEdit(params.row);
                  handleClose();
                }}
              >
                <Edit fontSize="small" style={{ marginRight: 8 }} />
                edit deck
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onActiveToggle(params.row);
                  handleClose();
                }}
              >
                {params.row.inactive ? (
                  <AddCircleOutline
                    fontSize="small"
                    style={{ marginRight: 8 }}
                  />
                ) : (
                  <RemoveCircleOutline
                    fontSize="small"
                    style={{ marginRight: 8 }}
                  />
                )}
                mark {params.row.inactive ? "" : "in"}active
              </MenuItem>
              <Tooltip
                title={
                  usedDeck
                    ? "deck cannot be deleted as it is used in a match, you may instead mark it as inactive"
                    : ""
                }
                placement="left"
                arrow
                disableHoverListener={!usedDeck}
              >
                <Box component="span">
                  <MenuItem
                    onClick={() => {
                      onDelete(params.row);
                      handleClose();
                    }}
                    disabled={usedDeck}
                  >
                    <Delete fontSize="small" style={{ marginRight: 8 }} />
                    delete deck
                  </MenuItem>
                </Box>
              </Tooltip>
            </Menu>
          </>
        );
      },
    },
  ];
};
