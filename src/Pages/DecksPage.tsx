import {
  Link,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
} from "@mui/material";
import { useMemo, useState } from "react";

import { Decks } from "@/API";
import { EnhancedTableHead, GradientChip, HeadCell } from "@/Components";
import { useDecks, useUser } from "@/Context";
import { ColumnSortOrder, getComparator } from "@/Logic";

const headCells: HeadCell<Decks>[] = [
  {
    id: "deckName",
    label: "name",
  },
  {
    id: "deckOwnerID",
    label: "player",
  },
  {
    id: "deckType",
    label: "type",
  },
  {
    id: "commanderName",
    label: "commander",
  },
  {
    id: "cost",
    label: "cost",
    alignment: "right",
  },
  {
    id: "updatedAt",
    label: "last updated",
    alignment: "right",
  },
];

export const DecksPage = (): JSX.Element => {
  const { allDecks } = useDecks();
  const { allUserProfiles } = useUser();

  const [filterType, setFilterType] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState<ColumnSortOrder>("desc");
  const [orderBy, setOrderBy] = useState<keyof Decks>("updatedAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property: keyof Decks) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: string) => {
    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  };

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
  }, [allDecks, searchQuery, filterType]);

  const visibleRows = useMemo(() => {
    // First, create a shallow copy of the rows array and then sort it
    return [...filteredDecks]
      .sort(getComparator<Decks>(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [order, orderBy, page, rowsPerPage, filteredDecks]);

  return (
    <Paper sx={{ m: 3 }}>
      <Toolbar sx={{ p: 2, justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2}>
            <TextField
              select
              size="small"
              value={filterType}
              label="type"
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="all">all types</MenuItem>
              {[...new Set(allDecks.map((deck) => deck.deckType))].map(
                (type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ),
              )}
            </TextField>
            <TextField
              select
              size="small"
              value={filterUser}
              label="player"
              onChange={(e) => setFilterUser(e.target.value)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="all">all users</MenuItem>
              {[
                ...new Set(
                  allUserProfiles.map((profile) => profile.displayName),
                ),
              ].map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            size="small"
            label="search decks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 140 }}
          />
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
            {visibleRows.map((deck) => (
              <TableRow key={deck.id}>
                <TableCell>
                  {deck.link ? (
                    <Link
                      href={deck.link ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {deck.deckName}
                    </Link>
                  ) : (
                    deck.deckName
                  )}
                </TableCell>
                <TableCell>
                  {
                    allUserProfiles.find(
                      (profile) => profile.id === deck.deckOwnerID,
                    )?.displayName
                  }
                </TableCell>
                <TableCell>{deck.deckType}</TableCell>
                <TableCell>
                  <GradientChip
                    label={deck.commanderName}
                    colors={deck.commanderColors ?? []}
                  />
                </TableCell>
                <TableCell align="right">
                  {deck.cost
                    ? deck.cost?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })
                    : ""}
                </TableCell>
                <TableCell align="right">
                  {new Date(deck.updatedAt).toLocaleString("en-us", {
                    dateStyle: "medium",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
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