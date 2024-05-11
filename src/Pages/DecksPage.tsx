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
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import { Decks, Users } from "@/API";
import { EnhancedTableHead, GradientChip, HeadCell } from "@/Components";
import { useDecks, useTheme, useUser } from "@/Context";
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

const PlayerSelector = (props: {
  allDecks: Decks[];
  allUserProfiles: Users[];
  filterUser: string;
  setFilterUser: (newUser: string) => void;
}) => {
  const { allDecks, allUserProfiles, filterUser, setFilterUser } = props;

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
      }));
  }, [allDecks, allUserProfiles]);

  return (
    <TextField
      select
      size="small"
      value={filterUser}
      label="player"
      onChange={(e) => setFilterUser(e.target.value)}
      sx={{ minWidth: 140 }}
    >
      <MenuItem value="all">all users</MenuItem>
      {userOptions.map((option) => (
        <MenuItem key={option.id} value={option.displayName}>
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

export const DecksPage = (): JSX.Element => {
  const { allDecks } = useDecks();
  const { allUserProfiles } = useUser();
  const { mode } = useTheme();

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

  const userProfileMap = useMemo(() => {
    return new Map(
      allUserProfiles.map((profile) => [
        profile.id,
        {
          displayName: profile.displayName,
          lightThemeColor: profile.lightThemeColor,
          darkThemeColor: profile.darkThemeColor,
        },
      ]),
    );
  }, [allUserProfiles, mode]);

  return (
    <Paper sx={{ m: 3 }}>
      <Toolbar sx={{ p: 2, justifyContent: "space-between" }}>
        <Stack direction="row" spacing={2}>
          <TypeSelector
            allDecks={allDecks}
            filterType={filterType}
            setFilterType={setFilterType}
          />
          <PlayerSelector
            allDecks={allDecks}
            allUserProfiles={allUserProfiles}
            filterUser={filterUser}
            setFilterUser={setFilterUser}
          />
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
                  {userProfileMap.has(deck.deckOwnerID) && (
                    <Typography
                      sx={{
                        color:
                          mode === "light"
                            ? (userProfileMap.get(deck.deckOwnerID) as Users)
                                .lightThemeColor
                            : (userProfileMap.get(deck.deckOwnerID) as Users)
                                .darkThemeColor,
                      }}
                    >
                      {userProfileMap.get(deck.deckOwnerID)?.displayName}
                    </Typography>
                  )}
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
                  {dateFormatter.format(new Date(deck.updatedAt))}
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
