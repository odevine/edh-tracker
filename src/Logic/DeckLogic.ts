import { AuthUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import axios from "axios";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";

import {
  CreateDecksInput,
  Decks,
  DecksByDeckOwnerIDQueryVariables,
  DeleteDecksInput,
} from "@/API";
import { createDecks, deleteDecks } from "@/graphql/mutations";
import { decksByDeckOwnerID, listDecks } from "@/graphql/queries";

const client = generateClient();

export async function getAllDecks(): Promise<Decks[] | null> {
  try {
    const allDecksResponse = await client.graphql({ query: listDecks });

    if (allDecksResponse.data && allDecksResponse.data.listDecks) {
      return allDecksResponse.data.listDecks.items as Decks[];
    }
    return null;
  } catch (error) {
    console.error("Error fetching decks:", error);
    return null;
  }
}

export async function getDecksByOwner(user: AuthUser): Promise<Decks[] | null> {
  // Return early if user object is not valid
  if (!user || !user.userId) {
    console.error("Invalid or missing user object");
    return null;
  }

  const queryVariables: DecksByDeckOwnerIDQueryVariables = {
    deckOwnerID: user.userId,
  };

  try {
    const userDecksResponse = await client.graphql({
      query: decksByDeckOwnerID,
      variables: queryVariables,
    });

    if (userDecksResponse.data && userDecksResponse.data.decksByDeckOwnerID) {
      return userDecksResponse.data.decksByDeckOwnerID.items as Decks[];
    }
    return null;
  } catch (error) {
    console.error("Error fetching decks by owner ID:", error);
    return null;
  }
}

export async function createDeck(
  newDeck: CreateDecksInput,
): Promise<Decks | null> {
  try {
    const newDeckResponse = await client.graphql({
      query: createDecks,
      variables: { input: newDeck },
    });

    if (newDeckResponse.data && newDeckResponse.data.createDecks) {
      return newDeckResponse.data.createDecks as Decks;
    } else {
      console.error("Failed to create new deck:");
      return null;
    }
  } catch (error) {
    console.error("Error creating new deck:", error);
    return null;
  }
}

/**
 * Deletes a deck by its ID.
 * @param {string} deckId - The ID of the deck to delete.
 * @returns {Promise<boolean>} - True if the operation was successful, false otherwise.
 */
export async function deleteDeck(deckId: string): Promise<boolean> {
  const input: DeleteDecksInput = {
    id: deckId,
  };

  try {
    const deleteDeckResponse = await client.graphql({
      query: deleteDecks,
      variables: { input },
    });
    if (
      deleteDeckResponse.data.deleteDecks &&
      deleteDeckResponse.data.deleteDecks.id
    ) {
      console.log(
        "Deck deleted successfully:",
        deleteDeckResponse.data.deleteDecks,
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
}

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
