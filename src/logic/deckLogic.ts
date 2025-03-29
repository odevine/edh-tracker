import { AuthUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import axios from "axios";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";

import {
  CreateDeckInput,
  Deck,
  DeckCategory,
  DecksByDeckOwnerIdQueryVariables,
  DeleteDeckInput,
  UpdateDeckInput,
} from "@/API";
import { createDeck, deleteDeck, updateDeck } from "@/graphql/mutations";
import {
  decksByDeckOwnerId,
  listDeckCategories,
  listDecks,
} from "@/graphql/queries";

const client = generateClient();

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

  // Join all but the last color with a comma, then append "and" before the last color
  return `${fullColorNames.slice(0, -1).join(", ")} and ${fullColorNames.slice(-1)}`;
};

export const getAllDecksFn = async (): Promise<Deck[] | null> => {
  try {
    let allDecks: Deck[] = [];
    let nextToken: string | null = null;

    do {
      const response: any = await client.graphql({
        query: listDecks,
        variables: { nextToken },
      });

      if (
        response.data &&
        response.data.listDecks &&
        response.data.listDecks.items
      ) {
        allDecks = [...allDecks, ...response.data.listDecks.items];
        nextToken = response.data.listDecks.nextToken;
      } else {
        nextToken = null;
      }
    } while (nextToken);

    return allDecks;
  } catch (error) {
    console.error("error fetching decks:", error);
    return null;
  }
};

export const getAllDecksCategoriesFn = async (): Promise<
  DeckCategory[] | null
> => {
  try {
    let allCategories: DeckCategory[] = [];
    let nextToken: string | null = null;

    do {
      const response: any = await client.graphql({
        query: listDeckCategories,
        variables: { nextToken },
      });

      if (
        response.data &&
        response.data.listDeckCategories &&
        response.data.listDeckCategories.items
      ) {
        allCategories = [
          ...allCategories,
          ...response.data.listDeckCategories.items,
        ];
        nextToken = response.data.listDeckCategories.nextToken;
      } else {
        nextToken = null;
      }
    } while (nextToken);

    return allCategories;
  } catch (error) {
    console.error("error fetching deck categories:", error);
    return null;
  }
};

export const getDecksByOwnerFn = async (
  user: AuthUser,
): Promise<Deck[] | null> => {
  // Return early if user object is not valid
  if (!user || !user.userId) {
    console.error("invalid or missing user object");
    return null;
  }

  const queryVariables: DecksByDeckOwnerIdQueryVariables = {
    deckOwnerId: user.userId,
  };

  try {
    const userDecksResponse = await client.graphql({
      query: decksByDeckOwnerId,
      variables: queryVariables,
    });

    if (userDecksResponse.data && userDecksResponse.data.decksByDeckOwnerId) {
      return userDecksResponse.data.decksByDeckOwnerId.items as Deck[];
    }
    return null;
  } catch (error) {
    console.error("Error fetching decks by owner ID:", error);
    return null;
  }
};

export const createDeckFn = async (
  newDeck: CreateDeckInput,
): Promise<Deck | null> => {
  try {
    const newDeckResponse = await client.graphql({
      query: createDeck,
      variables: { input: newDeck },
    });

    if (newDeckResponse.data && newDeckResponse.data.createDeck) {
      return newDeckResponse.data.createDeck as Deck;
    } else {
      console.error("Failed to create new deck:");
      return null;
    }
  } catch (error) {
    console.error("Error creating new deck:", error);
    return null;
  }
};

export const updateDeckFn = async (
  updatedDeck: UpdateDeckInput,
): Promise<Deck | null> => {
  try {
    const updatedDeckResponse = await client.graphql({
      query: updateDeck,
      variables: { input: updatedDeck },
    });
    if (updatedDeckResponse.data && updatedDeckResponse.data.updateDeck) {
      return updatedDeckResponse.data.updateDeck as Deck;
    } else {
      console.log(`no deck found for ${updatedDeck.id}, or update failed`);
      return null;
    }
  } catch (error) {
    console.error("error updating deck:", error);
    return null;
  }
};

export const deleteDeckFn = async (deckId: string): Promise<boolean> => {
  const input: DeleteDeckInput = {
    id: deckId,
  };

  try {
    const deleteDeckResponse = await client.graphql({
      query: deleteDeck,
      variables: { input },
    });
    if (
      deleteDeckResponse.data.deleteDeck &&
      deleteDeckResponse.data.deleteDeck.id
    ) {
      console.log(
        "deck deleted successfully:",
        deleteDeckResponse.data.deleteDeck,
      );
      return true;
    } else {
      console.error("Failed to delete the deck:", deleteDeckResponse.errors);
      return false;
    }
  } catch (error) {
    console.error("Error deleting deck:", error);
    return false;
  }
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

  // Initialize debouncedSearch with Lodash's debounce
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
    // This will make sure the effect cleanup only runs once when the component unmounts.
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

    // Scryfall card objects often contain multiple images (e.g., normal, small, etc.)
    // We will return the URL of the normal size image if available.
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

  // Split the decklist by newlines
  const lines = decklist.split("\n");

  // Regular expression to match lines with the format: <quantity> <card name> (optional set/collector number/foil)
  const regex = /^\s*(\d+)\s+([^(]+)/;

  lines.forEach((line) => {
    // Use regex to extract quantity and card name
    const match = line.match(regex);

    if (match) {
      const quantity = match[1];
      let cardName = match[2].trim();

      // Check if the cardName contains "//" and trim anything after it
      const splitCardIndex = cardName.indexOf(" // ");
      if (splitCardIndex !== -1) {
        cardName = cardName.substring(0, splitCardIndex).trim();
      }

      // Add to the parsed list in the format: "quantity cardName"
      parsedDecklist.push(`${quantity} ${cardName}`);
    }
  });

  return parsedDecklist;
}
