import { Button, Popover, Stack } from "@mui/material";
import { ReactNode } from "react";

export const FilterPopoverWrapper = ({
  anchorEl,
  onClose,
  handleResetFilters,
  children,
}: {
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  handleResetFilters: () => void;
  children: ReactNode;
}) => (
  <Popover
    open={Boolean(anchorEl)}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    sx={{ mt: "60px" }}
  >
    <Stack spacing={2} sx={{ p: 2, minWidth: 400 }}>
      {children}
      <Button size="small" variant="contained" onClick={handleResetFilters}>
        Reset Filters
      </Button>
    </Stack>
  </Popover>
);
