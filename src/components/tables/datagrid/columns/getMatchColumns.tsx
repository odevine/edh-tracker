import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DateTime } from "luxon";

import { Match } from "@/types";

interface MatchColumnOptions {
  formatMap: Map<string, string>;
  decksMap: Map<string, string>;
  showActions?: boolean;
  onEdit?: (match: Match) => void;
  onDelete?: (match: Match) => void;
}

export const getMatchColumns = ({
  formatMap,
  decksMap,
  showActions = false,
  onEdit,
  onDelete,
}: MatchColumnOptions): GridColDef[] => {
  const columns: GridColDef[] = [
    {
      field: "datePlayed",
      headerName: "played on",
      minWidth: 160,
      valueFormatter: (_value, row: Match) =>
        DateTime.fromISO(String(row.datePlayed)).toFormat("MMM d, yyyy"),
    },
    {
      field: "formatId",
      headerName: "format",
      minWidth: 120,
      valueGetter: (_value, row: Match) =>
        formatMap.get(String(row.formatId)) ?? "-",
    },
    {
      field: "winningDeckId",
      headerName: "winner",
      minWidth: 180,
      flex: 1,
      valueGetter: (_value, row: Match) =>
        decksMap.get(String(row.winningDeckId)) ?? "-",
      renderCell: (params: GridRenderCellParams<Match>) => (
        <Typography variant="body2" noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "decks",
      headerName: "decks",
      minWidth: 240,
      flex: 2,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Match>) => {
        const names = params.row.matchParticipants
          ?.map((p) => decksMap.get(p.deckId || "") || "")
          .filter(Boolean);

        return (
          <Stack direction="column" spacing={0.5}>
            {names?.map((name, i) => (
              <Typography variant="body2" key={i}>
                • {name}
              </Typography>
            ))}
          </Stack>
        );
      },
    },
  ];

  if (showActions) {
    columns.push({
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params: GridRenderCellParams<Match>) => (
        <Stack direction="row" spacing={1}>
          {onEdit && (
            <IconButton onClick={() => onEdit(params.row)}>
              <Edit fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton onClick={() => onDelete(params.row)}>
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Stack>
      ),
    });
  }

  return columns;
};
