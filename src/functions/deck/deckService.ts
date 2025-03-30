import { randomUUID } from "crypto";

import { dynamo } from "@/functions/common/db";
import { requireEnv } from "@/functions/common/env";
import { buildUpdateExpression } from "@/functions/common/update";
import { CreateDeckInput, Deck, UpdateDeckInput } from "@/types";

const DECK_TABLE = requireEnv("DECK_TABLE");

// fetches all decks from the database
export const listDecks = async (): Promise<Deck[]> => {
  const result = await dynamo.scan({ TableName: DECK_TABLE });
  return (result.Items as Deck[]) || [];
};

// fetches a single deck by id
export const getDeck = async (id: string): Promise<Deck | null> => {
  const result = await dynamo.get({
    TableName: DECK_TABLE,
    Key: { id },
  });
  return (result.Item as Deck) || null;
};

// creates a new deck in the database
export const createDeck = async (input: CreateDeckInput): Promise<Deck> => {
  if (input.id) {
    const existing = await getDeck(input.id);
    if (existing) {
      throw new Error(`deck with id "${input.id}" already exists`);
    }
  }

  const deck: Deck = {
    ...input,
    id: input.id ?? randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await dynamo.put({ TableName: DECK_TABLE, Item: deck });
  return deck;
};

// updates an existing deck with partial input fields
export const updateDeck = async (
  id: string,
  updates: UpdateDeckInput,
): Promise<Deck> => {
  const {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  } = buildUpdateExpression<Deck>(updates);

  const result = await dynamo.update({
    TableName: DECK_TABLE,
    Key: { id },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  return result.Attributes as Deck;
};

// deletes a deck by its id
export const deleteDeck = async (id: string): Promise<void> => {
  await dynamo.delete({ TableName: DECK_TABLE, Key: { id } });
};
