import { Add } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { useState } from "react";

import { MatchModal, MatchesTable } from "@/components";
import { useMatch } from "@/hooks";
import { Match } from "@/types";

export const MatchesPage = (): JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const { deleteMatch } = useMatch();

  return (
    <Paper sx={{ height: "100%", minWidth: 740 }}>
      <MatchesTable
        customButtons={[
          <Button
            key="add"
            variant="contained"
            size="small"
            onClick={() => setModalOpen(true)}
            startIcon={<Add fontSize="small" />}
          >
            add match
          </Button>,
        ]}
        onEdit={(match) => {
          setEditingMatch(match);
          setModalOpen(true);
        }}
        onDelete={(match) => {
          if (confirm(`Are you sure you want to delete "${match.id}"?`)) {
            deleteMatch(match.id);
          }
        }}
      />
      <MatchModal
        open={modalOpen}
        editingMatchId={editingMatch?.id}
        onClose={() => {
          setEditingMatch(null);
          setModalOpen(false);
        }}
      />
    </Paper>
  );
};
