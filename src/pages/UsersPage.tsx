import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { navigate } from "raviger";
import { useEffect, useMemo, useState } from "react";

import { EnhancedTableHead, FormatSelector, HeadCell } from "@/components";
import { LOCAL_STORAGE_VERSION } from "@/constants";
import { useDeck, useMatch, useTheme, useUser } from "@/context";
import {
  ColumnSortOrder,
  UserStats,
  getComparator,
  getUserStats,
} from "@/logic";
import { User } from "@/types";

interface UserWithStats extends User, UserStats {}

const headCells: HeadCell<UserWithStats>[] = [
  { id: "displayName", label: "name", sortable: true },
  {
    id: "deckCount",
    label: "active decks",
    alignment: "right",
    sortable: true,
  },
  { id: "totalWins", label: "wins", alignment: "right", sortable: true },
  { id: "totalMatches", label: "matches", alignment: "right", sortable: true },
  { id: "winRate", label: "win rate", alignment: "right", sortable: true },
];

const localStorageKey = "usersPageState";
const loadStateFromLocalStorage = () => {
  const initialState = {
    stateVersion: LOCAL_STORAGE_VERSION,
    includeUnranked: false,
    includeInactive: false,
    filterFormat: "",
    order: "desc" as ColumnSortOrder,
    orderBy: "matches" as keyof UserWithStats,
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

export const UsersPage = (): JSX.Element => {
  const { allUserProfiles } = useUser();
  const { allDecks } = useDeck();
  const { mode } = useTheme();
  const { allMatches } = useMatch();

  const initialState = loadStateFromLocalStorage();

  const [includeUnranked, setIncludeUnranked] = useState(
    initialState.includeUnranked,
  );
  const [includeInactive, setIncludeInactive] = useState(
    initialState.includeInactive,
  );
  const [filterFormat, setFilterFormat] = useState(initialState.filterFormat);
  const [order, setOrder] = useState<ColumnSortOrder>(initialState.order);
  const [orderBy, setOrderBy] = useState<keyof UserWithStats>(
    initialState.orderBy,
  );
  const [page, setPage] = useState(initialState.page);

  useEffect(() => {
    const newSettings = JSON.stringify({
      stateVersion: LOCAL_STORAGE_VERSION,
      includeUnranked,
      includeInactive,
      filterFormat,
      order,
      orderBy,
      page,
    });
    localStorage.setItem(localStorageKey, newSettings);
  }, [order, orderBy, page, filterFormat, includeUnranked, includeInactive]);

  const handleRequestSort = (property: keyof UserWithStats) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const userProfileMap = useMemo(() => {
    let usersArray = allUserProfiles;
    if (!includeInactive) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      usersArray = usersArray.filter((user) => {
        if (!user.lastOnline) {
          return false;
        }
        const lastOnlineDate = new Date(user.lastOnline);
        if (isNaN(lastOnlineDate.getTime())) {
          return false;
        }
        return lastOnlineDate >= thirtyDaysAgo;
      });
    }
    return new Map(usersArray.map((profile) => [profile.id, profile]));
  }, [allUserProfiles, includeInactive]);

  const userWithStats = useMemo(() => {
    return allUserProfiles.map((user) => {
      const userStats = getUserStats(
        user.id,
        allDecks,
        allMatches,
        filterFormat,
        includeUnranked,
      );
      return { ...user, ...userStats };
    });
  }, [allMatches, filterFormat, includeUnranked, includeInactive]);

  const visibleRows = useMemo(() => {
    return [...userWithStats].sort(
      getComparator<UserWithStats>(order, orderBy, userProfileMap),
    );
  }, [
    order,
    orderBy,
    userWithStats,
    userProfileMap,
    filterFormat,
    includeInactive,
  ]);

  return (
    <Paper sx={{ m: 3 }}>
      <Toolbar sx={{ p: 2, justifyContent: "space-between" }}>
        <Grid container spacing={2}>
          <Grid item xs={0} lg={3} />
          <Grid item xs={12} sm={6} md={4} lg={3}>
            {filterFormat !== "unranked" && (
              <FormControlLabel
                labelPlacement="start"
                label="include unranked matches?"
                sx={{ width: "100%" }}
                control={
                  <Checkbox
                    sx={{ mr: 2, ml: 1 }}
                    checked={includeUnranked}
                    onChange={() => setIncludeUnranked(!includeUnranked)}
                  />
                }
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormControlLabel
              labelPlacement="start"
              label="show inactive users?"
              sx={{ width: "100%" }}
              control={
                <Checkbox
                  sx={{ mr: 2, ml: 1 }}
                  checked={includeInactive}
                  onChange={() => setIncludeInactive(!includeInactive)}
                />
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <FormatSelector
              filterFormat={filterFormat}
              setFilterFormat={(newFormat) => {
                setPage(0);
                setFilterFormat(newFormat);
                if (newFormat === "unranked") {
                  setIncludeUnranked(true);
                }
              }}
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
            {visibleRows.map((user) => {
              const ownerProfileColor = user
                ? mode === "light"
                  ? user.lightThemeColor
                  : user.darkThemeColor
                : undefined;
              return (
                <TableRow
                  key={user.id}
                  sx={{
                    backgroundColor: ownerProfileColor
                      ? `${ownerProfileColor}26`
                      : "none",
                  }}
                >
                  <TableCell>
                    <Typography
                      onClick={() => navigate(`/users/${user.id}`)}
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {user.displayName}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{user.deckCount}</TableCell>
                  <TableCell align="right">{user.totalWins}</TableCell>
                  <TableCell align="right">{user.totalMatches}</TableCell>
                  <TableCell align="right">
                    {user.winRate ? (user.winRate * 100).toFixed(2) + "%" : "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
