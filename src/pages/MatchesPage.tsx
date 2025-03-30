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

import {
  DeckSelector,
  EnhancedTableHead,
  FormatSelector,
  HeadCell,
  MatchModal,
  PlayerSelector,
} from "@/components";
import { LOCAL_STORAGE_VERSION } from "@/constants";
import { useAuth, useDeck, useFormat, useMatch } from "@/context";
import { ColumnSortOrder, getComparator } from "@/logic";
import { Match } from "@/types";

const localStorageKey = "matchesPageState";
const loadStateFromLocalStorage = () => {
  const initialState = {
    stateVersion: LOCAL_STORAGE_VERSION,
    filterFormat: "",
    filterUser: [],
    filterDeck: [],
    order: "desc" as ColumnSortOrder,
    orderBy: "datePlayed" as keyof Match,
    page: 0,
    rowsPerPage: 10,
  };

  const savedState = localStorage.getItem(localStorageKey);

  if (savedState) {
    const parsedState = JSON.parse(savedState);
    if (parsedState.stateVersion === LOCAL_STORAGE_VERSION) {
      return parsedState;
    } else {
      localStorage.removeItem(localStorageKey);
      localStorage.setItem(localStorageKey, JSON.stringify(initialState));
    }
  }
  return initialState;
};

export const MatchesPage = (): JSX.Element => {
  const { allDecks, getDeckUserColor } = useDeck();
  const { isAdmin } = useAuth();
  const { allFormats } = useFormat();
  const { allMatches, deleteMatch } = useMatch();

  const initialState = loadStateFromLocalStorage();

  const [filterFormat, setFilterFormat] = useState<string>(
    initialState.filterFormat,
  );
  const [filterDeck, setFilterDeck] = useState<string[] | string>(
    initialState.filterDeck,
  );
  const [filterUser, setFilterUser] = useState<string[] | string>(
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
      stateVersion: LOCAL_STORAGE_VERSION,
      filterFormat,
      filterUser,
      filterDeck,
      order,
      orderBy,
      page,
      rowsPerPage,
    });
    localStorage.setItem(localStorageKey, newSettings);
  }, [order, orderBy, page, rowsPerPage, filterFormat, filterUser, filterDeck]);

  const headCells: HeadCell<Match>[] = [
    {
      id: "datePlayed",
      label: "date",
      sortable: true,
      alignment: "right",
    },
    {
      id: "formatId",
      label: "format",
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

  const getParticipantDeckNames = (match: Match) => {
    return match.matchParticipants?.map((participant) => (
      <Typography key={participant.id} variant="body2">
        •&nbsp;
        {allDecks.find((deck) => deck.id === participant.deckId)?.displayName}
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
      const participantOwnerIds = new Set(
        match.matchParticipants
          ?.map(
            (participant) =>
              allDecks.find((deck) => deck.id === participant.deckId)?.userId,
          )
          .filter(Boolean),
      );

      const participantDeckIds = new Set(
        match.matchParticipants?.map((participant) => participant.deckId),
      );

      const userFilterCondition =
        !filterUser.length ||
        [...userFilterSet].every((userId) => participantOwnerIds.has(userId));
      const deckFilterCondition =
        !filterDeck.length ||
        [...deckFilterSet].every((deckId) => participantDeckIds.has(deckId));
      const typeFilterCondition =
        !filterFormat || match.formatId === filterFormat;

      return userFilterCondition && deckFilterCondition && typeFilterCondition;
    });
  }, [allMatches, allDecks, filterFormat, filterUser, filterDeck]);

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
              <FormatSelector
                filterFormat={filterFormat}
                setFilterFormat={(newFormat: string) => {
                  setPage(0);
                  setFilterFormat(newFormat);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <DeckSelector
                multi
                filterFormat={filterFormat}
                filterDeck={filterDeck}
                setFilterDeck={(newDecks: string | string[]) => {
                  setPage(0);
                  setFilterDeck(newDecks);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={4}>
              <PlayerSelector
                multi
                filterUser={filterUser}
                setFilterUser={(newUsers: string | string[]) => {
                  setPage(0);
                  setFilterUser(newUsers);
                }}
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
                    <TableCell>
                      {allFormats.find((format) => format.id === match.formatId)
                        ?.displayName ?? "-"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {
                        allDecks.find((deck) => deck.id === match.winningDeckId)
                          ?.displayName
                      }
                    </TableCell>
                    <TableCell>{getParticipantDeckNames(match)}</TableCell>
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
