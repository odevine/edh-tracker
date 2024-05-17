import {
  Button,
  Grid,
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
import { useCallback, useEffect, useMemo, useState } from "react";

import { Matches, Users } from "@/API";
import { EnhancedTableHead, HeadCell, MatchModal } from "@/Components";
import { useDecks, useMatches, useUser } from "@/Context";
import { ColumnSortOrder, getComparator } from "@/Logic";

const headCells: HeadCell<Matches>[] = [
  {
    id: "datePlayed",
    label: "Date Played",
    sortable: true,
    alignment: "right",
  },
  {
    id: "matchType",
    label: "type",
    sortable: true,
  },
  {
    id: "winningUserID",
    label: "winner",
    sortable: true,
  },
  {
    id: "isArchived",
    label: "Participants",
  },
];

const dateFormatter = new Intl.DateTimeFormat("en-us", {
  dateStyle: "medium",
});

const localStorageKey = "matchesPageState";
const loadStateFromLocalStorage = () => {
  const savedState = localStorage.getItem(localStorageKey);
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
    order: "desc" as ColumnSortOrder,
    orderBy: "datePlayed" as keyof Matches,
    page: 0,
    rowsPerPage: 15,
  };
};

export const MatchesPage = (): JSX.Element => {
  const { allDecks } = useDecks();
  const { allUserProfiles } = useUser();
  const { allMatches, allMatchParticipants } = useMatches();
  const theme = useMuiTheme();

  const initialState = loadStateFromLocalStorage();

  const [order, setOrder] = useState<ColumnSortOrder>(initialState.order);
  const [orderBy, setOrderBy] = useState<keyof Matches>(initialState.orderBy);
  const [page, setPage] = useState(initialState.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialState.rowsPerPage);
  const [modalOpen, setModalOpen] = useState(true);

  // Save state to local storage whenever it changes
  useEffect(() => {
    const newSettings = JSON.stringify({
      order,
      orderBy,
      page,
      rowsPerPage,
    });
    localStorage.setItem(localStorageKey, newSettings);
  }, [order, orderBy, page, rowsPerPage]);

  const handleRequestSort = (property: keyof Matches) => {
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

  // Create a map of deck IDs to user profiles
  const deckToUserMap = useMemo(() => {
    const map = new Map<string, Users>();
    allDecks.forEach((deck) => {
      const user = allUserProfiles.find((user) => user.id === deck.deckOwnerID);
      if (user) {
        map.set(deck.id, user);
      }
    });
    return map;
  }, [allDecks, allUserProfiles]);

  const getParticipantsDisplayNames = (matchId: string) => {
    return allMatchParticipants
      .filter((participant) => participant.matchesID === matchId)
      .map(
        (participant) =>
          deckToUserMap.get(participant.decksID)?.displayName ?? "Unknown",
      )
      .join(", ");
  };

  const sortedMatches = useMemo(() => {
    return [...allMatches].sort(getComparator<Matches>(order, orderBy));
  }, [allMatches, order, orderBy]);

  const visibleRows = useMemo(() => {
    return sortedMatches.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [sortedMatches, page, rowsPerPage]);

  return (
    <>
      <Paper sx={{ m: 3 }}>
        <Toolbar sx={{ p: 2, justifyContent: "space-between" }}>
          <Grid container spacing={2}>
            {useMediaQuery(theme.breakpoints.up("lg")) && <Grid item lg={7} />}
            <Grid item xs={12} sm={9} md={9} lg={3}>
              <TextField fullWidth size="small" label="search matches" />
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={2}>
              <Button fullWidth variant="contained">
                add match
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
              {visibleRows.map((match) => {
                return (
                  <TableRow key={match.id}>
                    <TableCell align="right">
                      {dateFormatter.format(new Date(match.datePlayed))}
                    </TableCell>
                    <TableCell>{match.matchType}</TableCell>
                    <TableCell>
                      {deckToUserMap.get(match.winningUserID)?.displayName}
                    </TableCell>
                    <TableCell>
                      {getParticipantsDisplayNames(match.id)}
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
          count={sortedMatches.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_event, value) => handleChangePage(value)}
          onRowsPerPageChange={(event) =>
            handleChangeRowsPerPage(event.target.value)
          }
        />
      </Paper>
      <MatchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        deckToUserMap={deckToUserMap}
      />
    </>
  );
};
