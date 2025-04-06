import { Stack } from "@mui/material";
import { DataGrid, GridRowClassNameParams } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";

import {
  DecksTableFilters,
  GenericTableToolbar,
  buildDeckFilterDescription,
  defaultGridOptions,
  getDecksColumns,
} from "@/components";
import {
  useAuth,
  useDeck,
  useDecksFilters,
  useFormat,
  useMatch,
  useTheme,
  useUser,
  useUserColorRowClasses,
} from "@/hooks";
import { Deck, DeckWithStats } from "@/types";
import { computeDeckStats } from "@/utils";

interface IDecksTableProps {
  customButtons: JSX.Element[];
  onEdit: (deck: Deck) => void;
  onDelete: (deck: Deck) => void;
}

export const DecksTable = ({
  customButtons,
  onEdit,
  onDelete,
}: IDecksTableProps) => {
  const { userId } = useAuth();
  const { allUsers } = useUser();
  const { getFilteredDecks, decksLoading } = useDeck();
  const { allFormats } = useFormat();
  const { hasDeckBeenUsed } = useMatch();
  const { mode } = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const {
    filterColor,
    setFilterColor,
    filterFormat,
    setFilterFormat,
    filterUser,
    setFilterUser,
    includeInactive,
    setIncludeInactive,
    includeUnranked,
    setIncludeUnranked,
    resetDeckFilters,
  } = useDecksFilters();

  const userProfileMap = useMemo(
    () => new Map(allUsers.map((profile) => [profile.id, profile])),
    [allUsers],
  );

  const formatsMap = useMemo(
    () => new Map(allFormats.map((format) => [format.id, format])),
    [allFormats],
  );

  const userColorClasses = useUserColorRowClasses(allUsers, mode);

  const columns = useMemo(
    () =>
      getDecksColumns({
        hasDeckBeenUsed,
        onEdit,
        onDelete,
        currentUserId: userId as string,
        usersMap: userProfileMap,
        formatsMap,
        filterFormat: filterFormat,
      }),
    [userProfileMap, formatsMap, filterFormat],
  );

  const filteredDecks: DeckWithStats[] = useMemo(() => {
    const baseDecks = getFilteredDecks({
      includeInactive,
      filterUser,
      filterFormat,
      filterColor,
    });

    const computed = computeDeckStats(baseDecks, includeUnranked);
    // sort decks so that the most recently updated appear first
    return [...computed].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [
    includeInactive,
    filterUser,
    filterFormat,
    filterColor,
    includeUnranked,
    getFilteredDecks,
  ]);

  const filterDescription = useMemo(() => {
    return buildDeckFilterDescription({
      allFormats,
      allUsers,
      filterColor,
      filterFormat,
      filterUser,
      includeInactive,
      includeUnranked,
    });
  }, [
    allFormats,
    allUsers,
    filterColor,
    filterFormat,
    filterUser,
    includeInactive,
    includeUnranked,
  ]);

  return (
    <Stack height="100%" minWidth={740}>
      <DataGrid
        {...defaultGridOptions}
        ref={gridRef}
        loading={decksLoading}
        rows={filteredDecks}
        columns={columns}
        sx={userColorClasses}
        getRowClassName={(params: GridRowClassNameParams<Deck>) =>
          `user-row-${params.row.userId}`
        }
        slots={{
          toolbar: () => (
            <GenericTableToolbar
              customButtons={customButtons}
              onFilterClick={() => setAnchorEl(gridRef.current)}
              filterDescription={filterDescription}
              quickFilterPlaceholder="search decks..."
            />
          ),
        }}
      />
      <DecksTableFilters
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        resetDeckFilters={resetDeckFilters}
        filterColor={filterColor}
        setFilterColor={setFilterColor}
        filterFormat={filterFormat}
        setFilterFormat={setFilterFormat}
        filterUser={filterUser}
        setFilterUser={setFilterUser as (newUser: string | string[]) => void}
        includeInactive={includeInactive}
        setIncludeInactive={setIncludeInactive}
        includeUnranked={includeUnranked}
        setIncludeUnranked={setIncludeUnranked}
      />
    </Stack>
  );
};
