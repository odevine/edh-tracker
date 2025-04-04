import {
  Box,
  Button,
  Checkbox,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useFormat } from "@/hooks";
import { CreateFormatInput, UpdateFormatInput } from "@/types";

const isValidScryfallFilter = (query: string): boolean => {
  try {
    decodeURIComponent(query);
    return true;
  } catch {
    return false;
  }
};

export const FormatModal = (props: {
  open: boolean;
  onClose: () => void;
  editingFormatId?: string;
}) => {
  const { open, onClose, editingFormatId } = props;
  const { allFormats, createNewFormat, updateExistingFormat } = useFormat();

  const editingFormat = allFormats.find((f) => f.id === editingFormatId);

  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [playerRange, setPlayerRange] = useState("");
  const [singleton, setSingleton] = useState(false);
  const [requiresCommander, setRequiresCommander] = useState(false);
  const [validCommanderFilters, setValidCommanderFilters] = useState("");
  const [inactive, setInactive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (editingFormat) {
      setDisplayName(editingFormat.displayName);
      setDescription(editingFormat.description);
      setPlayerRange(editingFormat.playerRange);
      setSingleton(Boolean(editingFormat.singleton));
      setRequiresCommander(Boolean(editingFormat.requiresCommander));
      setValidCommanderFilters(
        editingFormat.validCommanderFilters
          ? decodeURIComponent(editingFormat.validCommanderFilters)
          : "",
      );
      setInactive(Boolean(editingFormat.inactive));
    } else {
      setDisplayName("");
      setDescription("");
      setPlayerRange("");
      setSingleton(false);
      setRequiresCommander(false);
      setValidCommanderFilters("");
      setInactive(false);
      setErrors([]);
    }
  }, [editingFormat, open]);

  const validateFormatDetails = () => {
    const newErrors: string[] = [];

    if (!displayName) {
      newErrors.push("format name is required.");
    }
    if (
      allFormats.some(
        (f) => f.displayName === displayName && f.id !== editingFormatId,
      )
    ) {
      newErrors.push("format name must be unique.");
    }

    if (!description) {
      newErrors.push("description is required.");
    }
    if (!playerRange) {
      newErrors.push("player range is required.");
    }

    if (
      validCommanderFilters.trim() &&
      !isValidScryfallFilter(encodeURIComponent(validCommanderFilters.trim()))
    ) {
      newErrors.push(
        "valid commander filter must include 'is:commander' and be a valid scryfall query string.",
      );
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateFormatDetails()) return;

    const formatInput: CreateFormatInput | UpdateFormatInput = {
      displayName,
      description,
      playerRange,
      singleton,
      requiresCommander,
      validCommanderFilters: validCommanderFilters.trim()
        ? encodeURIComponent(validCommanderFilters.trim())
        : undefined,
      inactive: inactive ? true : undefined,
    };

    if (editingFormat) {
      updateExistingFormat({ formatId: editingFormat.id, input: formatInput });
    } else {
      createNewFormat(formatInput as CreateFormatInput);
    }

    onClose();
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
          minWidth: { xs: 310, sm: 480, md: 600 },
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <Typography variant="h4" gutterBottom>
          {editingFormat ? "update" : "new"} format
        </Typography>
        <Stack spacing={3}>
          <TextField
            fullWidth
            required
            label="format name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <TextField
            fullWidth
            required
            multiline
            minRows={3}
            label="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxRows={6}
          />
          <TextField
            fullWidth
            required
            label="player range (e.g. 2-4)"
            value={playerRange}
            onChange={(e) => setPlayerRange(e.target.value)}
          />
          <Stack direction="column">
            <Stack direction="row" alignItems="center">
              <Checkbox
                checked={singleton}
                onChange={(e) => setSingleton(e.target.checked)}
              />
              <Typography component="span">singleton</Typography>
            </Stack>
            {editingFormat && (
              <Stack direction="row" alignItems="center">
                <Checkbox
                  checked={inactive}
                  onChange={(e) => setInactive(e.target.checked)}
                />
                <Typography component="span">inactive</Typography>
              </Stack>
            )}
            <Stack direction="row" alignItems="center">
              <Checkbox
                checked={requiresCommander}
                onChange={(e) => {
                  setRequiresCommander(e.target.checked);
                  if (e.target.checked === false) {
                    setValidCommanderFilters("");
                  }
                }}
              />
              <Typography component="span">requires commander</Typography>
            </Stack>
          </Stack>

          {requiresCommander && (
            <TextField
              fullWidth
              label="valid commander filters"
              value={validCommanderFilters}
              onChange={(e) => setValidCommanderFilters(e.target.value)}
              helperText="must include is:commander, url encoding is handled automatically"
              error={
                !!validCommanderFilters &&
                !isValidScryfallFilter(
                  encodeURIComponent(validCommanderFilters.trim()),
                )
              }
            />
          )}

          <Stack spacing={0}>
            {errors.length > 0 &&
              errors.map((err) => (
                <Typography key={err} color="error">
                  {err}
                </Typography>
              ))}
          </Stack>

          <Stack justifyContent="space-between" direction="row">
            <Box />
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ width: 150, height: 40 }}
            >
              {editingFormat ? "update" : "add"} format
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};
