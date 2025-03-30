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

import { useDeck, useTheme, useUser } from "@/hooks";
import { User } from "@/types";

export const PlayerSelector = (props: {
  filterUser: string | string[];
  setFilterUser: (newUser: string | string[]) => void;
  multi?: boolean;
}) => {
  const { filterUser, setFilterUser, multi = false } = props;
  const { mode } = useTheme();
  const { allDecks } = useDeck();
  const { allUserProfiles } = useUser();

  // Generate the unique list of user options
  const userOptions = useMemo(() => {
    // Get unique ownerIDs from allDecks
    const uniqueOwnerIDs = [...new Set(allDecks.map((deck) => deck.userId))];

    // Map ownerIDs to user profiles, filter out undefined, and assert the remaining profiles are defined
    const users = uniqueOwnerIDs
      .map((ownerId) =>
        allUserProfiles.find((profile) => profile.id === ownerId),
      )
      .filter((profile): profile is User => profile !== undefined)
      .map((profile) => ({
        id: profile.id,
        displayName: profile.displayName,
        color:
          mode === "light" ? profile.lightThemeColor : profile.darkThemeColor,
      }));

    return users;
  }, [allDecks, allUserProfiles, mode]);

  // Find the selected option(s) based on filterUser
  const selectedOption = useMemo(() => {
    if (multi) {
      return Array.isArray(filterUser)
        ? filterUser
            .map((id) => userOptions.find((option) => option.id === id))
            .filter(Boolean)
        : [];
    } else {
      return typeof filterUser === "string"
        ? userOptions.find((option) => option.id === filterUser) || null
        : null;
    }
  }, [filterUser, userOptions, multi]);

  return (
    <Autocomplete
      size="small"
      multiple={multi}
      options={userOptions}
      getOptionLabel={(option) => option?.displayName ?? ""}
      value={selectedOption}
      onChange={(_event, newValue) => {
        if (multi) {
          setFilterUser(
            Array.isArray(newValue)
              ? newValue.map((option) => option?.id || "")
              : [],
          );
        } else {
          setFilterUser(
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
          label={multi ? "players" : "player"}
          fullWidth
          placeholder={
            multi
              ? filterUser.length
                ? ""
                : "all players"
              : selectedOption
                ? ""
                : "all players"
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
                    {option.displayName}
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
              {option.displayName}
            </Typography>
          </MenuItem>
        ) : null
      }
      fullWidth
      sx={{ minWidth: 140 }}
    />
  );
};
