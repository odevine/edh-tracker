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
import { useMemo, useState } from "react";

import { Deck, User } from "@/API";
import { useDecks, useTheme, useUser } from "@/Context";

interface NewMatchModalProps {
  open: boolean;
  onClose: () => void;
  deckToUserMap: Map<string, User>;
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
  const { allDecks } = useDecks();
  const { mode } = useTheme();
  const { authenticatedUser } = useUser();
  const [matchType, setMatchType] = useState(deckTypes[0].value);
  const [datePlayed, setDatePlayed] = useState(DateTime.now());
  const [winningDeckId, setWinningDeckId] = useState("");
  const [participantDecks, setParticipantDecks] = useState<Deck[]>([]);

  const [errors, setErrors] = useState<string[]>([]);

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
    setMatchType(deckTypes[0].value);
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
      // const matchData: CreateMatchInput = {
      //   winningDeckId: winningDeckId,
      //   datePlayed: datePlayed.toFormat("yyyy-MM-dd"),
      //   matchType,
      //   isArchived: false,
      // };
      // setLoading(true);
      // createNewMatch(
      //   matchData,
      //   participantDecks.map((deck) => deck.id),
      // ).finally(() => {
      //   setLoading(false);
      //   handleClose();
      // });
    }
  };

  const getDeckColor = (deckId: string) => {
    const deckUser = deckToUserMap.get(deckId);
    if (!deckUser) {
      return "inherit";
    }
    return mode === "light"
      ? deckUser.lightThemeColor ?? "inherit"
      : deckUser.darkThemeColor ?? "inherit";
  };

  const filteredDecks = useMemo(() => {
    return allDecks
      .filter((deck) => deck.deckType === matchType)
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
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          new match
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
              {deckTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
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
                            color: getDeckColor(option.id),
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
                      color: getDeckColor(option.id),
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
                      color: getDeckColor(deck.id),
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
          <Tooltip title="coming soon" arrow placement="left">
            <Box component="span">
              <Button
                disabled={true}
                variant="contained"
                onClick={handleSubmit}
                sx={{ width: 150, height: 40 }}
              >
                add match
              </Button>
            </Box>
          </Tooltip>
        </Stack>
      </Box>
    </Modal>
  );
};
