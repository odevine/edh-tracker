import { FilterAlt } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { ReactNode } from "react";

export interface GenericTableToolbarProps {
  customButtons?: ReactNode[];
  onFilterClick: () => void;
  filterDescription: string;
  quickFilterPlaceholder: string;
}

export const GenericTableToolbar = ({
  customButtons = [],
  onFilterClick,
  filterDescription,
  quickFilterPlaceholder,
}: GenericTableToolbarProps) => (
  <GridToolbarContainer sx={{ px: 2, py: 1 }}>
    <Stack direction="row" alignItems="center" spacing={1} width="100%">
      <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
        <GridToolbarQuickFilter
          placeholder={quickFilterPlaceholder}
          variant="outlined"
          size="small"
        />
        <Typography component="span" color="primary" variant="caption">
          {filterDescription}
        </Typography>
      </Stack>
      <GridToolbarDensitySelector
        slotProps={{ button: { variant: "contained" } }}
      />
      <GridToolbarColumnsButton
        slotProps={{ button: { variant: "contained" } }}
      />
      <Button
        variant="contained"
        size="small"
        onClick={onFilterClick}
        startIcon={<FilterAlt fontSize="small" />}
      >
        filters
      </Button>
      {customButtons.map((btn, i) => (
        <Box key={i}>{btn}</Box>
      ))}
    </Stack>
  </GridToolbarContainer>
);
