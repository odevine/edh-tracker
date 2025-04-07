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

  const editingDeck = allDecks.find((deck) => deck.id === editingDeckId);
  const playedDeck = hasDeckBeenUsed(editingDeckId);

  const [displayName, setDisplayName] = useState("");
  const [deckFormat, setDeckFormat] = useState<Format | null>(null);
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
  const [unrankedIncludeCommander, setUnrankedIncludeCommander] =
    useState(false);

  const isUnrankedFormat = deckFormat?.id === "unranked";
  const effectiveRequiresCommander =
    deckFormat?.requiresCommander ??
    (isUnrankedFormat && unrankedIncludeCommander);

  useEffect(() => {
    const initializeDeckData = async () => {
      if (editingDeck) {
        setDisplayName(editingDeck.displayName);
        const format =
          allFormats.find((f) => f.id === editingDeck.formatId) ?? null;
        setDeckFormat(format);
        setDeckLink(editingDeck?.link ?? "");
        setDeckCost(String(editingDeck?.cost) ?? "");
        setDeckIsInactive(Boolean(editingDeck?.inactive));

        const hasCommander = Boolean(editingDeck.commanderName);

        const isUnranked = format && format.id === "unranked";
        const requiresCommander =
          format && (format.requiresCommander || (isUnranked && hasCommander));

        if (requiresCommander && hasCommander) {
          if (isUnranked) {
            setUnrankedIncludeCommander(true);
          }

          const commanderColors = await getCommanderColors(
            editingDeck.commanderName as string,
          );
          setCommander({
            label: editingDeck.commanderName as string,
            colors: commanderColors,
          });
          setCommanderSearchTerm(editingDeck.commanderName as string);

          if (editingDeck.secondCommanderName) {
            const secondCommanderColors = await getCommanderColors(
              editingDeck.secondCommanderName,
            );
            setMultiCommander(true);
            setSecondCommander({
              label: editingDeck.secondCommanderName,
              colors: secondCommanderColors,
            });
          }
        }
      } else {
        setDisplayName("");
        setCommander(null);
        setCommanderSearchTerm("");
        setCommanderOptions([]);
        setDeckFormat(null);
        setDeckLink("");
        setDeckCost("");
        setDeckIsInactive(false);
        setErrors([]);
        setMultiCommander(false);
        setSecondCommander(null);
        setSecondCommanderSearchTerm("");
        setSecondCommanderOptions([]);
        setUnrankedIncludeCommander(false);
      }
    };

    void initializeDeckData();
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
      { condition: displayName === "", message: "deck name is required." },
      {
        condition: allDecks.some(
          (deck) =>
            deck.displayName === displayName && deck.id !== editingDeckId,
        ),
        message: "deck name must be unique.",
      },
      { condition: !deckFormat, message: "deck format is required" },
      {
        condition: !commander && effectiveRequiresCommander,
        message: "at least one commander is required",
      },
      {
        condition: !effectiveRequiresCommander && deckColors.length === 0,
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
      if (condition) {
        newErrors.push(message);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (isAuthenticated && validateDeckDetails()) {
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
          "&:focus": { outline: "none" },
        }}
      >
        <Typography variant="h4" gutterBottom>
          {editingDeck ? "update" : "new"} deck
        </Typography>
        <Stack height="100%" justifyContent="space-between" spacing={3}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              required
              label="deck name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <TextField
              fullWidth
              required
              select
              disabled={Boolean(editingDeck && playedDeck)}
              label="deck format"
              value={deckFormat?.id ?? ""}
              onChange={(e) => {
                const format =
                  allFormats.find((f) => f.id === e.target.value) ?? null;
                setDeckFormat(format);
                if (format && format.id !== "unranked") {
                  setUnrankedIncludeCommander(false);
                }
              }}
            >
              {allFormats.map((format) => (
                <MenuItem key={format.id} value={format.id}>
                  {format.displayName}
                </MenuItem>
              ))}
            </TextField>
            {isUnrankedFormat && (
              <Stack direction="row" alignItems="center">
                <Checkbox
                  checked={unrankedIncludeCommander}
                  onChange={(e) =>
                    setUnrankedIncludeCommander(e.target.checked)
                  }
                />
                <Typography component="span">include commander(s)?</Typography>
              </Stack>
            )}
            {effectiveRequiresCommander && (
              <>
                <Stack direction="row" spacing={2}>
                  <Autocomplete
                    fullWidth
                    freeSolo
                    options={commanderOptions.map((o) => ({
                      label: o.name,
                      colors: o.color_identity,
                    }))}
                    value={commander}
                    onInputChange={(_e, v) =>
                      handleCommanderSearchChange(
                        v,
                        deckFormat?.validCommanderFilters,
                      )
                    }
                    onChange={(_e, v) => setCommander(v as ICommander)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        value={commanderSearchTerm}
                        label="commander"
                      />
                    )}
                  />
                  <Stack alignItems="center">
                    <Typography variant="caption">multi?</Typography>
                    <Checkbox
                      size="small"
                      checked={multiCommander}
                      onChange={(_e, checked) => {
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
                    fullWidth
                    freeSolo
                    options={secondCommanderOptions.map((o) => ({
                      label: o.name,
                      colors: o.colors,
                    }))}
                    value={secondCommander}
                    onInputChange={(_e, v) =>
                      handleSecondCommanderSearchChange(v)
                    }
                    onChange={(_e, v) => setSecondCommander(v as ICommander)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        value={secondCommanderSearchTerm}
                        label="second commander"
                      />
                    )}
                  />
                )}
              </>
            )}
            {!effectiveRequiresCommander && (
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
              onChange={(e) => setDeckLink(e.target.value)}
            />
            <TextField
              fullWidth
              label="deck cost"
              value={deckCost}
              onChange={(e) => handleCostChange(e.target.value)}
            />
            {errors.map((err) => (
              <Typography key={err} color="error">
                {err}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            {editingDeck ? (
              <Stack direction="row" alignItems="center">
                <Checkbox
                  checked={deckIsInactive}
                  onChange={(e) => setDeckIsInactive(e.target.checked)}
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
