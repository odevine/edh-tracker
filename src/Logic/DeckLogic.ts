import { AuthUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import axios from "axios";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";

import {
  CreateDeckInput,
  Deck,
  DecksByDeckOwnerIdQueryVariables,
  DeleteDeckInput,
  UpdateDeckInput,
} from "@/API";
import { createDeck, deleteDeck, updateDeck } from "@/graphql/mutations";
import { decksByDeckOwnerId, listDecks } from "@/graphql/queries";

const client = generateClient();

export const getAllDecksFn = async (): Promise<Deck[] | null> => {
  try {
    const allDecksResponse = await client.graphql({ query: listDecks });

    if (allDecksResponse.data && allDecksResponse.data.listDecks) {
      return allDecksResponse.data.listDecks.items as Deck[];
    }
    return null;
  } catch (error) {
    console.error("Error fetching decks:", error);
    return null;
  }
};

export const getDecksByOwnerFn = async (
  user: AuthUser,
): Promise<Deck[] | null> => {
  // Return early if user object is not valid
  if (!user || !user.userId) {
    console.error("Invalid or missing user object");
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
      console.log(`No deck found for ${updatedDeck.id}, or update failed`);
      return null;
    }
  } catch (error) {
    console.error("Error updating deck:", error);
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
        "Deck deleted successfully:",
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
