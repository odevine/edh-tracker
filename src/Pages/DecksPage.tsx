import {
  Box,
  Button,
  Grid,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
} from "@mui/material";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Deck } from "@/API";
import {
  CommanderColors,
  DeckModal,
  EnhancedTableHead,
  HeadCell,
  PlayerSelector,
  ProfileMiniCard,
  TypeSelector,
} from "@/Components";
import { LOCAL_STORAGE_VERSION } from "@/Constants";
import { useDeck, useTheme, useUser } from "@/Context";
import { ColumnSortOrder, getComparator } from "@/Logic";

const headCells: HeadCell<Deck>[] = [
  {
    id: "deckName",
    label: "name",
    sortable: true,
  },
  {
    id: "deckOwnerId",
    label: "player",
    sortable: true,
  },
  {
    id: "deckType",
    label: "type",
    sortable: true,
  },
  {
    id: "commanderName",
    label: "commander",
    sortable: true,
  },
  {
    id: "commanderColors",
    label: "colors",
  },
  {
    id: "cost",
    label: "cost",
    alignment: "right",
    sortable: true,
  },
  {
    id: "updatedAt",
    label: "updated",
    alignment: "right",
    sortable: true,
  },
];

const dateFormatter = new Intl.DateTimeFormat("en-us", {
  dateStyle: "medium",
});

const localStorageKey = "decksPageState";
const loadStateFromLocalStorage = () => {
  const initialState = {
    stateVersion: LOCAL_STORAGE_VERSION,
    filterType: "",
    filterUser: "",
    searchQuery: "",
    order: "desc" as ColumnSortOrder,
    orderBy: "updatedAt" as keyof Deck,
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

  const initialState = loadStateFromLocalStorage();

  const [filterType, setFilterType] = useState(initialState.filterType);
  const [filterUser, setFilterUser] = useState(initialState.filterUser);
  const [searchQuery, setSearchQuery] = useState(initialState.searchQuery);
  const [order, setOrder] = useState<ColumnSortOrder>(initialState.order);
  const [orderBy, setOrderBy] = useState<keyof Deck>(initialState.orderBy);
  const [page, setPage] = useState(initialState.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialState.rowsPerPage);
  const [modalOpen, setModalOpen] = useState(false);

  // Save state to local storage whenever it changes
  useEffect(() => {
    const newSettings = JSON.stringify({
      stateVersion: LOCAL_STORAGE_VERSION,
      filterType,
      filterUser,
      searchQuery,
      order,
      orderBy,
      page,
      rowsPerPage,
    });
    localStorage.setItem(localStorageKey, newSettings);
  }, [filterType, filterUser, searchQuery, order, orderBy, page, rowsPerPage]);

  const handleRequestSort = (property: keyof Deck) => {
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
    return allDecks.filter(
      (deck) =>
        (filterUser === "" ||
          allUserProfiles.find((profile) => profile.id === deck.deckOwnerId)
            ?.id === filterUser) &&
        (filterType === "" || deck.deckType === filterType) &&
        (deck.deckName.toLowerCase().includes(lowercasedQuery) ||
          deck.commanderName.toLowerCase().includes(lowercasedQuery) ||
          deck.secondCommanderName?.toLowerCase().includes(lowercasedQuery)),
    );
  }, [allDecks, searchQuery, filterType, filterUser]);

  const userProfileMap = useMemo(() => {
    return new Map(allUserProfiles.map((profile) => [profile.id, profile]));
  }, [allUserProfiles]);

  const visibleRows = useMemo(() => {
    // First, create a shallow copy of the rows array and then sort it
    return [...filteredDecks]
      .sort(getComparator<Deck>(order, orderBy, userProfileMap))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, filteredDecks, userProfileMap]);

  return (
    <Paper sx={{ m: 3 }}>
      <Toolbar sx={{ p: 2, justifyContent: "space-between" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TypeSelector
              filterType={filterType}
              setFilterType={setFilterType}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <PlayerSelector
              filterUser={filterUser}
              setFilterUser={setFilterUser}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="search decks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
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
              let ownerProfileColor;
              if (ownerProfile) {
                ownerProfileColor =
                  mode === "light"
                    ? ownerProfile.lightThemeColor
                    : ownerProfile.darkThemeColor;
              }
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
                            {ownerProfile.displayName}
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
                  <TableCell align="right">
                    {deck.cost
                      ? deck.cost?.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell align="right">
                    {dateFormatter.format(new Date(deck.updatedAt))}
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

      <DeckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Paper>
  );
};
