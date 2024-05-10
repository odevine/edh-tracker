import {
  Autocomplete,
  Box,
  Button,
  MenuItem,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useDecks, useUser } from "@/Context";
import { createDeck, useCommanderSearch } from "@/Logic";

interface ICommander {
  label: string;
  id: string;
  colors: string[];
  [key: string]: any;
}

const colorOrder = ["W", "B", "U", "R", "G"];
const sortColors = (arr: string[]) => {
  return arr.sort((a, b) => {
    return colorOrder.indexOf(a) - colorOrder.indexOf(b);
  });
};

export const NewDeckModal = (props: { open: boolean; onClose: () => void }) => {
  const { authenticatedUser } = useUser();
  const { allDecks, createNewDeck } = useDecks();

  const [deckName, setDeckName] = useState("");
  const [commander, setCommander] = useState<null | ICommander>(null);
  const [commanderSearchTerm, setCommanderSearchTerm] = useState("");
  const [commanderOptions, setCommanderOptions] = useState<ICommander[]>([]);
  const [deckFormat, setDeckFormat] = useState("");
  const [deckLink, setDeckLink] = useState("");
  const [deckCost, setDeckCost] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const { commanderSearch, searchResults } = useCommanderSearch();
  useEffect(() => {
    setCommanderOptions(searchResults as ICommander[]);
  }, [searchResults]);

  const validateDeckDetails = () => {
    const newErrors = [];
    if (deckName === "") {
      newErrors.push("Deck name is required.");
    }
    if (allDecks.some((deck) => deck.deckName === deckName)) {
      newErrors.push("Deck name must be unique.");
    }
    if (!commander) {
      newErrors.push("Commander is required");
    }
    if (deckFormat === "") {
      newErrors.push("Deck format is required");
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (authenticatedUser && validateDeckDetails()) {
      createNewDeck({
        deckOwnerID: authenticatedUser.userId,
        deckName,
        commanderName: commander?.label ?? "",
        commanderColors: sortColors(commander?.colors ?? []),
        deckType: deckFormat,
        cost: deckCost !== "" ? Number(deckCost) : undefined,
        link: deckLink !== "" ? deckLink : undefined,
      });
      props.onClose();
    }
  };

  const handleCommanderChange = (searchTerm: string) => {
    setCommanderSearchTerm(searchTerm);
    if (searchTerm.length >= 3) {
      commanderSearch(searchTerm);
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
    <Modal open={props.open} onClose={props.onClose}>
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
        <Typography variant="h4" sx={{ mb: 2 }}>
          new deck
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
            <Autocomplete
              fullWidth
              freeSolo
              options={commanderOptions.map((option) => ({
                label: option.name,
                id: option.id,
                colors: option.colors,
              }))}
              onInputChange={(_event, value) => handleCommanderChange(value)}
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
              add deck
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
