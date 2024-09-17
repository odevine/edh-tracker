import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";
import { navigate } from "raviger";
import { useEffect, useMemo, useState } from "react";

import { User } from "@/API";
import { EnhancedTableHead, HeadCell, TypeSelector } from "@/Components";
import { LOCAL_STORAGE_VERSION } from "@/Constants";
import { useDeck, useMatch, useTheme, useUser } from "@/Context";
import {
  ColumnSortOrder,
  UserStats,
  getComparator,
  getUserStats,
} from "@/Logic";

interface UserWithStats extends User, UserStats {}

const headCells: HeadCell<UserWithStats>[] = [
  { id: "displayName", label: "name", sortable: true },
  { id: "deckCount", label: "decks", alignment: "right", sortable: true },
  { id: "totalWins", label: "wins", alignment: "right", sortable: true },
  { id: "totalMatches", label: "matches", alignment: "right", sortable: true },
  { id: "winRate", label: "win rate", alignment: "right", sortable: true },
];

const localStorageKey = "usersPageState";
const loadStateFromLocalStorage = () => {
  const initialState = {
    stateVersion: LOCAL_STORAGE_VERSION,
    includeUnranked: false,
    filterType: "",
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
  const { allMatches, allMatchParticipants } = useMatch();
  const theme = useMuiTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const initialState = loadStateFromLocalStorage();

  const [includeUnranked, setIncludeUnranked] = useState(
    initialState.includeUnranked,
  );
  const [filterType, setFilterType] = useState(initialState.filterType);
  const [order, setOrder] = useState<ColumnSortOrder>(initialState.order);
  const [orderBy, setOrderBy] = useState<keyof UserWithStats>(
    initialState.orderBy,
  );
  const [page, setPage] = useState(initialState.page);

  useEffect(() => {
    const newSettings = JSON.stringify({
      stateVersion: LOCAL_STORAGE_VERSION,
      includeUnranked,
      filterType,
      order,
      orderBy,
      page,
    });
    localStorage.setItem(localStorageKey, newSettings);
  }, [order, orderBy, page, filterType, includeUnranked]);

  const handleRequestSort = (property: keyof UserWithStats) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const userProfileMap = useMemo(() => {
    return new Map(allUserProfiles.map((profile) => [profile.id, profile]));
  }, [allUserProfiles]);

  const userWithStats = useMemo(() => {
    return allUserProfiles.map((user) => {
      const userStats = getUserStats(
        user.id,
        allDecks,
        allMatches,
        allMatchParticipants,
        filterType,
        includeUnranked,
      );
      return { ...user, ...userStats };
    });
  }, [allMatches, allMatchParticipants, filterType, includeUnranked]);

  const visibleRows = useMemo(() => {
    return [...userWithStats].sort(
      getComparator<UserWithStats>(order, orderBy, userProfileMap),
    );
  }, [order, orderBy, userWithStats, userProfileMap, filterType]);

  return (
    <Paper sx={{ m: 3 }}>
      <Toolbar sx={{ p: 2, justifyContent: "space-between" }}>
        <Grid container spacing={2}>
          <Grid item xs={0} sm={0} md={4} lg={6} />
          <Grid item xs={12} sm={6} md={4} lg={3}>
            {filterType !== "none" && <FormControlLabel
              labelPlacement="start"
              label="include unranked?"
              sx={{ width: "100%" }}
              control={
                <Checkbox
                  sx={{ mr: 2, ml: 1 }}
                  checked={includeUnranked}
                  onChange={() => setIncludeUnranked(!includeUnranked)}
                />
              }
            />}
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TypeSelector
              filterType={filterType}
              setFilterType={(newType) => {
                setPage(0);
                setFilterType(newType);
                if (newType === "none") {
                  setIncludeUnranked(true);
                }
              }}
            />
          </Grid>
        </Grid>
      </Toolbar>
      {isSmallScreen ? (
        <Box>
          <Grid container sx={{ px: 2 }} spacing={1}>
            <Grid item xs={6}>
              <Select
                fullWidth
                displayEmpty
                size="small"
                value={orderBy}
                onChange={(e) =>
                  setOrderBy(e.target.value as keyof UserWithStats)
                }
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
          {visibleRows.map((user) => {
            const ownerProfileColor = user
              ? mode === "light"
                ? user.lightThemeColor
                : user.darkThemeColor
              : undefined;

            return (
              <Box key={user.id}>
                <Grid container sx={{ px: 2, py: 1 }}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      sx={{ color: ownerProfileColor }}
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      {user.displayName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">decks:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{user.deckCount}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">wins:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{user.totalWins}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">matches:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{user.totalMatches}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">win&nbsp;rate:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      {(user.winRate * 100).toFixed(2)}%
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
              </Box>
            );
          })}
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
      )}
    </Paper>
  );
};
