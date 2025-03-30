import { MenuItem, TextField } from "@mui/material";

import { useFormat } from "@/hooks";

export const FormatSelector = (props: {
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
      label="format"
      onChange={(e) => setFilterFormat(e.target.value)}
      sx={{ minWidth: 140 }}
    >
      <MenuItem value="">all formats</MenuItem>
      {allFormats.map((format) => (
        <MenuItem key={format.id} value={format.id}>
          {format.displayName}
        </MenuItem>
      ))}
    </TextField>
  );
};
