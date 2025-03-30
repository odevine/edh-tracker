import { Add } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { useState } from "react";

import { DeckModal, DecksTable } from "@/components";

export const DecksPage = (): JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Paper sx={{ height: "100%", minWidth: 740 }}>
      <DecksTable
        customButtons={[
          <Button
            key="add"
            variant="contained"
            size="small"
            onClick={() => setModalOpen(true)}
            startIcon={<Add fontSize="small" />}
          >
            add deck
          </Button>,
        ]}
      />
      <DeckModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Paper>
  );
};
