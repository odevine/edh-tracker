import { FilterAlt } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  Popover,
  Stack,
  Switch,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowClassNameParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { navigate } from "raviger";
import { useMemo, useRef, useState } from "react";

import {
  CardImageMiniCard,
  ColorSelector,
  CommanderColors,
  PlayerSelector,
  ProfileMiniCard,
  TypeSelector,
} from "@/components";
import { useDeck, useFormat, useMatch, useTheme, useUser } from "@/context";
import type { DeckWithStats } from "@/logic";
import { getDeckStats, getFullColorNames } from "@/logic";

interface IDecksTableProps {
  customButtons: JSX.Element[];
  filterColor: string[];
  filterFormat: string;
  filterUser: string;
  includeInactive: boolean;
  includeUnranked: boolean;
  setFilterColor: (newColor: string[]) => void;
  setFilterFormat: (newType: string) => void;
  setFilterUser: (newUser: string | string[]) => void;
  setIncludeInactive: (checked: boolean) => void;
  setIncludeUnranked: (checked: boolean) => void;
}

export const DecksTable = ({
  customButtons,
  filterColor,
  filterFormat,
  filterUser,
  includeInactive,
  includeUnranked,
  setFilterColor,
  setFilterFormat,
  setFilterUser,
  setIncludeInactive,
  setIncludeUnranked,
}: IDecksTableProps) => {
  const { allUserProfiles } = useUser();
  const { allDecks, decksLoading } = useDeck();
  const { allFormats } = useFormat();
  const { mode } = useTheme();
  const { allMatches } = useMatch();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { userProfileMap, userColorClasses } = useMemo(() => {
    const userProfileMap = new Map(
      allUserProfiles.map((profile) => [profile.id, profile]),
    );
    const userColorClasses: Record<string, SxProps<Theme>> = {};

    userProfileMap.forEach((user, key) => {
      const userColor =
        mode === "light" ? user.lightThemeColor : user.darkThemeColor;
      userColorClasses[`.user-row-${key}`] = {
        backgroundColor: userColor ? `${userColor}26` : "inherit",
        border: `1px solid transparent`,
        "&:hover": {
          border: (theme) => `1px solid ${theme.palette.primary.main}`,
        },
      };
    });
    return { userProfileMap, userColorClasses };
  }, [allUserProfiles]);

  const deckCategoriesMap = useMemo(() => {
    return new Map(allFormats.map((format) => [format.id, format]));
  }, [allFormats]);

  const columns: GridColDef[] = useMemo(
    (): GridColDef[] => [
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
              <Link
                href={params.row.link}
                color="text.primary"
                fontWeight={600}
              >
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
            {params.row.commanderName && (
              <PopupState variant="popover">
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
                      {params.row.commanderName}
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
                      sx={{}}
                    >
                      <CardImageMiniCard cardName={params.row.commanderName} />
                    </HoverPopover>
                  </Box>
                )}
              </PopupState>
            )}
            {params.row.secondCommanderName && (
              <>
                <PopupState variant="popover">
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
                        {params.row.secondCommanderName}
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
                        <CardImageMiniCard
                          cardName={params.row.secondCommanderName as string}
                        />
                      </HoverPopover>
                    </Box>
                  )}
                </PopupState>
              </>
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
        valueGetter: (value) => userProfileMap.get(value)?.displayName,
        renderCell: (params: GridRenderCellParams<DeckWithStats>) => {
          const ownerProfile = userProfileMap.get(params.row.userId);
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
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {ownerProfile.displayName}
                  </Typography>
                  <HoverPopover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: "center",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "center",
                      horizontal: "right",
                    }}
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
        valueGetter: (value) =>
          deckCategoriesMap.get(value)?.displayName ?? "-",
      },
      {
        field: "commanderColors",
        headerName: "colors",
        width: 100,
        sortable: false,
        type: "custom",
        renderCell: (params: GridRenderCellParams<DeckWithStats>) => (
          <CommanderColors
            colors={[
              ...(params.row.commanderColors ?? []),
              ...(params.row.secondCommanderColors ?? []),
            ]}
          />
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
        valueFormatter: (value?: number) => {
          if (value) {
            return value.toLocaleString("en-US", {
              style: "percent",
              maximumFractionDigits: 2,
            });
          }
          return "-";
        },
      },
      {
        field: "cost",
        headerName: "cost",
        type: "number",
        width: 110,
        valueFormatter: (value?: number) => {
          if (value) {
            return value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            });
          }
          return "-";
        },
      },
    ],
    [allFormats, allUserProfiles],
  );

  const decksWithStats: DeckWithStats[] = useMemo(() => {
    const matchesExactColors = (
      deckColors: string[],
      filterColors: string[],
    ) => {
      // If no color is selected, include all decks
      if (filterColors.length === 0) return true;
      if (filterColors.includes("C")) {
        // If "C" (colorless) is selected, deck must be colorless
        return deckColors.length === 0 && filterColors.length === 1;
      }

      // Check if deckColors matches filterColors exactly
      return (
        deckColors.length === filterColors.length &&
        deckColors.every((color) => filterColors.includes(color))
      );
    };

    return allDecks
      .filter((deck) => {
        const commanderColors = deck.commanderColors ?? [];
        const secondCommanderColors = (deck.secondCommanderColors ??
          []) as string[];
        const combinedColors = [
          ...new Set([...commanderColors, ...secondCommanderColors]),
        ];

        return (
          (includeInactive || !deck.inactive) &&
          (filterUser === "" ||
            allUserProfiles.find((profile) => profile.id === deck.userId)
              ?.id === filterUser) &&
          (filterFormat === "" || deck.formatId === filterFormat) &&
          matchesExactColors(combinedColors, filterColor)
        );
      })
      .map((deck) => {
        const deckStats = getDeckStats(deck.id, allMatches, includeUnranked);
        return { ...deck, ...deckStats };
      });
  }, [
    allDecks,
    includeInactive,
    filterFormat,
    filterUser,
    filterColor,
    includeUnranked,
    allMatches,
  ]);

  const filterDescription = useMemo(() => {
    const clauses: string[] = [];

    clauses.push("showing");

    if (!includeInactive) {
      clauses.push("active");
    } else {
      clauses.push("all");
    }

    if (filterFormat) {
      clauses.push(`"${deckCategoriesMap.get(filterFormat)?.displayName}"`);
    }

    clauses.push("decks");

    if (filterUser) {
      const userProfile = allUserProfiles.find(
        (profile) => profile.id === filterUser,
      );
      if (userProfile) {
        clauses.push(`owned by ${userProfile.displayName}`);
      }
    }

    if (filterColor.length > 0) {
      if (filterColor.includes("C") && filterColor.length === 1) {
        clauses.push("that are colorless");
      } else {
        clauses.push(`that are ${getFullColorNames(filterColor)}`);
      }
    }

    if (includeUnranked) {
      clauses.push("while including unranked matches in stats");
    }

    // Combine the clauses into a single sentence
    return clauses.join(" ");
  }, [
    filterUser,
    filterFormat,
    filterColor,
    includeInactive,
    includeUnranked,
    allUserProfiles,
  ]);

  const CustomDecksToolbar = () => (
    <GridToolbarContainer sx={{ px: 2, py: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1} width="100%">
        <GridToolbarQuickFilter placeholder="search..." />
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarDensitySelector
          slotProps={{
            button: { variant: "outlined" },
            tooltip: { title: "change row density" },
          }}
        />
        <GridToolbarColumnsButton
          slotProps={{
            button: { variant: "outlined" },
            tooltip: { title: "manage column visibility" },
          }}
        />
        <Button
          key="filters"
          variant="outlined"
          size="small"
          onClick={() => setAnchorEl(gridRef.current)}
          startIcon={<FilterAlt fontSize="small" />}
        >
          filters
        </Button>
        {customButtons.map((button) => button)}
      </Stack>
      <Typography
        component="span"
        color="primary"
        variant="caption"
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          flexShrink: 1,
          minWidth: 0,
        }}
      >
        {filterDescription}
      </Typography>
    </GridToolbarContainer>
  );

  return (
    <Stack height="100%" minWidth={740}>
      <DataGrid
        ref={gridRef}
        pagination
        disableRowSelectionOnClick
        loading={decksLoading}
        initialState={{
          density: "compact",
          pagination: {
            paginationModel: { pageSize: 15 },
          },
        }}
        onFilterModelChange={(filterModel) => console.log(filterModel)}
        pageSizeOptions={[15, 25, 50]}
        getRowHeight={() => "auto"}
        rows={decksWithStats}
        columns={columns}
        slots={{
          toolbar: CustomDecksToolbar,
        }}
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        getRowClassName={(params: GridRowClassNameParams<DeckWithStats>) =>
          `user-row-${params.row.userId}`
        }
        sx={{
          ...userColorClasses,
          "&.MuiDataGrid-root": {
            border: "none",
          },
          "&.MuiDataGrid-root .MuiDataGrid-cell": {
            whiteSpace: "nowrap",
            border: "none",
          },
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
            py: "8px",
          },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "15px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "22px",
          },
          "&.MuiDataGrid-root .MuiDataGrid-row": {
            alignItems: "center",
          },
          minWidth: 740,
        }}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          mt: "80px",
          width: 500,
        }}
      >
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ColorSelector
                filterColor={filterColor}
                setFilterColor={setFilterColor}
              />
            </Grid>
            <Grid item xs={12}>
              <TypeSelector
                filterFormat={filterFormat}
                setFilterFormat={setFilterFormat}
              />
            </Grid>
            <Grid item xs={12}>
              <PlayerSelector
                filterUser={filterUser}
                setFilterUser={setFilterUser}
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center">
                <Switch
                  checked={includeInactive}
                  onChange={(event) => setIncludeInactive(event.target.checked)}
                />
                <Typography component="span">
                  include inactive decks?
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center">
                <Switch
                  checked={includeUnranked}
                  onChange={(event) => setIncludeUnranked(event.target.checked)}
                />
                <Typography component="span">
                  include unranked matches in stats?
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </Stack>
  );
};
