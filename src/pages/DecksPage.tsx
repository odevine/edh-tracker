import { Add } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { useEffect, useState } from "react";

import { DeckModal, DecksTable } from "@/components";
import { LOCAL_STORAGE_VERSION } from "@/constants";
import { ColumnSortOrder, DeckWithStats } from "@/logic";

const localStorageKey = "decksPageState";
const loadStateFromLocalStorage = () => {
  const initialState = {
    stateVersion: LOCAL_STORAGE_VERSION,
    filterColor: [],
    filterFormat: "",
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
  const [filterFormat, setFilterFormat] = useState(initialState.filterType);
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
      filterFormat,
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
  }, [filterColor, filterFormat, filterUser, includeInactive, includeUnranked]);

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
        filterFormat={filterFormat}
        filterUser={filterUser}
        includeInactive={includeInactive}
        includeUnranked={includeUnranked}
        setFilterColor={(newColor: string[]) => setFilterColor(newColor)}
        setFilterFormat={(newType: string) => setFilterFormat(newType)}
        setFilterUser={(newUser: string | string[]) => setFilterUser(newUser)}
        setIncludeInactive={(checked: boolean) => setIncludeInactive(checked)}
        setIncludeUnranked={(checked: boolean) => setIncludeUnranked(checked)}
      />
      <DeckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Paper>
  );
};
