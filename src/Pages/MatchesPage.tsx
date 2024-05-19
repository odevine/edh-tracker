import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Match } from "@/API";
import {
  EnhancedTableHead,
  HeadCell,
  MatchModal,
  PlayerSelector,
  TypeSelector,
} from "@/Components";
import { useDeck, useMatch, useUser } from "@/Context";
import { ColumnSortOrder, getComparator } from "@/Logic";

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
    filterType: "all",
    filterUser: "all",
    order: "desc" as ColumnSortOrder,
    orderBy: "datePlayed" as keyof Match,
    page: 0,
    rowsPerPage: 15,
  };
};

export const MatchesPage = (): JSX.Element => {
  const { allDecks, getDeckUserColor } = useDeck();
  const { isAdmin } = useUser();
  const { allMatches, allMatchParticipants, deleteMatch } = useMatch();

  const initialState = loadStateFromLocalStorage();

  const [filterType, setFilterType] = useState(initialState.filterType);
  const [filterUser, setFilterUser] = useState<string | string[]>(
    initialState.filterUser,
  );
  const [order, setOrder] = useState<ColumnSortOrder>(initialState.order);
  const [orderBy, setOrderBy] = useState<keyof Match>(initialState.orderBy);
  const [page, setPage] = useState(initialState.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialState.rowsPerPage);
  const [modalOpen, setModalOpen] = useState(false);
  const [existingMatchId, setExistingMatchId] = useState("");

  // Save state to local storage whenever it changes
  useEffect(() => {
    const newSettings = JSON.stringify({
      filterType,
      filterUser,
      order,
      orderBy,
      page,
      rowsPerPage,
    });
    localStorage.setItem(localStorageKey, newSettings);
  }, [order, orderBy, page, rowsPerPage, filterType, filterUser]);

  const headCells: HeadCell<Match>[] = [
    {
      id: "datePlayed",
      label: "date",
      sortable: true,
      alignment: "right",
    },
    {
      id: "matchType",
      label: "type",
      sortable: true,
    },
    {
      id: "winningDeckId",
      label: "winner",
      sortable: true,
    },
    {
      id: "decks",
      label: "decks",
    },
  ];

  if (isAdmin) {
    headCells.push({
      id: "actions",
      label: "actions",
      alignment: "right",
    });
  }

  const handleRequestSort = (property: keyof Match) => {
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

  const getParticipantDeckNames = (matchId: string) => {
    const participants = allMatchParticipants.filter(
      (participant) => participant.matchId === matchId,
    );
    return participants.map((participant) => (
      <Typography
        key={participant.id}
        variant="body2"
        // component="span"
        sx={{ color: getDeckUserColor(participant.deckId) }}
      >
        {allDecks.find((deck) => deck.id === participant.deckId)?.deckName}
      </Typography>
    ));
  };

  const filteredMatches = useMemo(() => {
    return allMatches.filter((match) => {
      // Get the participants for this match
      const participants = allMatchParticipants.filter(
        (participant) => participant.matchId === match.id,
      );

      // Get the deck owner IDs from the participants
      const participantOwnerIds = participants.map((participant) => {
        const deck = allDecks.find((deck) => deck.id === participant.deckId);
        return deck?.deckOwnerId;
      });

      const userFilterCondition = Array.isArray(filterUser)
        ? filterUser.every((userId) => participantOwnerIds.includes(userId))
        : participantOwnerIds.includes(filterUser);

      return (
        userFilterCondition &&
        (filterType === "all" || match.matchType === filterType)
      );
    });
  }, [allMatches, allMatchParticipants, allDecks, filterType, filterUser]);

  const visibleRows = useMemo(() => {
    return [...filteredMatches]
      .sort(getComparator<Match>(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredMatches, page, rowsPerPage]);

  return (
    <>
      <Paper sx={{ m: 3 }}>
        <Toolbar sx={{ p: 2, justifyContent: "space-between" }}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <TypeSelector
                allDecks={allDecks}
                filterType={filterType}
                setFilterType={setFilterType}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <PlayerSelector
                multi
                filterUser={filterUser}
                setFilterUser={setFilterUser}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setModalOpen(true)}
              >
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
                  <TableRow
                    key={match.id}
                    sx={{
                      backgroundColor:
                        getDeckUserColor(match.winningDeckId) !== "inherit"
                          ? `${getDeckUserColor(match.winningDeckId)}26`
                          : "none",
                    }}
                  >
                    <TableCell align="right">
                      {dateFormatter.format(new Date(match.datePlayed))}
                    </TableCell>
                    <TableCell>{match.matchType}</TableCell>
                    <TableCell
                      sx={{ color: getDeckUserColor(match.winningDeckId) }}
                    >
                      {
                        allDecks.find((deck) => deck.id === match.winningDeckId)
                          ?.deckName
                      }
                    </TableCell>
                    <TableCell>{getParticipantDeckNames(match.id)}</TableCell>
                    {isAdmin && (
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setExistingMatchId(match.id);
                              setModalOpen(true);
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => deleteMatch(match.id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[15, 25, 50]}
          component="div"
          count={filteredMatches.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_event, value) => handleChangePage(value)}
          onRowsPerPageChange={(event) =>
            handleChangeRowsPerPage(event.target.value)
          }
        />
      </Paper>
      <MatchModal open={modalOpen} onClose={() => setModalOpen(false)} editingMatchId={existingMatchId}/>
    </>
  );
};
