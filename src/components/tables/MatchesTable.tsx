import { Stack } from "@mui/material";
import { DataGrid, GridRowClassNameParams } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";

import {
  GenericTableToolbar,
  MatchesTableFilters,
  buildMatchFilterDescription,
  defaultGridOptions,
  getMatchColumns,
} from "@/components";
import {
  useAuth,
  useDeck,
  useFormat,
  useMatch,
  useMatchesFilters,
  useTheme,
  useUser,
  useUserColorRowClasses,
} from "@/hooks";
import { Match } from "@/types";

interface MatchesTableProps {
  customButtons: JSX.Element[];
  onEdit?: (match: Match) => void;
  onDelete?: (match: Match) => void;
}

export const MatchesTable = ({
  customButtons,
  onEdit,
  onDelete,
}: MatchesTableProps) => {
  const { allDecks } = useDeck();
  const { allFormats } = useFormat();
  const { matchesLoading, getFilteredMatches } = useMatch();
  const { allUsers } = useUser();
  const { isAdmin } = useAuth();
  const { mode } = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const userColorClasses = useUserColorRowClasses(allUsers, mode);
  const {
    filterFormat,
    setFilterFormat,
    filterDecks,
    setFilterDecks,
    filterUsers,
    setFilterUsers,
    resetMatchFilters,
  } = useMatchesFilters();

  const formatMap = useMemo(
    () => new Map(allFormats.map((f) => [f.id, f.displayName])),
    [allFormats],
  );
  const decksMap = useMemo(
    () => new Map(allDecks.map((d) => [d.id, d.displayName])),
    [allDecks],
  );
  const columns = useMemo(
    () =>
      getMatchColumns({
        formatMap,
        decksMap,
        showActions: isAdmin,
        onEdit: isAdmin ? onEdit : undefined,
        onDelete: isAdmin ? onDelete : undefined,
      }),
    [formatMap, decksMap, isAdmin],
  );
  const filteredMatches = useMemo(() => {
    return getFilteredMatches({
      formatId: filterFormat,
      deckIds: filterDecks,
      userIds: filterUsers,
    });
  }, [filterFormat, filterDecks, filterUsers, getFilteredMatches]);
  const filterDescription = useMemo(() => {
    return buildMatchFilterDescription({
      allFormats,
      filterDecks,
      filterFormat,
      filterUsers,
    });
  }, [allFormats, filterDecks, filterFormat, filterUsers]);

  return (
    <Stack height="100%" minWidth={740}>
      <DataGrid
        {...defaultGridOptions}
        ref={gridRef}
        loading={matchesLoading}
        rows={filteredMatches}
        columns={columns}
        sx={userColorClasses}
        getRowClassName={(params: GridRowClassNameParams<Match>) => {
          const winnerDeckId = params.row.winningDeckId;
          const winnerDeck = allDecks.find((d) => d.id === winnerDeckId);
          const userId = winnerDeck?.userId;
          return userId ? `user-row-${userId}` : "";
        }}
        slots={{
          toolbar: () => (
            <GenericTableToolbar
              customButtons={customButtons}
              onFilterClick={() => setAnchorEl(gridRef.current)}
              filterDescription={filterDescription}
              quickFilterPlaceholder="search matches..."
            />
          ),
        }}
        initialState={{
          ...defaultGridOptions.initialState,
          sorting: {
            sortModel: [
              {
                field: "datePlayed",
                sort: "desc",
              },
            ],
          },
        }}
      />
      <MatchesTableFilters
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        resetMatchFilters={resetMatchFilters}
        filterFormat={filterFormat}
        setFilterFormat={setFilterFormat}
        filterDecks={filterDecks}
        setFilterDecks={setFilterDecks}
        filterUsers={filterUsers}
        setFilterUsers={setFilterUsers}
      />
    </Stack>
  );
};
