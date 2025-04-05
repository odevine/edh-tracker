import { Stack } from "@mui/material";
import { DataGrid, GridRowClassNameParams } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";

import {
  DecksTableFilters,
  DecksTableToolbar,
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
} from "@/hooks";
import { Deck, DeckWithStats } from "@/types";
import { computeDeckStats, getFullColorNames } from "@/utils";

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
  } = useDecksFilters();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const userProfileMap = useMemo(
    () => new Map(allUsers.map((profile) => [profile.id, profile])),
    [allUsers],
  );

  const userColorClasses = useMemo(() => {
    const styles: Record<string, any> = {};
    userProfileMap.forEach((user, key) => {
      const userColor =
        mode === "light" ? user.lightThemeColor : user.darkThemeColor;
      styles[`.user-row-${key}`] = {
        backgroundColor: userColor ? `${userColor}26` : "inherit",
        border: `1px solid transparent`,
        "&:hover": {
          border: (theme: any) => `1px solid ${theme.palette.primary.main}`,
        },
      };
    });
    return styles;
  }, [userProfileMap, mode]);

  const deckCategoriesMap = useMemo(
    () => new Map(allFormats.map((format) => [format.id, format])),
    [allFormats],
  );

  const columns = useMemo(
    () =>
      getDecksColumns({
        hasDeckBeenUsed,
        onEdit,
        onDelete,
        currentUserId: userId as string,
        usersMap: userProfileMap,
        formatsMap: deckCategoriesMap,
        filterFormat: filterFormat,
      }),
    [userProfileMap, deckCategoriesMap, filterFormat],
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
    const clauses: string[] = ["showing"];
    clauses.push(includeInactive ? "all" : "active");
    if (filterFormat) {
      clauses.push(`\"${deckCategoriesMap.get(filterFormat)?.displayName}\"`);
    }
    clauses.push("decks");
    if (filterUser) {
      const userProfile = allUsers.find((profile) => profile.id === filterUser);
      if (userProfile) {
        clauses.push(`owned by ${userProfile.displayName}`);
      }
    }
    if (filterColor.length > 0) {
      clauses.push(
        filterColor.includes("C") && filterColor.length === 1
          ? "that are colorless"
          : `that are ${getFullColorNames(filterColor)}`,
      );
    }
    if (includeUnranked) {
      clauses.push("while including unranked matches in stats");
    }
    return clauses.join(" ");
  }, [
    filterUser,
    filterFormat,
    filterColor,
    includeInactive,
    includeUnranked,
    allUsers,
  ]);

  return (
    <Stack height="100%" minWidth={740}>
      <DataGrid
        ref={gridRef}
        pagination
        disableRowSelectionOnClick
        loading={decksLoading}
        initialState={{
          density: "compact",
          pagination: { paginationModel: { pageSize: 15 } },
        }}
        pageSizeOptions={[15, 25, 50]}
        getRowHeight={() => "auto"}
        rows={filteredDecks}
        columns={columns}
        sx={userColorClasses}
        slots={{
          toolbar: () => (
            <DecksTableToolbar
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
        getRowClassName={(params: GridRowClassNameParams<Deck>) =>
          `user-row-${params.row.userId}`
        }
      />
      <DecksTableFilters
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
