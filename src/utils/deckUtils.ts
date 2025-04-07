import axios from "axios";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";

import { COLOR_MAP, COLOR_ORDER } from "@/constants";
import { Deck, DeckWithStats } from "@/types";

export const getFullColorNames = (colors: string[]): string => {
  const fullColorNames = colors.map((color) => COLOR_MAP[color] || color);

  if (fullColorNames.length === 0) {
    return "";
  }

  if (fullColorNames.length === 1) {
    return fullColorNames[0];
  }

  // join all but the last color with a comma, then append "and" before the last color
  return `${fullColorNames.slice(0, -1).join(", ")} and ${fullColorNames.slice(-1)}`;
};

export const sortColors = (arr: string[]) => {
  return arr.sort((a, b) => {
    return COLOR_ORDER.indexOf(a) - COLOR_ORDER.indexOf(b);
  });
};

export const getCommanderColors = async (
  commanderName: string,
): Promise<string[]> => {
  const query = encodeURIComponent(`!"${commanderName}"`);
  const url = `https://api.scryfall.com/cards/named?fuzzy=${query}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    return sortColors(data.color_identity ?? []);
  } catch (error) {
    console.error(`failed to fetch colors for ${commanderName}:`, error);
    return [];
  }
};

export const useCommanderSearch = () => {
  const [commanderSearchTerm, setCommanderSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // initialize debouncedSearch with Lodash's debounce
  const debouncedSearch = useRef(
    debounce(async (searchTerm: string, alternateFilters?: string) => {
      if (searchTerm.length >= 3) {
        const baseSearchUrl = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(searchTerm)}+`;
        let commanderFilters = alternateFilters;
        if (!commanderFilters || commanderFilters.length === 0) {
          commanderFilters = "game%3Apaper+is%3Acommander";
        }
        const fullSearchUrl = baseSearchUrl + commanderFilters;

        try {
          const response = await axios.get(fullSearchUrl);
          setSearchResults(response.data.data);
        } catch (err) {
          console.error("Scryfall search failed", err);
        }
      }
    }, 300),
  ).current;

  useEffect(() => {
    // this will make sure the effect cleanup only runs once when the component unmounts.
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const commanderSearch = (searchOptions: {
    searchTerm: string;
    commanderFilters?: string;
  }) => {
    setCommanderSearchTerm(searchOptions.searchTerm);
    debouncedSearch(searchOptions.searchTerm, searchOptions.commanderFilters);
  };

  return {
    commanderSearch,
    commanderSearchTerm,
    searchResults,
  };
};

export const getCardArt = async (
  commanderName: string,
): Promise<string | null> => {
  const apiUrl = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(commanderName)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching card: ${response.statusText}`);
    }

    const cardData = await response.json();

    // scryfall card objects often contain multiple images (e.g., normal, small, etc.)
    // we will return the URL of the normal size image if available.
    if (cardData.image_uris && cardData.image_uris.normal) {
      return cardData.image_uris.normal;
    } else {
      throw new Error("Card image not found");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const parseDecklist = (decklist: string): string[] => {
  const parsedDecklist: string[] = [];

  // split the decklist by newlines
  const lines = decklist.split("\n");

  // regular expression to match lines with the format: <quantity> <card name> (optional set/collector number/foil)
  const regex = /^\s*(\d+)\s+([^(]+)/;

  lines.forEach((line) => {
    // use regex to extract quantity and card name
    const match = line.match(regex);

    if (match) {
      const quantity = match[1];
      let cardName = match[2].trim();

      // check if the cardName contains "//" and trim anything after it
      const splitCardIndex = cardName.indexOf(" // ");
      if (splitCardIndex !== -1) {
        cardName = cardName.substring(0, splitCardIndex).trim();
      }

      // add to the parsed list in the format: "quantity cardName"
      parsedDecklist.push(`${quantity} ${cardName}`);
    }
  });

  return parsedDecklist;
};

export const matchesExactColors = (
  deckColors: string[],
  filterColors: string[],
) => {
  if (filterColors.length === 0) {
    return true;
  }

  if (deckColors.includes("C")) {
    return filterColors.includes("C");
  }

  return (
    deckColors.length === filterColors.length &&
    deckColors.every((color) => filterColors.includes(color))
  );
};

export const computeDeckStats = (
  decks: Deck[],
  includeUnranked: boolean,
): DeckWithStats[] =>
  decks.map((deck) => {
    const statsMap = deck.formatStats ?? {};
    const ranked = statsMap[deck.formatId] ?? { gamesPlayed: 0, gamesWon: 0 };
    const unranked = statsMap.unranked ?? { gamesPlayed: 0, gamesWon: 0 };

    const combined = includeUnranked
      ? {
          gamesPlayed: ranked.gamesPlayed + unranked.gamesPlayed,
          gamesWon: ranked.gamesWon + unranked.gamesWon,
        }
      : ranked;

    const winRate =
      combined.gamesPlayed > 0 ? combined.gamesWon / combined.gamesPlayed : 0;

    return {
      ...deck,
      totalMatches: combined.gamesPlayed,
      totalWins: combined.gamesWon,
      winRate,
    };
  });
