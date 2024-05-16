import {
  Box,
  Grid,
  Link,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Decks, Users } from "@/API";
import {
  CommanderColors,
  EnhancedTableHead,
  HeadCell,
  ProfileMiniCard,
} from "@/Components";
import { useDecks, useTheme, useUser } from "@/Context";
import { ColumnSortOrder, getComparator } from "@/Logic";

const headCells: HeadCell<Decks>[] = [
  {
    id: "deckName",
    label: "name",
    sortable: true,
  },
  {
    id: "deckOwnerID",
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
    label: "last updated",
    alignment: "right",
    sortable: true,
  },
];

const PlayerSelector = (props: {
  allDecks: Decks[];
  allUserProfiles: Users[];
  filterUser: string;
  setFilterUser: (newUser: string) => void;
}) => {
  const { allDecks, allUserProfiles, filterUser, setFilterUser } = props;
  const { mode } = useTheme();

  // Generate the unique list of user options
  const userOptions = useMemo(() => {
    // Get unique ownerIDs from allDecks
    const uniqueOwnerIDs = [
      ...new Set(allDecks.map((deck) => deck.deckOwnerID)),
    ];

    // Map ownerIDs to user profiles, filter out undefined, and assert the remaining profiles are defined
    return uniqueOwnerIDs
      .map((ownerID) =>
        allUserProfiles.find((profile) => profile.id === ownerID),
      )
      .filter((profile): profile is Users => profile !== undefined)
      .map((profile) => ({
        id: profile.id,
        displayName: profile.displayName,
        color:
          mode === "light" ? profile.lightThemeColor : profile.darkThemeColor,
      }));
  }, [allDecks, allUserProfiles]);

  return (
    <TextField
      fullWidth
      select
      size="small"
      value={filterUser}
      label="player"
      onChange={(e) => setFilterUser(e.target.value)}
      sx={{ minWidth: 140 }}
    >
      <MenuItem value="all">all users</MenuItem>
      {userOptions.map((option) => (
        <MenuItem
          key={option.id}
          value={option.displayName}
          sx={{ color: option.color }}
        >
          {option.displayName}
        </MenuItem>
      ))}
    </TextField>
  );
};

const TypeSelector = (props: {
  allDecks: Decks[];
  filterType: string;
  setFilterType: (newType: string) => void;
}) => {
  const { allDecks, filterType, setFilterType } = props;
  const deckTypes = useMemo(() => {
    // Extract unique deck types from all decks
    return [...new Set(allDecks.map((deck) => deck.deckType))];
  }, [allDecks]);

  return (
    <TextField
      fullWidth
      select
      size="small"
      value={filterType}
      label="type"
      onChange={(e) => setFilterType(e.target.value)}
      sx={{ minWidth: 140 }}
    >
      <MenuItem value="all">all types</MenuItem>
      {deckTypes.map((type) => (
        <MenuItem key={type} value={type}>
          {type}
        </MenuItem>
      ))}
    </TextField>
  );
};

const dateFormatter = new Intl.DateTimeFormat("en-us", {
  dateStyle: "medium",
});

const localStorageKey = "decksPageState";
const loadStateFromLocalStorage = () => {
  const savedState = localStorage.getItem(localStorageKey);
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
    filterType: "all",
    filterUser: "all",
    searchQuery: "",
    order: "desc" as ColumnSortOrder,
    orderBy: "updatedAt" as keyof Decks,
    page: 0,
    rowsPerPage: 15,
  };
};

export const DecksPage = (): JSX.Element => {
  const { allDecks } = useDecks();
  const { allUserProfiles } = useUser();
  const { mode } = useTheme();
  const theme = useMuiTheme();

  const initialState = loadStateFromLocalStorage();

  const [filterType, setFilterType] = useState(initialState.filterType);
  const [filterUser, setFilterUser] = useState(initialState.filterUser);
  const [searchQuery, setSearchQuery] = useState(initialState.searchQuery);
  const [order, setOrder] = useState<ColumnSortOrder>(initialState.order);
  const [orderBy, setOrderBy] = useState<keyof Decks>(initialState.orderBy);
  const [page, setPage] = useState(initialState.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialState.rowsPerPage);

  // Save state to local storage whenever it changes
  useEffect(() => {
    const newSettings = JSON.stringify({
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

  const handleRequestSort = (property: keyof Decks) => {
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
        (filterUser === "all" ||
          allUserProfiles.find((profile) => profile.id === deck.deckOwnerID)
            ?.displayName === filterUser) &&
        (filterType === "all" || deck.deckType === filterType) &&
        (deck.deckName.toLowerCase().includes(lowercasedQuery) ||
          deck.commanderName.toLowerCase().includes(lowercasedQuery)),
    );
  }, [allDecks, searchQuery, filterType, filterUser]);

  const userProfileMap = useMemo(() => {
    return new Map(allUserProfiles.map((profile) => [profile.id, profile]));
  }, [allUserProfiles, mode]);

  const visibleRows = useMemo(() => {
    // First, create a shallow copy of the rows array and then sort it
    return [...filteredDecks]
      .sort(getComparator<Decks>(order, orderBy, userProfileMap))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, filteredDecks, userProfileMap]);

  return (
    <Paper sx={{ m: 3 }}>
      <Toolbar sx={{ p: 2, justifyContent: "space-between" }}>
        <Grid container spacing={2}>
          {useMediaQuery(theme.breakpoints.up("lg")) && <Grid item lg={5} />}
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <TypeSelector
              allDecks={allDecks}
              filterType={filterType}
              setFilterType={setFilterType}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <PlayerSelector
              allDecks={allDecks}
              allUserProfiles={allUserProfiles}
              filterUser={filterUser}
              setFilterUser={setFilterUser}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={3}>
            <TextField
              fullWidth
              size="small"
              label="search decks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
              const ownerProfile = userProfileMap.get(deck.deckOwnerID);
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
                                horizontal: "right",
                              }}
                              transformOrigin={{
                                vertical: "center",
                                horizontal: "left",
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
                  <TableCell>{deck.commanderName}</TableCell>
                  <TableCell>
                    <CommanderColors colors={deck.commanderColors ?? []} />
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
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[15, 25, 50]}
        component="div"
        count={filteredDecks.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_event, value) => handleChangePage(value)}
        onRowsPerPageChange={(event) =>
          handleChangeRowsPerPage(event.target.value)
        }
      />
    </Paper>
  );
};
