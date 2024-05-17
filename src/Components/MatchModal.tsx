import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";

import { CreateMatchesInput, Decks, Users } from "@/API";
import { useDecks, useMatches, useUser } from "@/Context";

interface NewMatchModalProps {
  open: boolean;
  onClose: () => void;
  deckToUserMap: Map<string, Users>;
}

const deckTypes = [
  { label: "precon/precon(u)", value: "precon" },
  { label: "constructed", value: "constructed" },
];

export const MatchModal: React.FC<NewMatchModalProps> = ({
  open,
  onClose,
  deckToUserMap,
}) => {
  const { createNewMatch } = useMatches();
  const { allDecks } = useDecks();
  const { authenticatedUser } = useUser();
  const [matchType, setMatchType] = useState(deckTypes[0].value);
  const [datePlayed, setDatePlayed] = useState(DateTime.now());
  const [winningDeck, setWinningDeck] = useState("");
  const [participantDecks, setParticipantDecks] = useState<Decks[]>([]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = (): boolean => {
    const localErrors: string[] = [];
    if (!participantDecks.length) {
      localErrors.push("please select at least two decks as participants");
    }
    if (!winningDeck) {
      localErrors.push("please select a winning deck.");
    }
    setErrors(localErrors);
    return localErrors.length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authenticatedUser) {
      console.error("User is not authenticated");
      return;
    }

    if (validateForm()) {
      const matchData: CreateMatchesInput = {
        winningUserID: "",
        datePlayed: datePlayed.toISO(),
        matchType,
        isArchived: false,
      };

      setLoading(true);
      createNewMatch(
        matchData,
        participantDecks.map((deck) => deck.id),
      ).finally(() => setLoading(false));
    }
  };

  const handleDeckClear = async (reason: string) => {
    if (reason === "clear") {
      setWinningDeck("");
    }
  };

  const filteredDecks = useMemo(() => {
    return allDecks
      .filter((deck) => deck.deckType === matchType)
      .sort((a, b) => a.deckOwnerID.localeCompare(b.deckOwnerID));
  }, [allDecks, matchType]);

  return (
    <Modal open={open} onClose={onClose}>
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
          minWidth: 480,

          "&:focus": {
            outline: "none",
          },
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          new match
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DatePicker
              label="match date"
              value={datePlayed}
              onChange={(newValue) => newValue && setDatePlayed(newValue)}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              required
              fullWidth
              label="match type"
              value={matchType}
              onChange={(event) => setMatchType(event.target.value)}
            >
              {deckTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
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
                console.log(newValue);
                setParticipantDecks(newValue);
                if (!newValue.map((deck) => deck.id).includes(winningDeck)) {
                  setWinningDeck("");
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
                    label={option.deckName}
                    sx={{
                      color:
                        deckToUserMap.get(option.id)?.darkThemeColor ??
                        "inherit",
                    }}
                  />
                ))
              }
              renderOption={(props, option) => (
                <MenuItem {...props} key={option.id}>
                  <Typography
                    sx={{
                      color:
                        // TODO: Have this be toggled via theme mode
                        deckToUserMap.get(option.id)?.darkThemeColor ??
                        "inherit",
                    }}
                  >
                    {`${deckToUserMap.get(option.id)?.displayName} - ${option.deckName}`}
                  </Typography>
                </MenuItem>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              required
              fullWidth
              label="winner"
              value={winningDeck}
              onChange={(event) => setWinningDeck(event.target.value)}
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
                      color:
                        deckToUserMap.get(deck.id)?.darkThemeColor ?? "inherit",
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
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            onClick={handleSubmit}
            sx={{ width: 150, height: 40 }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "inherit" }} />
            ) : (
              "add match"
            )}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};
