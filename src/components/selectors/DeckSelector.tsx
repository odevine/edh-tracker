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

import { useDeck, useTheme } from "@/context";

export const DeckSelector = (props: {
  filterType: string;
  filterDeck: string | string[];
  setFilterDeck: (newUser: string | string[]) => void;
  multi?: boolean;
}) => {
  const { filterType, filterDeck, setFilterDeck, multi = false } = props;
  const { mode } = useTheme();
  const { allDecks, getDeckUserColor, deckToUserMap } = useDeck();

  // Generate the unique list of user options
  const deckOptions = useMemo(() => {
    // Map ownerIDs to user profiles, filter out undefined, and assert the remaining profiles are defined
    const decks = allDecks
      .filter((deck) => filterType === "" || deck.deckType === filterType)
      .sort((a, b) => (a.deckOwnerId < b.deckOwnerId ? -1 : 1))
      .map((deck) => ({
        id: deck.id,
        deckName: deck.deckName,
        color: getDeckUserColor(deck.id),
      }));

    return decks;
  }, [allDecks, mode, filterType, getDeckUserColor]);

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
      getOptionLabel={(option) =>
        `${deckToUserMap.get(option?.id ?? "")?.displayName} - ${option?.deckName}`
      }
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
        value.map((option, index) =>
          option ? (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              variant="outlined"
              size="small"
              label={
                <Tooltip title={option.deckName} placement="top" arrow>
                  <Box
                    sx={{
                      maxWidth: 120,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: option.color,
                    }}
                  >
                    {`${deckToUserMap.get(option?.id ?? "")?.displayName} - ${option?.deckName}`}
                  </Box>
                </Tooltip>
              }
            />
          ) : null,
        )
      }
      renderOption={(props, option) =>
        option ? (
          <MenuItem {...props} key={option.id}>
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: option.color,
              }}
            >
              {`${deckToUserMap.get(option?.id ?? "")?.displayName} - ${option?.deckName}`}
            </Typography>
          </MenuItem>
        ) : null
      }
      fullWidth
      sx={{ minWidth: 140 }}
    />
  );
};
