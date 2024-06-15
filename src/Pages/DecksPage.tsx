import {
  Box,
  Button,
  Divider,
  Grid,
  Link,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Deck } from "@/API";
import {
  ColorSelector,
  CommanderColors,
  DeckModal,
  EnhancedTableHead,
  HeadCell,
  PlayerSelector,
  ProfileMiniCard,
  TypeSelector,
} from "@/Components";
import { LOCAL_STORAGE_VERSION } from "@/Constants";
import { useDeck, useMatch, useTheme, useUser } from "@/Context";
import {
  ColumnSortOrder,
  DeckStats,
  getComparator,
  getDeckStats,
} from "@/Logic";

interface DeckWithStats extends Deck, DeckStats {}

const headCells: HeadCell<DeckWithStats>[] = [
  { id: "deckName", label: "name", sortable: true },
  { id: "deckOwnerId", label: "player", sortable: true },
  { id: "deckType", label: "type", sortable: true },
  { id: "commanderName", label: "commander", sortable: true },
  { id: "commanderColors", label: "colors" },
  { id: "totalWins", label: "wins", alignment: "right", sortable: true },
  { id: "totalMatches", label: "matches", alignment: "right", sortable: true },
  { id: "cost", label: "cost", alignment: "right", sortable: true },
];

const localStorageKey = "decksPageState";
const loadStateFromLocalStorage = () => {
  const initialState = {
    stateVersion: LOCAL_STORAGE_VERSION,
    filterColor: [],
    filterType: "",
    filterUser: "",
    searchQuery: "",
    order: "desc" as ColumnSortOrder,
    orderBy: "updatedAt" as keyof DeckWithStats,
    page: 0,
    rowsPerPage: 15,
  };

  const savedState = localStorage.getItem(localStorageKey);
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    if (parsedState.stateVersion === LOCAL_STORAGE_VERSION) {
      return JSON.parse(savedState);
    } else {
      localStorage.removeItem(localStorageKey);
      localStorage.setItem(localStorageKey, JSON.stringify(initialState));
    }
  }
  return initialState;
};

