import axios from "axios";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";

export const colorMap: Record<string, string> = {
  W: "white",
  U: "blue",
  B: "black",
  R: "red",
  G: "green",
  C: "colorless",
};

export const getFullColorNames = (colors: string[]): string => {
  const fullColorNames = colors.map((color) => colorMap[color] || color);

  if (fullColorNames.length === 0) {
    return "";
  }

  if (fullColorNames.length === 1) {
    return fullColorNames[0];
  }

  // join all but the last color with a comma, then append "and" before the last color
  return `${fullColorNames.slice(0, -1).join(", ")} and ${fullColorNames.slice(-1)}`;
};

const colorOrder = ["W", "B", "U", "R", "G"];
export const sortColors = (arr: string[]) => {
  return arr.sort((a, b) => {
    return colorOrder.indexOf(a) - colorOrder.indexOf(b);
  });
};

export const useCommanderSearch = () => {
  const [commanderSearchTerm, setCommanderSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // initialize debouncedSearch with Lodash's debounce
  const debouncedSearch = useRef(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length >= 3) {
        try {
          const response = await axios.get(
            `https://api.scryfall.com/cards/search?q=${encodeURIComponent(searchTerm)}+%28game%3Apaper%29+is%3Acommander`,
          );
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

  const commanderSearch = (searchTerm: string) => {
    setCommanderSearchTerm(searchTerm);
    debouncedSearch(searchTerm);
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

export function parseDecklist(decklist: string): string[] {
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
}
