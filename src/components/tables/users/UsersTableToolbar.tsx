import { FilterAlt } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { ReactNode } from "react";

interface UsersTableToolbarProps {
  customButtons: ReactNode[];
  onFilterClick: () => void;
  filterDescription: string;
  gridRef: React.RefObject<HTMLDivElement>;
}

export const UsersTableToolbar = ({
  customButtons,
  onFilterClick,
  filterDescription,
}: UsersTableToolbarProps) => {
  return (
    <GridToolbarContainer sx={{ px: 2, py: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1} width="100%">
        <GridToolbarQuickFilter placeholder="search users..." />
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarDensitySelector
          slotProps={{
            button: { variant: "outlined" },
            tooltip: { title: "change row density" },
          }}
        />
        <GridToolbarColumnsButton
          slotProps={{
            button: { variant: "outlined" },
            tooltip: { title: "manage column visibility" },
          }}
        />
        <Button
          key="filters"
          variant="outlined"
          size="small"
          onClick={onFilterClick}
          startIcon={<FilterAlt fontSize="small" />}
        >
          filters
        </Button>
        {customButtons.map((button, index) => (
          <Box key={index}>{button}</Box>
        ))}
      </Stack>
      <Typography
        component="span"
        color="primary"
        variant="caption"
        sx={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          flexShrink: 1,
          minWidth: 0,
        }}
      >
        {filterDescription}
      </Typography>
    </GridToolbarContainer>
  );
};
