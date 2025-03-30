import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

import { ColumnSortOrder } from "@/utils";

// Define a type for sortable head cells
export interface SortableHeadCell<T> {
  id: keyof T;
  label: string;
  alignment?: "right" | "left";
  sortable: true;
}

// Define a type for non-sortable head cells
export interface NonSortableHeadCell {
  id?: string;
  label: string;
  alignment?: "right" | "left";
  sortable?: false;
}

// Combine both types into a single HeadCell type
export type HeadCell<T> = SortableHeadCell<T> | NonSortableHeadCell;

export interface EnhancedTableProps<T> {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  order: ColumnSortOrder;
  orderBy: string;
  headCells: HeadCell<T>[];
}

export const EnhancedTableHead = <T,>(props: EnhancedTableProps<T>) => {
  const { order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler =
    (property: keyof T) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id as string}
            align={headCell.alignment ?? "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id as keyof T)}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  {headCell.label}
                </Typography>
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <Typography sx={{ fontWeight: "bold" }}>
                {headCell.label}
              </Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
