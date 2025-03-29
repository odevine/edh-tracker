import {
  Autocomplete,
  Box,
  Chip,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { useCallback, useMemo } from "react";

type ColorOption = {
  id: string;
  label: string;
  className: string;
};

const colorOptions: ColorOption[] = [
  { id: "C", label: "colorless", className: "ms ms-c" },
  { id: "W", label: "white", className: "ms ms-w" },
  { id: "U", label: "blue", className: "ms ms-u" },
  { id: "B", label: "black", className: "ms ms-b" },
  { id: "R", label: "red", className: "ms ms-r" },
  { id: "G", label: "green", className: "ms ms-g" },
];

type ColorSelectorProps = {
  filterColor: string[];
  setFilterColor: (newColor: string[]) => void;
};

export const ColorSelector = ({
  filterColor,
  setFilterColor,
}: ColorSelectorProps) => {
  const selectedOptions = useMemo(
    () =>
      filterColor
        .map((id) => colorOptions.find((option) => option.id === id))
        .filter((option): option is ColorOption => option !== undefined),
    [filterColor],
  );

  const handleColorChange = useCallback(
    (newValue: ColorOption[]) => {
      const containsC = newValue.some((option) => option.id === "C");

      if (newValue.length > filterColor.length) {
        const newestValue = newValue[newValue.length - 1];

        if (newestValue.id === "C" || containsC) {
          setFilterColor([newestValue.id]);
        } else {
          setFilterColor(newValue.map((option) => option.id));
        }
      } else {
        setFilterColor(newValue.map((option) => option.id));
      }
    },
    [filterColor, setFilterColor],
  );

  return (
    <Autocomplete
      size="small"
      multiple
      disableCloseOnSelect
      onChange={(_event, newValue) => handleColorChange(newValue)}
      options={colorOptions}
      getOptionLabel={(option) => option?.label ?? ""}
      value={selectedOptions}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          label="colors"
          fullWidth
          placeholder={filterColor.length ? "" : "select colors"}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) =>
          option ? (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              variant="outlined"
              size="small"
              label={
                <Tooltip title={option.label} placement="top" arrow>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      maxWidth: 120,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Box component="i" className={option.className} />
                  </Box>
                </Tooltip>
              }
            />
          ) : null,
        )
      }
      renderOption={(props, option) =>
        option ? (
          <MenuItem {...props} key={option.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <Box component="i" className={option.className} />
              <Box component="span" sx={{ ml: 1 }}>
                {option.label}
              </Box>
            </Box>
          </MenuItem>
        ) : null
      }
      fullWidth
      sx={{ minWidth: 140 }}
    />
  );
};
