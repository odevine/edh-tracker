import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { ColorSelector } from "@/components";
import { useAuth, useDeck, useFormat, useMatch } from "@/hooks";
import { CreateDeckInput, Format, UpdateDeckInput } from "@/types";
import { getCommanderColors, sortColors, useCommanderSearch } from "@/utils";

interface ICommander {
  label: string;
  colors: string[];
  [key: string]: any;
}

export const DeckModal = (props: {
  open: boolean;
  onClose: () => void;
  editingDeckId?: string;
}) => {
  const { open, onClose, editingDeckId } = props;
  const { userId, isAuthenticated } = useAuth();
  const { allFormats } = useFormat();
  const { allDecks, createNewDeck, updateExistingDeck } = useDeck();
  const { hasDeckBeenUsed } = useMatch();

  // find the editing deck based on the editingDeckId
  const editingDeck = allDecks.find((deck) => deck.id === editingDeckId);
  const playedDeck = hasDeckBeenUsed(editingDeckId);

  // state for the deck fields
  const [displayName, setDisplayName] = useState("");
  const [deckFormat, setDeckFormat] = useState<Format | "">("");
  const [deckColors, setDeckColors] = useState<string[]>([]);
  const [commander, setCommander] = useState<ICommander | null>(null);
  const [commanderSearchTerm, setCommanderSearchTerm] = useState("");
  const [commanderOptions, setCommanderOptions] = useState<ICommander[]>([]);
  const [multiCommander, setMultiCommander] = useState(false);
  const [secondCommander, setSecondCommander] = useState<ICommander | null>(
    null,
  );
  const [secondCommanderSearchTerm, setSecondCommanderSearchTerm] =
    useState("");
  const [secondCommanderOptions, setSecondCommanderOptions] = useState<
    ICommander[]
  >([]);
  const [deckLink, setDeckLink] = useState("");
  const [deckCost, setDeckCost] = useState("");
  const [deckIsInactive, setDeckIsInactive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Update state when editingDeck changes
  useEffect(() => {
    const initializeDeckData = async () => {
      if (editingDeck) {
        setDisplayName(editingDeck.displayName);
        setDeckFormat(
          allFormats.find((f) => f.id === editingDeck.formatId) ?? "",
        );
        setDeckLink(editingDeck?.link ?? "");
        setDeckCost(String(editingDeck?.cost) ?? "");
        setDeckIsInactive(Boolean(editingDeck?.inactive));

        const format = allFormats.find((f) => f.id === editingDeck.formatId);
        const requiresCommander = format?.requiresCommander;

        if (requiresCommander && editingDeck.commanderName) {
          const commanderColors = await getCommanderColors(
            editingDeck.commanderName,
          );
          const existingCommander: ICommander = {
            label: editingDeck.commanderName,
            colors: commanderColors,
          };
          setCommander(existingCommander);
          setCommanderSearchTerm(editingDeck.commanderName);

          if (editingDeck.secondCommanderName) {
            const secondCommanderColors = await getCommanderColors(
              editingDeck.secondCommanderName,
            );
            const existingSecondCommander: ICommander = {
              label: editingDeck.secondCommanderName,
              colors: secondCommanderColors,
            };
            setMultiCommander(true);
            setSecondCommander(existingSecondCommander);
            setSecondCommanderSearchTerm("");
          }
        }
      } else {
        setDisplayName("");
        setCommander(null);
        setCommanderSearchTerm("");
        setCommanderOptions([]);
        setDeckFormat("");
        setDeckLink("");
        setDeckCost("");
        setDeckIsInactive(false);
        setErrors([]);
        setMultiCommander(false);
        setSecondCommander(null);
        setSecondCommanderSearchTerm("");
        setSecondCommanderOptions([]);
      }
    };

    void initializeDeckData(); // Run the async init
  }, [editingDeck, open]);

  const { commanderSearch, searchResults } = useCommanderSearch();
  useEffect(() => {
    setCommanderOptions(searchResults as ICommander[]);
  }, [searchResults]);

  const {
    commanderSearch: secondCommanderSearch,
    searchResults: secondCommanderSearchResults,
  } = useCommanderSearch();
  useEffect(() => {
    setSecondCommanderOptions(secondCommanderSearchResults as ICommander[]);
  }, [secondCommanderSearchResults]);

  const validateDeckDetails = () => {
    const newErrors: string[] = [];

    const validations = [
      {
        condition: displayName === "",
        message: "deck name is required.",
      },
      {
        condition: allDecks.some(
          (deck) =>
            deck.displayName === displayName && deck.id !== editingDeckId,
        ),
        message: "deck name must be unique.",
      },
      {
        condition: deckFormat === "",
        message: "deck format is required",
      },
      {
        condition:
          !commander && deckFormat !== "" && deckFormat.requiresCommander,
        message: "at least one commander is required",
      },
      {
        condition:
          deckFormat !== "" &&
          !deckFormat.requiresCommander &&
          deckColors.length === 0,
        message: "assigning deck colors is required",
      },
      {
        condition:
          deckLink !== "" &&
          !/^https:\/\/(www\.)?(moxfield\.com|archidekt\.com)\/decks\/[a-zA-Z0-9\-_/]+$/.test(
            deckLink,
          ),
        message: "deck link must be a full and valid moxfield/archidekt link",
      },
    ];

    validations.forEach(({ condition, message }) => {
      if (condition) newErrors.push(message);
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (isAuthenticated && validateDeckDetails()) {
      // union + sort logic
      let combinedColors: string[] = [];
      if (commander?.colors?.length || secondCommander?.colors?.length) {
        const colorSet = new Set([
          ...(commander?.colors ?? []),
          ...(secondCommander?.colors ?? []),
        ]);
        combinedColors = sortColors(Array.from(colorSet));
      } else {
        combinedColors = deckColors;
      }

      if (combinedColors.length === 0) {
        combinedColors.push("C");
      }

      const deckInput: CreateDeckInput | UpdateDeckInput = {
        displayName,
        userId: userId as string,
        commanderName: commander?.label ?? "",
        deckColors: combinedColors,
        secondCommanderName: secondCommander?.label,
        formatId: (deckFormat as Format)?.id,
        cost: deckCost !== "" ? Number(deckCost) : undefined,
        link: deckLink !== "" ? deckLink : undefined,
        inactive: deckIsInactive ?? undefined,
      };

      if (editingDeck) {
        updateExistingDeck({ deckId: editingDeck.id, input: deckInput });
      } else {
        createNewDeck(deckInput as CreateDeckInput);
      }
      onClose();
    }
  };

  const handleCommanderSearchChange = (
    searchTerm: string,
    commanderFilters?: string,
  ) => {
    setCommanderSearchTerm(searchTerm);
    if (searchTerm.length >= 3) {
      commanderSearch({ searchTerm, commanderFilters });
    }
  };

  const handleSecondCommanderSearchChange = (
    searchTerm: string,
    commanderFilters?: string,
  ) => {
    setSecondCommanderSearchTerm(searchTerm);
    if (searchTerm.length >= 3) {
      secondCommanderSearch({ searchTerm, commanderFilters });
    }
  };

  const handleCostChange = (newValue: string) => {
    if (/^\d*\.?\d{0,2}$/.test(newValue) || newValue === "") {
      setDeckCost(newValue);
    }
  };

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
          minWidth: { xs: 310, sm: 480 },
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <Typography variant="h4" gutterBottom>
          {editingDeck ? "update" : "new"} deck
        </Typography>
        <Stack height={"100%"} justifyContent="space-between" spacing={3}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              required
              label="deck name"
              value={displayName}
              onChange={(event) => setDisplayName(event?.target.value)}
            />
            <TextField
              fullWidth
              required
              select
              disabled={Boolean(editingDeck && playedDeck)}
              label="deck format"
              placeholder="paste a moxfield or archidekt link here"
              value={(deckFormat as Format)?.id ?? ""}
              onChange={(event) => {
                setDeckFormat(
                  allFormats.find((f) => f.id === event.target.value) ?? "",
                );
              }}
            >
              {allFormats.map((format) => (
                <MenuItem key={format.id} value={format.id}>
                  {format.displayName}
                </MenuItem>
              ))}
            </TextField>
            {deckFormat !== "" && deckFormat.requiresCommander && (
              <>
                <Stack
                  direction="row"
                  sx={{ width: "100%" }}
                  alignItems="center"
                  spacing={2}
                >
                  <Autocomplete
                    key={open ? "open" : "closed"}
                    fullWidth
                    freeSolo
                    options={commanderOptions.map((option) => ({
                      label: option.name,
                      colors: option.color_identity,
                    }))}
                    value={commander}
                    onInputChange={(_event, value) =>
                      handleCommanderSearchChange(
                        value,
                        deckFormat?.validCommanderFilters,
                      )
                    }
                    onChange={(_event, value) =>
                      setCommander(value as ICommander)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        value={commanderSearchTerm}
                        placeholder="start typing to search commanders..."
                        label="commander"
                      />
                    )}
                  />
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography variant="caption">multi?</Typography>
                    <Checkbox
                      size="small"
                      checked={multiCommander}
                      onChange={(_event, checked) => {
                        setMultiCommander(checked);
                        if (!checked) {
                          setSecondCommander(null);
                          setSecondCommanderOptions([]);
                          setSecondCommanderSearchTerm("");
                        }
                      }}
                    />
                  </Stack>
                </Stack>
                {multiCommander && (
                  <Autocomplete
                    key={open ? "open" : "closed"}
                    fullWidth
                    freeSolo
                    options={secondCommanderOptions.map((option) => ({
                      label: option.name,
                      colors: option.colors,
                    }))}
                    value={secondCommander}
                    onInputChange={(_event, value) =>
                      handleSecondCommanderSearchChange(value)
                    }
                    onChange={(_event, value) =>
                      setSecondCommander(value as ICommander)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        value={secondCommanderSearchTerm}
                        placeholder="start typing to search commanders..."
                        label="second commander"
                      />
                    )}
                  />
                )}
              </>
            )}
            {deckFormat !== "" && !deckFormat.requiresCommander && (
              <ColorSelector
                filterColor={deckColors}
                setFilterColor={setDeckColors}
                size="medium"
              />
            )}
            <TextField
              fullWidth
              label="deck link"
              placeholder="paste a moxfield or archidekt link here"
              value={deckLink}
              onChange={(event) => setDeckLink(event?.target.value)}
            />
            <TextField
              fullWidth
              label="deck cost"
              value={deckCost}
              onChange={(event) => handleCostChange(event?.target.value)}
            />
            <Stack spacing={0}>
              {errors.length > 0 &&
                errors.map((err) => (
                  <Typography key={err} color="error">
                    {err}
                  </Typography>
                ))}
            </Stack>
          </Stack>
          <Stack justifyContent="space-between" direction="row">
            {editingDeck ? (
              <Stack direction="row" alignItems="center">
                <Checkbox
                  checked={deckIsInactive}
                  onChange={(event) => setDeckIsInactive(event.target.checked)}
                />
                <Typography component="span">inactive?</Typography>
              </Stack>
            ) : (
              <Box />
            )}
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ width: 150, height: 40 }}
            >
              {editingDeck ? "update" : "add"} deck
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
