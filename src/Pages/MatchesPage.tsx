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
  TableFooter,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Match } from "@/API";
import {
  DeckSelector,
  EnhancedTableHead,
  HeadCell,
  MatchModal,
  PlayerSelector,
  TypeSelector,
} from "@/Components";
import { LOCAL_STORAGE_VERSION } from "@/Constants";
import { useDeck, useMatch, useUser } from "@/Context";
import { ColumnSortOrder, getComparator } from "@/Logic";

const localStorageKey = "matchesPageState";
const loadStateFromLocalStorage = () => {
  const savedState = localStorage.getItem(localStorageKey);
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    if (parsedState.stateVersion === LOCAL_STORAGE_VERSION) {
      return JSON.parse(savedState);
    }
  }
  return {
    stateVersion: LOCAL_STORAGE_VERSION,
    filterType: "",
    filterUser: [],
    filterDeck: [],
    order: "desc" as ColumnSortOrder,
    orderBy: "datePlayed" as keyof Match,
    page: 0,
    rowsPerPage: 10,
  };
};

export const MatchesPage = (): JSX.Element => {
  const { allDecks, getDeckUserColor } = useDeck();
  const { isAdmin } = useUser();
  const { allMatches, allMatchParticipants, deleteMatch } = useMatch();

  const initialState = loadStateFromLocalStorage();

  const [filterType, setFilterType] = useState(initialState.filterType);
  const [filterDeck, setFilterDeck] = useState(initialState.filterType);
  const [filterUser, setFilterUser] = useState<string | string[]>(
    initialState.filterUser,
  );
  const [order, setOrder] = useState<ColumnSortOrder>(initialState.order);
  const [orderBy, setOrderBy] = useState<keyof Match>(initialState.orderBy);
  const [page, setPage] = useState(initialState.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialState.rowsPerPage);
  const [modalOpen, setModalOpen] = useState(false);
  const [existingMatchId, setExistingMatchId] = useState("");

  useEffect(() => {
    const newSettings = JSON.stringify({
      filterType,
      filterUser,
      filterDeck,
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
        sx={{ color: getDeckUserColor(participant.deckId) }}
      >
        {allDecks.find((deck) => deck.id === participant.deckId)?.deckName}
      </Typography>
    ));
  };

  const filteredMatches = useMemo(() => {
    const userFilterSet = new Set(
      Array.isArray(filterUser) ? filterUser : [filterUser],
    );
    const deckFilterSet = new Set(
      Array.isArray(filterDeck) ? filterDeck : [filterDeck],
    );

    return allMatches.filter((match) => {
      const participants = allMatchParticipants.filter(
        (participant) => participant.matchId === match.id,
      );

      const participantOwnerIds = new Set(
        participants
          .map(
            (participant) =>
              allDecks.find((deck) => deck.id === participant.deckId)
                ?.deckOwnerId,
          )
          .filter(Boolean),
      );

      const participantDeckIds = new Set(
        participants.map((participant) => participant.deckId),
      );

      const userFilterCondition =
        !filterUser.length ||
        [...userFilterSet].every((userId) => participantOwnerIds.has(userId));
      const deckFilterCondition =
        !filterDeck.length ||
        [...deckFilterSet].every((deckId) => participantDeckIds.has(deckId));
      const typeFilterCondition = !filterType || match.matchType === filterType;

      return userFilterCondition && deckFilterCondition && typeFilterCondition;
    });
  }, [
    allMatches,
    allMatchParticipants,
    allDecks,
    filterType,
    filterUser,
    filterDeck,
  ]);

  const visibleRows = useMemo(() => {
    return [...filteredMatches]
      .sort(getComparator<Match>(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredMatches, page, rowsPerPage, order, orderBy]);

  return (
    <>
      <Paper sx={{ m: 3 }}>
        <Toolbar sx={{ p: 2, justifyContent: "space-between" }}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={12} sm={6} md={3} lg={2}>
              <TypeSelector
                filterType={filterType}
                setFilterType={setFilterType}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <DeckSelector
                multi
                filterType={filterType}
                filterDeck={filterDeck}
                setFilterDeck={setFilterDeck}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
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
                      {DateTime.fromISO(match.datePlayed)
                        .setLocale("en-us")
                        .toLocaleString(DateTime.DATE_MED)}
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
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 15, 25]}
                  count={filteredMatches.length}
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
      </Paper>
      <MatchModal
        open={modalOpen}
        onClose={() => {
          setExistingMatchId("");
          setModalOpen(false);
        }}
        editingMatchId={existingMatchId}
      />
    </>
  );
};
