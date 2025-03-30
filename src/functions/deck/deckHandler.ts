import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyHandlerV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { getAuthContext } from "@/functions/common/auth";
import { parseJsonBody } from "@/functions/common/parseJson";
import { createResponse } from "@/functions/common/response";
import {
  createDeck,
  deleteDeck,
  getDeck,
  listDecks,
  updateDeck,
} from "@/functions/deck/deckService";
import { CreateDeckInput, UpdateDeckInput } from "@/types";

export const deckHandler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyResultV2> => {
  const { routeKey, pathParameters, body } = event;
  const id = pathParameters?.id ?? "";

  try {
    switch (routeKey) {
      // returns a list of all decks
      case "GET /decks": {
        const decks = await listDecks();
        return createResponse(200, decks);
      }

      // returns a deck by id
      case "GET /decks/{id}": {
        if (!id) {
          return createResponse(400, { message: "missing deck id" });
        }

        const deck = await getDeck(id);
        return deck
          ? createResponse(200, deck)
          : createResponse(404, { message: "deck not found" });
      }

      // creates and returns a new deck
      case "POST /decks": {
        const createInput = parseJsonBody<CreateDeckInput>(body ?? null);
        if (!createInput) {
          return createResponse(400, {
            message: "missing or invalid request body",
          });
        }

        const created = await createDeck(createInput);
        return createResponse(201, created);
      }

      // updates a deck by id
      // requires admin or self
      case "PUT /decks/{id}": {
        if (!id) {
          return createResponse(400, { message: "missing deck id" });
        }

        const updateInput = parseJsonBody<UpdateDeckInput>(body ?? null);
        if (!updateInput) {
          return createResponse(400, {
            message: "missing or invalid request body",
          });
        }

        const putContext = getAuthContext(event);
        const deckToUpdate = await getDeck(id);

        if (!putContext.isAdmin && deckToUpdate?.userId !== putContext.userId) {
          return createResponse(403, { message: "forbidden" });
        }

        if (!deckToUpdate) {
          return createResponse(404, { message: "deck not found" });
        }

        const updatedDeck = await updateDeck(id, updateInput);
        return createResponse(200, updatedDeck);
      }

      // deletes a deck by id
      // requires admin or self
      case "DELETE /decks/{id}": {
        if (!id) {
          return createResponse(400, { message: "missing deck id" });
        }

        const deleteContext = getAuthContext(event);
        const deckToDelete = await getDeck(id);

        if (
          !deleteContext.isAdmin &&
          deckToDelete?.userId !== deleteContext.userId
        ) {
          return createResponse(403, { message: "forbidden" });
        }

        if (!deckToDelete) {
          return createResponse(404, { message: "deck not found" });
        }

        await deleteDeck(id);
        return createResponse(204, null);
      }

      // any unsupported route/method
      default: {
        return createResponse(400, { message: "unsupported route or method" });
      }
    }
  } catch (error: any) {
    console.error("deck handler error:", error);
    return createResponse(500, {
      message: error.message || "internal server error",
    });
  }
};
