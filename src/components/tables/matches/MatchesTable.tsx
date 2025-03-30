import { Stack } from "@mui/material";
import { DataGrid, GridRowClassNameParams } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";

import {
  MatchesTableFilters,
  MatchesTableToolbar,
  getMatchesColumns,
} from "@/components";
import {
  useAuth,
  useDeck,
  useFormat,
  useMatch,
  useTheme,
  useUser,
} from "@/context";
import { useMatchesFilters } from "@/hooks";
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
  const { allUserProfiles } = useUser();
  const { isAdmin } = useAuth();
  const { mode } = useTheme();

  const {
    filterFormat,
    setFilterFormat,
    filterDecks,
    setFilterDecks,
    filterUsers,
    setFilterUsers,
  } = useMatchesFilters();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const formatLookup = useMemo(
    () => new Map(allFormats.map((f) => [f.id, f.displayName])),
    [allFormats],
  );

  const deckLookup = useMemo(
    () => new Map(allDecks.map((d) => [d.id, d.displayName])),
    [allDecks],
  );

  const userColorClasses = useMemo(() => {
    const styles: Record<string, any> = {};
    allUserProfiles.forEach((user) => {
      const color =
        mode === "light" ? user.lightThemeColor : user.darkThemeColor;
      if (color) {
        styles[`.user-row-${user.id}`] = {
          backgroundColor: `${color}26`,
          border: `1px solid transparent`,
          "&:hover": {
            border: (theme: any) => `1px solid ${theme.palette.primary.main}`,
          },
        };
      }
    });
    return styles;
  }, [allUserProfiles, mode]);

  const filteredMatches = useMemo(() => {
    return getFilteredMatches({
      formatId: filterFormat,
      deckIds: filterDecks,
      userIds: filterUsers,
    });
  }, [filterFormat, filterDecks, filterUsers, getFilteredMatches]);

  const filterDescription = useMemo(() => {
    const clauses: string[] = ["showing matches"];
    if (filterFormat) {
      const format = allFormats.find((f) => f.id === filterFormat);
      if (format) {
        clauses.push(`in format \"${format.displayName}\"`);
      }
    }
    if (filterDecks.length > 0) {
      clauses.push("filtered by selected decks");
    }
    if (filterUsers.length > 0) {
      clauses.push("filtered by selected users");
    }
    return clauses.join(" ");
  }, [filterFormat, filterDecks, filterUsers, allFormats]);

  return (
    <Stack height="100%" minWidth={740}>
      <DataGrid
        ref={gridRef}
        pagination
        disableRowSelectionOnClick
        loading={matchesLoading}
        initialState={{
          density: "compact",
          pagination: { paginationModel: { pageSize: 15 } },
          sorting: {
            sortModel: [
              {
                field: "datePlayed",
                sort: "desc",
              },
            ],
          },
        }}
        pageSizeOptions={[15, 25, 50]}
        getRowHeight={() => "auto"}
        rows={filteredMatches}
        columns={getMatchesColumns({
          formatLookup,
          deckLookup,
          showActions: isAdmin,
          onEdit: isAdmin ? onEdit : undefined,
          onDelete: isAdmin ? onDelete : undefined,
        })}
        sx={userColorClasses}
        slots={{
          toolbar: () => (
            <MatchesTableToolbar
              customButtons={customButtons}
              onFilterClick={() => setAnchorEl(gridRef.current)}
              filterDescription={filterDescription}
              gridRef={gridRef}
            />
          ),
        }}
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
        getRowClassName={(params: GridRowClassNameParams<Match>) => {
          const winnerDeckId = params.row.winningDeckId;
          const winnerDeck = allDecks.find((d) => d.id === winnerDeckId);
          const userId = winnerDeck?.userId;
          return userId ? `user-row-${userId}` : "";
        }}
      />
      <MatchesTableFilters
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
