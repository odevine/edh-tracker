import { MenuItem, TextField } from "@mui/material";
import { useMemo } from "react";

import { Deck } from "@/API";

export const TypeSelector = (props: {
  allDecks: Deck[];
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
      fullWidth
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