export const DecksPage = (): JSX.Element => {
  const { allDecks } = useDeck();
  const { allUserProfiles } = useUser();
  const { mode } = useTheme();
  const { allMatches, allMatchParticipants } = useMatch();
  const theme = useMuiTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const initialState = loadStateFromLocalStorage();

  const [filterColor, setFilterColor] = useState(initialState.filterColor);
  const [filterType, setFilterType] = useState(initialState.filterType);
  const [filterUser, setFilterUser] = useState(initialState.filterUser);
  const [searchQuery, setSearchQuery] = useState(initialState.searchQuery);
  const [order, setOrder] = useState<ColumnSortOrder>(initialState.order);
  const [orderBy, setOrderBy] = useState<keyof DeckWithStats>(
    initialState.orderBy,
  );
  const [page, setPage] = useState(initialState.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialState.rowsPerPage);
  const [modalOpen, setModalOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    const newSettings = JSON.stringify({
      stateVersion: LOCAL_STORAGE_VERSION,
      filterColor,
      filterType,
      filterUser,
      searchQuery,
      order,
      orderBy,
      page,
      rowsPerPage,
    });
    localStorage.setItem(localStorageKey, newSettings);
  }, [
    filterColor,
    filterType,
    filterUser,
    searchQuery,
    order,
    orderBy,
    page,
    rowsPerPage,
  ]);

  const handleRequestSort = (property: keyof DeckWithStats) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((newRowsPerPage: string) => {
    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  }, []);

  const filteredDecks = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();

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

    return allDecks.filter((deck) => {
      const commanderColors = deck.commanderColors ?? [];
      const secondCommanderColors = (deck.secondCommanderColors ??
        []) as string[];
      const combinedColors = [
        ...new Set([...commanderColors, ...secondCommanderColors]),
      ];
      return (
        (filterUser === "" ||
          allUserProfiles.find((profile) => profile.id === deck.deckOwnerId)
            ?.id === filterUser) &&
        (filterType === "" || deck.deckType === filterType) &&
        matchesExactColors(combinedColors, filterColor) &&
        (deck.deckName.toLowerCase().includes(lowercasedQuery) ||
          deck.commanderName.toLowerCase().includes(lowercasedQuery) ||
          deck.secondCommanderName?.toLowerCase().includes(lowercasedQuery))
      );
    });
  }, [allDecks, searchQuery, filterType, filterUser, filterColor]);

  const userProfileMap = useMemo(() => {
    return new Map(allUserProfiles.map((profile) => [profile.id, profile]));
  }, [allUserProfiles]);

  const decksWithStats = useMemo(() => {
    return filteredDecks.map((deck) => {
      const deckStats = getDeckStats(deck.id, allMatches, allMatchParticipants);
      return { ...deck, ...deckStats };
    });
  }, [filteredDecks, allMatches, allMatchParticipants]);

  const visibleRows = useMemo(() => {
    return [...decksWithStats]
      .sort(getComparator<DeckWithStats>(order, orderBy, userProfileMap))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, decksWithStats, userProfileMap]);

  return (
    <Paper sx={{ m: 3 }}>
      <Toolbar sx={{ p: 2, justifyContent: "space-between" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              size="small"
              label="search decks"
              value={searchQuery}
              onChange={(e) => {
                setPage(0);
                setSearchQuery(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button fullWidth variant="outlined" onClick={handlePopoverOpen}>
              filters
            </Button>
            <Popover
              sx={{ mt: 1 }}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <ColorSelector
                      filterColor={filterColor}
                      setFilterColor={(newColor) => {
                        setPage(0);
                        setFilterColor(newColor);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TypeSelector
                      filterType={filterType}
                      setFilterType={(newType) => {
                        setPage(0);
                        setFilterType(newType);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <PlayerSelector
                      filterUser={filterUser}
                      setFilterUser={(newUser) => {
                        setPage(0);
                        setFilterUser(newUser);
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Popover>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setModalOpen(true)}
            >
              add deck
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
      {isSmallScreen ? (
        <Box>
          <Grid container sx={{ px: 2 }} spacing={1}>
            <Grid item xs={6}>
              <Select
                fullWidth
                size="small"
                value={orderBy}
                onChange={(e) =>
                  setOrderBy(e.target.value as keyof DeckWithStats)
                }
                displayEmpty
              >
                {headCells.map((headCell) =>
                  headCell.sortable ? (
                    <MenuItem
                      key={headCell.id as string}
                      value={headCell.id as string}
                    >
                      {headCell.label}
                    </MenuItem>
                  ) : null,
                )}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <Select
                fullWidth
                size="small"
                value={order}
                onChange={(e) => setOrder(e.target.value as ColumnSortOrder)}
                displayEmpty
              >
                <MenuItem value="asc">asc</MenuItem>
                <MenuItem value="desc">desc</MenuItem>
              </Select>
            </Grid>
          </Grid>
          {visibleRows.map((deck) => {
            const ownerProfile = userProfileMap.get(deck.deckOwnerId);
            const ownerProfileColor = ownerProfile
              ? mode === "light"
                ? ownerProfile.lightThemeColor
                : ownerProfile.darkThemeColor
              : undefined;

            return (
              <Box key={deck.id}>
                <Grid container sx={{ px: 2, py: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: ownerProfileColor }}>
                      {deck.deckName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">player:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {ownerProfile?.displayName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">type:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{deck.deckType}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">commander:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {deck.commanderName}
                    </Typography>
                    {deck.secondCommanderName && (
                      <Typography variant="body2">
                        {deck.secondCommanderName}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">colors:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <CommanderColors
                      colors={[
                        ...(deck.commanderColors ?? []),
                        ...(deck.secondCommanderColors ?? []),
                      ]}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">wins:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{deck.totalWins}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">matches:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{deck.totalMatches}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">cost:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {deck.cost
                        ? deck.cost.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                        : "-"}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
              </Box>
            );
          })}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
            >
              previous
            </Button>
            <Typography>{page + 1}</Typography>
            <Button
              onClick={() => handleChangePage(page + 1)}
              disabled={
                page >= Math.ceil(filteredDecks.length / rowsPerPage) - 1
              }
            >
              next
            </Button>
          </Stack>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <EnhancedTableHead
              headCells={headCells}
              order={order}
              orderBy={orderBy}
              onRequestSort={(_event, property) => handleRequestSort(property)}
            />
            <TableBody>
              {visibleRows.map((deck) => {
                const ownerProfile = userProfileMap.get(deck.deckOwnerId);
                const ownerProfileColor = ownerProfile
                  ? mode === "light"
                    ? ownerProfile.lightThemeColor
                    : ownerProfile.darkThemeColor
                  : undefined;
                return (
                  <TableRow
                    key={deck.id}
                    sx={{
                      backgroundColor: ownerProfileColor
                        ? `${ownerProfileColor}26`
                        : "none",
                    }}
                  >
                    <TableCell>
                      {deck.link ? (
                        <Link
                          href={deck.link ?? undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: (theme) => theme.palette.text.primary,
                            fontWeight: "bold",
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {deck.deckName}
                        </Link>
                      ) : (
                        deck.deckName
                      )}
                    </TableCell>
                    <TableCell>
                      {ownerProfile && (
                        <PopupState variant="popover">
                          {(popupState) => (
                            <Box {...bindHover(popupState)}>
                              <Box sx={{ cursor: "pointer" }}>
                                {ownerProfile.displayName}
                              </Box>
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
                                <ProfileMiniCard profile={ownerProfile} />
                              </HoverPopover>
                            </Box>
                          )}
                        </PopupState>
                      )}
                    </TableCell>
                    <TableCell>{deck.deckType}</TableCell>
                    <TableCell>
                      {deck.commanderName}
                      {deck.secondCommanderName && (
                        <>
                          <br />
                          {deck.secondCommanderName}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <CommanderColors
                        colors={[
                          ...(deck.commanderColors ?? []),
                          ...(deck.secondCommanderColors ?? []),
                        ]}
                      />
                    </TableCell>
                    <TableCell align="right">{deck.totalWins}</TableCell>
                    <TableCell align="right">{deck.totalMatches}</TableCell>
                    <TableCell align="right">
                      {deck.cost
                        ? deck.cost.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })
                        : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[15, 25, 50]}
                  count={filteredDecks.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={(_event, value) => handleChangePage(value)}
                  onRowsPerPageChange={(event) =>
                    handleChangeRowsPerPage(event.target.value)
                  }
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
      <DeckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Paper>
  );
};
