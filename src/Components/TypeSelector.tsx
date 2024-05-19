import { MenuItem, TextField } from "@mui/material";

import { DECK_TYPES } from "@/Constants";

export const TypeSelector = (props: {
  filterType: string;
  setFilterType: (newType: string) => void;
}) => {
  const { filterType, setFilterType } = props;

  return (
    <TextField
      fullWidth
      select
      size="small"
      value={filterType}
      label="deck type"
      onChange={(e) => setFilterType(e.target.value)}
      sx={{ minWidth: 140 }}
    >
      <MenuItem value="">all types</MenuItem>
      {DECK_TYPES.map((type) => (
        <MenuItem key={type.value} value={type.value}>
          {type.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
