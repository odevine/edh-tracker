import { Add } from "@mui/icons-material";
import { Button, Paper } from "@mui/material";
import { useState } from "react";

import { DeckModal, DecksTable } from "@/components";
import { useDeck } from "@/hooks";
import { Deck } from "@/types";

export const DecksPage = (): JSX.Element => {
  const { deleteDeckById, updateExistingDeck } = useDeck();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  return (
    <Paper sx={{ height: "100%", minWidth: 740 }}>
      <DecksTable
        onEdit={(deck: Deck) => {
          setEditingDeck(deck);
          setModalOpen(true);
        }}
        onDelete={(deck: Deck) => {
          if (
            confirm(
              `are you sure you want to delete deck "${deck.displayName}"?`,
            )
          ) {
            deleteDeckById(deck.id);
          }
        }}
        onActiveToggle={(deck: Deck) => {
          const { id, createdAt, updatedAt, ...updateInput } = deck;
          updateExistingDeck({
            deckId: id,
            input: {
              ...updateInput,
              inactive: !deck.inactive,
            },
          });
        }}
        customButtons={[
          <Button
            key="add"
            variant="contained"
            size="small"
            onClick={() => {
              setEditingDeck(null);
              setModalOpen(true);
            }}
            startIcon={<Add fontSize="small" />}
          >
            add deck
          </Button>,
        ]}
      />
      <DeckModal
        open={modalOpen}
        editingDeckId={editingDeck?.id}
        onClose={() => {
          setEditingDeck(null);
          setModalOpen(false);
        }}
      />
    </Paper>
  );
};
