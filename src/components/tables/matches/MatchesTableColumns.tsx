import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DateTime } from "luxon";

import { Match } from "@/types";

interface ColumnOptions {
  formatLookup: Map<string, string>; // formatId -> displayName
  deckLookup: Map<string, string>; // deckId -> deck name
  showActions?: boolean;
  onEdit?: (match: Match) => void;
  onDelete?: (match: Match) => void;
}

export function getMatchesColumns({
  formatLookup,
  deckLookup,
  showActions = false,
  onEdit,
  onDelete,
}: ColumnOptions): GridColDef[] {
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
        formatLookup.get(String(row.formatId)) ?? "-",
    },
    {
      field: "winningDeckId",
      headerName: "winner",
      minWidth: 180,
      flex: 1,
      valueGetter: (_value, row: Match) =>
        deckLookup.get(String(row.winningDeckId)) ?? "-",
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
          ?.map((p) => deckLookup.get(p.deckId || "") || "")
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
}
