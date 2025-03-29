import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import { CreateMatchInput, Deck } from "@/API";
import { useDeck, useMatch, useUser } from "@/context";

interface NewMatchModalProps {
  open: boolean;
  onClose: () => void;
  editingMatchId?: string;
}

export const MatchModal: React.FC<NewMatchModalProps> = ({
  open,
  onClose,
  editingMatchId,
}) => {
  const { allDecks, allDeckCategories, getDeckUserColor, deckToUserMap } = useDeck();
  const { authenticatedUser } = useUser();
  const {
    createNewMatch,
    allMatches,
    allMatchParticipants,
    updateMatchWithParticipants,
  } = useMatch();

  // Find the editing deck based on the editingDeckId
  const editingMatch = allMatches.find((match) => match.id === editingMatchId);

  const [loading, setLoading] = useState(false);
  const [matchType, setMatchType] = useState(allDeckCategories[0]?.id ?? "");
  const [datePlayed, setDatePlayed] = useState(DateTime.now());
  const [winningDeckId, setWinningDeckId] = useState("");
  const [participantDecks, setParticipantDecks] = useState<Deck[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // update state when editingDeck changes
  useEffect(() => {
    if (editingMatch?.datePlayed) {
      setMatchType(editingMatch.matchType);
      setWinningDeckId(editingMatch.winningDeckId);
      // set match date
      const existingDateTime = DateTime.fromISO(editingMatch.datePlayed);
      if (existingDateTime.isValid) {
        setDatePlayed(existingDateTime);
      } else {
        setDatePlayed(DateTime.now());
      }
      // set match decks
      const existingMatchDeckIds = new Set(
        allMatchParticipants
          .filter((participant) => participant.matchId === editingMatch.id)
          .map((participant) => participant.deckId),
      );
      const participantDecks = allDecks.filter((deck) =>
        existingMatchDeckIds.has(deck.id),
      );
      setParticipantDecks(participantDecks);
    } else {
      setMatchType(allDeckCategories[0]?.id ?? "");
      setDatePlayed(DateTime.now());
      setWinningDeckId("");
      setParticipantDecks([]);
      setErrors([]);
    }
  }, [editingMatch, open, allDeckCategories]);

  const validateForm = (): boolean => {
    const localErrors: string[] = [];
    if (participantDecks.length < 2) {
      localErrors.push("please select at least two decks");
    }
    if (!winningDeckId) {
      localErrors.push("please select a winning deck.");
    }
    setErrors(localErrors);
    return localErrors.length === 0;
  };

  const handleDeckClear = async (reason: string) => {
    if (reason === "clear") {
      setWinningDeckId("");
    }
  };

  const handleClose = () => {
    setDatePlayed(DateTime.now());
    setMatchType(allDeckCategories[0].id);
    setParticipantDecks([]);
    setWinningDeckId("");
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authenticatedUser) {
      console.error("User is not authenticated");
      return;
    }

    if (validateForm()) {
      const matchData: CreateMatchInput = {
        winningDeckId: winningDeckId,
        datePlayed: datePlayed.toFormat("yyyy-MM-dd"),
        matchType,
        isArchived: false,
      };
      setLoading(true);
      try {
        if (editingMatch) {
          await updateMatchWithParticipants(
            { ...matchData, id: editingMatch.id },
            participantDecks.map((deck) => deck.id),
          );
        } else {
          await createNewMatch(
            matchData,
            participantDecks.map((deck) => deck.id),
          );
        }
      } finally {
        setLoading(false);
        handleClose();
      }
    }
  };

  const filteredDecks = useMemo(() => {
    return allDecks
      .filter((deck) => !deck.isInactive && (matchType === "none" || deck.deckType === matchType))
      .sort((a, b) => a.deckOwnerId.localeCompare(b.deckOwnerId));
  }, [allDecks, matchType]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: (theme) => theme.palette.background.paper,
          borderRadius: 1,
          boxShadow: 24,
          pt: 2,
          px: 4,
          pb: 3,
          minWidth: { xs: 310, sm: 480 },
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          {editingMatch ? "edit" : "add"} match
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} xl={6}>
            <DatePicker
              label="match date"
              value={datePlayed}
              onChange={(newValue) => newValue && setDatePlayed(newValue)}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </Grid>
          <Grid item xs={12} xl={6}>
            <TextField
              select
              required
              fullWidth
              label="match type"
              value={matchType}
              onChange={(event) => {
                setMatchType(event.target.value);
                setParticipantDecks([]);
                setWinningDeckId("");
              }}
            >
              {allDeckCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} xl={6}>
            <Autocomplete
              multiple
              fullWidth
              value={participantDecks}
              options={filteredDecks}
              getOptionLabel={(deck) =>
                `${deckToUserMap.get(deck.id)?.displayName} ${deck.deckName}`
              }
              onInputChange={(_event, _value, reason) =>
                handleDeckClear(reason)
              }
              filterSelectedOptions
              onChange={(_event, newValue) => {
                setParticipantDecks(newValue);
                if (!newValue.map((deck) => deck.id).includes(winningDeckId)) {
                  setWinningDeckId("");
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="decks" fullWidth required />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    variant="outlined"
                    label={
                      <Tooltip title={option.deckName} placement="top" arrow>
                        <Box
                          sx={{
                            maxWidth: 120,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: getDeckUserColor(option.id),
                          }}
                        >
                          {`${deckToUserMap.get(option.id)?.displayName} - ${option.deckName}`}
                        </Box>
                      </Tooltip>
                    }
                  />
                ))
              }
              renderOption={(props, option) => (
                <MenuItem {...props} key={option.id}>
                  <Typography
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: getDeckUserColor(option.id),
                    }}
                  >
                    {`${deckToUserMap.get(option.id)?.displayName} - ${option.deckName}`}
                  </Typography>
                </MenuItem>
              )}
            />
          </Grid>
          <Grid item xs={12} xl={6}>
            <TextField
              select
              required
              fullWidth
              label="winner"
              value={winningDeckId}
              onChange={(event) => setWinningDeckId(event.target.value)}
              sx={{
                maxWidth: { xs: 245, sm: "none" },
                "& .MuiInputBase-input": {
                  maxWidth: { xs: 245, sm: "none" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            >
              {participantDecks.length === 0 && (
                <MenuItem value="" disabled>
                  please select decks first
                </MenuItem>
              )}
              {participantDecks.map((deck) => (
                <MenuItem key={deck.id} value={deck.id}>
                  <Typography
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: getDeckUserColor(deck.id),
                    }}
                  >
                    {`${deckToUserMap.get(deck.id)?.displayName} - ${deck.deckName}`}
                  </Typography>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={0}>
              {errors.length > 0 &&
                errors.map((err) => (
                  <Typography key={err} color="error" variant="caption">
                    {err}
                  </Typography>
                ))}
            </Stack>
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Box component="span">
            <Button
              disabled={loading}
              variant="contained"
              onClick={handleSubmit}
              sx={{ width: 150, height: 40 }}
            >
              {editingMatch ? "edit" : "add"} match
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};
