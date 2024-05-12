import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { Users } from "@/API";
import { DeckModal } from "@/Components";
import { useDecks } from "@/Context";

export const UserDecksCard = (props: {
  ownUser: boolean;
  userProfile: Users;
}) => {
  const { ownUser, userProfile } = props;
  const { allDecks, deleteDeckById } = useDecks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState("");

  const userDecks = allDecks.filter(
    (deck) => deck.deckOwnerID === userProfile.id,
  );

  return (
    <>
      <Card>
        <CardHeader
          title={`${ownUser ? "your" : `${userProfile.displayName}'${userProfile.displayName.slice(-1) !== "s" ? "s" : ""}`} decks`}
        />
        <Divider />
        <CardContent sx={{ minHeight: 154, overflowX: "auto" }}>
          {userDecks.length === 0 ? (
            <Stack justifyContent="center" alignItems="center" sx={{ pt: 3 }}>
              <Typography variant="h5">no decks found</Typography>
              <Typography variant="caption">
                click 'add deck' to get started
              </Typography>
            </Stack>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography sx={{ fontWeight: "bold" }}>name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: "bold" }}>
                      commander
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: "bold" }}>type</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: "bold" }}>cost</Typography>
                  </TableCell>
                  {ownUser && (
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: "bold" }}>
                        actions
                      </Typography>
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {userDecks.map((deck) => (
                  <TableRow key={deck.id}>
                    <TableCell>
                      {deck.link ? (
                        <Link
                          href={deck.link}
                          target="_blank"
                          sx={{
                            color: (theme) => theme.palette.text.primary,
                            fontWeight: "bold",
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {deck.deckName}
                        </Link>
                      ) : (
                        deck.deckName
                      )}
                    </TableCell>
                    <TableCell>{deck.commanderName}</TableCell>
                    <TableCell>{deck.deckType}</TableCell>
                    <TableCell align="right">
                      {deck.cost?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      }) ?? "-"}
                    </TableCell>
                    {ownUser && (
                      <TableCell align="right">
                        <Stack direction="row" justifyContent="flex-end">
                          <Tooltip arrow title="edit deck">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setEditingDeckId(deck.id);
                                setModalOpen(true);
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {/* TODO: deleting decks should not be an option if it appears as any match participant */}
                          <Tooltip arrow title="delete deck">
                            <IconButton
                              size="small"
                              onClick={() => deleteDeckById(deck.id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {ownUser && (
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={() => setModalOpen(true)}>
              add deck
            </Button>
          </CardActions>
        )}
      </Card>
      <DeckModal
        editingDeckId={editingDeckId}
        open={modalOpen}
        onClose={() => {
          setEditingDeckId("");
          setModalOpen(false);
        }}
      />
    </>
  );
};
