import { MenuItem, TextField } from "@mui/material";

import { useDeck } from "@/Context";

export const TypeSelector = (props: {
  filterType: string;
  setFilterType: (newType: string) => void;
}) => {
  const { filterType, setFilterType } = props;

  const { allDeckCategories } = useDeck();

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
      {allDeckCategories.map((category) => (
        <MenuItem key={category.id} value={category.id}>
          {category.name}
        </MenuItem>
      ))}
    </TextField>
  );
};
