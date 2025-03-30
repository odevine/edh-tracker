import {
  Autocomplete,
  Box,
  Chip,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

import { useDeck, useTheme } from "@/hooks";

export const DeckSelector = (props: {
  filterFormat: string;
  filterDeck: string | string[];
  setFilterDeck: (newUser: string | string[]) => void;
  multi?: boolean;
}) => {
  const { filterFormat, filterDeck, setFilterDeck, multi = false } = props;
  const { mode } = useTheme();
  const { allDecks, getDeckUserColor, getUserForDeck } = useDeck();

  // Generate the unique list of user options
  const deckOptions = useMemo(() => {
    return allDecks
      .filter((deck) => filterFormat === "" || deck.formatId === filterFormat)
      .sort((a, b) => (a.userId < b.userId ? -1 : 1))
      .map((deck) => {
        const user = getUserForDeck(deck.id);
        return {
          id: deck.id,
          displayName: deck.displayName,
          color: getDeckUserColor(deck.id),
          userDisplayName: user?.displayName ?? "unknown user",
        };
      });
  }, [allDecks, mode, filterFormat, getDeckUserColor, getUserForDeck]);

  // Find the selected option(s) based on filterUser
  const selectedOption = useMemo(() => {
    if (multi) {
      return Array.isArray(filterDeck)
        ? filterDeck
            .map((id) => deckOptions.find((option) => option.id === id))
            .filter(Boolean)
        : [];
    } else {
      return typeof filterDeck === "string"
        ? deckOptions.find((option) => option.id === filterDeck) || null
        : null;
    }
  }, [filterDeck, deckOptions, multi]);

  return (
    <Autocomplete
      size="small"
      multiple={multi}
      options={deckOptions}
      getOptionLabel={(option) => {
        const displayName =
          getUserForDeck(option?.id ?? "")?.displayName ?? "unknown user";
        return `${displayName} - ${option?.displayName}`;
      }}
      value={selectedOption}
      onChange={(_event, newValue) => {
        if (multi) {
          setFilterDeck(
            Array.isArray(newValue)
              ? newValue.map((option) => option?.id || "")
              : [],
          );
        } else {
          setFilterDeck(
            newValue && typeof newValue === "object" && "id" in newValue
              ? newValue.id
              : "",
          );
        }
      }}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          label={multi ? "decks" : "deck"}
          fullWidth
          placeholder={
            multi && !filterDeck.length
              ? "all decks"
              : !multi && !selectedOption
                ? "all decks"
                : ""
          }
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          if (!option) {
            return null;
          }
          const displayName =
            getUserForDeck(option.id ?? "")?.displayName ?? "unknown user";
          return (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              variant="outlined"
              size="small"
              label={
                <Tooltip title={option.displayName} placement="top" arrow>
                  <Box
                    sx={{
                      maxWidth: 120,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: option.color,
                    }}
                  >
                    {`${displayName} - ${option.displayName}`}
                  </Box>
                </Tooltip>
              }
            />
          );
        })
      }
      renderOption={(props, option) => {
        if (!option) {
          return null;
        }

        const displayName =
          getUserForDeck(option?.id ?? "")?.displayName ?? "unknown user";

        return (
          <MenuItem {...props} key={option.id}>
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: option.color,
              }}
            >
              {`${displayName} - ${option.displayName}`}
            </Typography>
          </MenuItem>
        );
      }}
      fullWidth
      sx={{ minWidth: 140 }}
    />
  );
};
