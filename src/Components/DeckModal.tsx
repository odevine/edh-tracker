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

import { CreateDeckInput, UpdateDeckInput } from "@/API";
import { useDeck, useUser } from "@/Context";
import { sortColors, useCommanderSearch } from "@/Logic";

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
  const { authenticatedUser } = useUser();
  const { allDecks, createNewDeck, updateExistingDeck } = useDeck();

  // Find the editing deck based on the editingDeckId
  const editingDeck = allDecks.find((deck) => deck.id === editingDeckId);

  // State for the deck fields
  const [deckName, setDeckName] = useState("");
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
  const [deckFormat, setDeckFormat] = useState("");
  const [deckLink, setDeckLink] = useState("");
  const [deckCost, setDeckCost] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // Update state when editingDeck changes
  useEffect(() => {
    if (editingDeck) {
      const existingCommander = {
        label: editingDeck.commanderName,
        colors: editingDeck.commanderColors ?? [],
      };

      setDeckName(editingDeck.deckName);
      setCommander(existingCommander);
      setCommanderSearchTerm(editingDeck.commanderName);
      setDeckFormat(editingDeck.deckType);
      setDeckLink(editingDeck?.link ?? "");
      setDeckCost(String(editingDeck?.cost) ?? "");

      let existingSecondCommander: ICommander | null = null;
      if (editingDeck.secondCommanderName) {
        existingSecondCommander = {
          label: editingDeck.secondCommanderName,
          colors: editingDeck.secondCommanderColors as string[],
        };
        setMultiCommander(Boolean(existingSecondCommander));
        setSecondCommander(existingSecondCommander ?? null);
        setSecondCommanderSearchTerm("");
      }
    } else {
      // Reset state if no deck is found (or if editingDeckId is null)
      setDeckName("");
      setCommander(null);
      setCommanderSearchTerm("");
      setCommanderOptions([]);
      setDeckFormat("");
      setDeckLink("");
      setDeckCost("");
      setErrors([]);
      setMultiCommander(false);
      setSecondCommander(null);
      setSecondCommanderSearchTerm("");
      setSecondCommanderOptions([]);
    }
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
    const newErrors = [];
    if (deckName === "") {
      newErrors.push("deck name is required.");
    }
    // Check for uniqueness but exclude the current editing deck (if it exists)
    if (
      editingDeckId &&
      allDecks.some(
        (deck) => deck.deckName === deckName && deck.id !== editingDeckId,
      )
    ) {
      newErrors.push("deck name must be unique.");
    } else if (
      !editingDeckId &&
      allDecks.some((deck) => deck.deckName === deckName)
    ) {
      // If there's no editingDeckId, just check for any match
      newErrors.push("deck name must be unique.");
    }
    if (!commander) {
      newErrors.push("at least one commander is required");
    }
    if (deckFormat === "") {
      newErrors.push("deck format is required");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (authenticatedUser && validateDeckDetails()) {
      const deckInput: CreateDeckInput | UpdateDeckInput = {
        deckOwnerId: authenticatedUser.userId,
        deckName,
        commanderName: commander?.label ?? "",
        commanderColors: sortColors(commander?.colors ?? []),
        secondCommanderName: secondCommander?.label ?? null,
        secondCommanderColors: secondCommander
          ? sortColors(secondCommander?.colors ?? [])
          : null,
        deckType: deckFormat,
        cost: deckCost !== "" ? Number(deckCost) : undefined,
        link: deckLink !== "" ? deckLink : undefined,
      };
      console.log(commander, secondCommander);
      console.log("  ~ handleSubmit ~ deckInput:", deckInput);

      if (editingDeck) {
        updateExistingDeck({ ...deckInput, id: editingDeck.id });
      } else {
        createNewDeck(deckInput);
      }
      onClose();
    }
  };

  const handleCommanderSearchChange = (searchTerm: string) => {
    setCommanderSearchTerm(searchTerm);
    if (searchTerm.length >= 3) {
      commanderSearch(searchTerm);
    }
  };

  const handleSecondCommanderSearchChange = (searchTerm: string) => {
    setSecondCommanderSearchTerm(searchTerm);
    if (searchTerm.length >= 3) {
      secondCommanderSearch(searchTerm);
    }
  };

  const handleLinkChange = (newValue: string) => {
    if (
      /^https:\/\/(www\.moxfield\.com\/|archidekt\.com\/).*/.test(newValue) ||
      newValue === ""
    ) {
      setDeckLink(newValue);
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
        <Typography variant="h4" sx={{ mb: 2 }}>
          {editingDeck ? "update" : "new"} deck
        </Typography>
        <Stack height={"100%"} justifyContent="space-between" spacing={3}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              required
              label="deck name"
              value={deckName}
              onChange={(event) => setDeckName(event?.target.value)}
            />
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
                  handleCommanderSearchChange(value)
                }
                onChange={(_event, value) => setCommander(value as ICommander)}
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
            <TextField
              fullWidth
              required
              select
              label="deck format"
              placeholder="paste a moxfield or archidekt link here"
              value={deckFormat}
              onChange={(event) => setDeckFormat(event.target.value)}
            >
              <MenuItem value="precon">precon or precon(u)</MenuItem>
              <MenuItem value="constructed">constructed</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="deck link"
              placeholder="paste a moxfield or archidekt link here"
              value={deckLink}
              onChange={(event) => handleLinkChange(event?.target.value)}
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
          <Stack alignItems="flex-end">
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
