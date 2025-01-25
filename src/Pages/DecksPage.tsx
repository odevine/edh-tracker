import { Add } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { useEffect, useState } from "react";

import { DeckModal, DecksTable } from "@/Components";
import { LOCAL_STORAGE_VERSION } from "@/Constants";
import { ColumnSortOrder, DeckWithStats } from "@/Logic";

const localStorageKey = "decksPageState";
const loadStateFromLocalStorage = () => {
  const initialState = {
    stateVersion: LOCAL_STORAGE_VERSION,
    filterColor: [],
    filterType: "",
    filterUser: "",
    searchQuery: "",
    includeInactive: false,
    includeUnranked: false,
    order: "desc" as ColumnSortOrder,
    orderBy: "updatedAt" as keyof DeckWithStats,
    page: 0,
    rowsPerPage: 15,
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

export const DecksPage = (): JSX.Element => {
  const initialState = loadStateFromLocalStorage();

  const [filterColor, setFilterColor] = useState(initialState.filterColor);
  const [filterType, setFilterType] = useState(initialState.filterType);
  const [filterUser, setFilterUser] = useState(initialState.filterUser);
  const [includeInactive, setIncludeInactive] = useState(
    initialState.includeInactive,
  );
  const [includeUnranked, setIncludeUnranked] = useState(
    initialState.includeUnranked,
  );
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const newSettings = JSON.stringify({
      stateVersion: LOCAL_STORAGE_VERSION,
      filterColor,
      filterType,
      filterUser,
      includeInactive,
      includeUnranked,
      searchQuery: initialState.searchQuery,
      order: initialState.order,
      orderBy: initialState.orderBy,
      page: initialState.page,
      rowsPerPage: initialState.rowsPerPage,
    });
    localStorage.setItem(localStorageKey, newSettings);
  }, [filterColor, filterType, filterUser, includeInactive, includeUnranked]);

  return (
    <Paper sx={{ height: "100%", minWidth: 740 }}>
      <DecksTable
        customButtons={[
          <Button
            key="add"
            variant="contained"
            size="small"
            onClick={() => setModalOpen(true)}
            startIcon={<Add fontSize="small" />}
          >
            add deck
          </Button>,
        ]}
        filterColor={filterColor}
        filterType={filterType}
        filterUser={filterUser}
        includeInactive={includeInactive}
        includeUnranked={includeUnranked}
        setFilterColor={(newColor: string[]) => setFilterColor(newColor)}
        setFilterType={(newType: string) => setFilterType(newType)}
        setFilterUser={(newUser: string | string[]) => setFilterUser(newUser)}
        setIncludeInactive={(checked: boolean) => setIncludeInactive(checked)}
        setIncludeUnranked={(checked: boolean) => setIncludeUnranked(checked)}
      />
      <DeckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Paper>
  );
};
