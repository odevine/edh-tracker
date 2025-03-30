import { MenuItem, TextField } from "@mui/material";

import { useFormat } from "@/context";

export const TypeSelector = (props: {
  filterFormat: string;
  setFilterFormat: (newType: string) => void;
}) => {
  const { filterFormat, setFilterFormat } = props;

  const { allFormats } = useFormat();

  return (
    <TextField
      fullWidth
      select
      size="small"
      value={filterFormat}
      label="deck type"
      onChange={(e) => setFilterFormat(e.target.value)}
      sx={{ minWidth: 140 }}
    >
      <MenuItem value="">all types</MenuItem>
      {allFormats.map((format) => (
        <MenuItem key={format.id} value={format.id}>
          {format.displayName}
        </MenuItem>
      ))}
    </TextField>
  );
};
