import { DataGridProps } from "@mui/x-data-grid";

export const defaultGridOptions: Partial<DataGridProps> = {
  pagination: true,
  disableRowSelectionOnClick: true,
  initialState: {
    density: "compact",
    pagination: { paginationModel: { pageSize: 15 } },
  },
  pageSizeOptions: [15, 25, 50],
  getRowHeight: () => "auto",
  slotProps: {
    loadingOverlay: {
      variant: "skeleton",
      noRowsVariant: "skeleton",
    },
  },
};
