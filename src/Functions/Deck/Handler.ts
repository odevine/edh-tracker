import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyHandlerV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { createResponse, getAuthContext } from "@/Functions/Common";
import { CreateDeckInput, UpdateDeckInput } from "@/Types/Deck";
import {
  createDeck,
  deleteDeck,
  getDeck,
  listDecks,
  updateDeck,
} from "./Service";

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyResultV2> => {
  const { routeKey, pathParameters, body } = event;
  const id = pathParameters?.id ?? "";

  try {
    switch (routeKey) {
      case "GET /decks":
        const decks = await listDecks();
        return createResponse(200, decks);

      case "GET /decks/{id}":
        if (!id) {
          return createResponse(400, { message: "missing deck id" });
        }
        const deck = await getDeck(id);
        return deck
          ? createResponse(200, deck)
          : createResponse(404, { message: "deck not found" });

      case "POST /decks":
        if (!body) {
          return createResponse(400, { message: "missing request body" });
        }
        const newDeck: CreateDeckInput = JSON.parse(body);
        const created = await createDeck(newDeck);
        return createResponse(201, created);

      case "PUT /decks/{id}":
        if (!id || !body) {
          return createResponse(400, { message: "missing deck id or body" });
        }

        const deckToUpdate = await getDeck(id);
        if (!deckToUpdate) {
          return createResponse(404, { message: "deck not found" });
        }

        const putContext = getAuthContext(event);
        if (!putContext.isAdmin && deckToUpdate?.userId !== putContext.userId) {
          return createResponse(403, { message: "forbidden" });
        }

        const updates: UpdateDeckInput = JSON.parse(body);
        const updatedDeck = await updateDeck(id, updates);
        return createResponse(200, updatedDeck);

      case "DELETE /decks/{id}":
        if (!id) {
          return createResponse(400, { message: "missing deck id" });
        }

        const deleteContext = getAuthContext(event);
        const deckToDelete = await getDeck(id);

        if (!deckToDelete) {
          return createResponse(404, { message: "deck not found" });
        }

        if (
          !deleteContext.isAdmin &&
          deckToDelete?.userId !== deleteContext.userId
        ) {
          return createResponse(403, { message: "forbidden" });
        }

        await deleteDeck(id);
        return createResponse(204, null);

      default:
        return createResponse(400, { message: "unsupported route or method" });
    }
  } catch (error: any) {
    console.error("deck handler error:", error);
    return createResponse(500, {
      message: error.message || "internal server error",
    });
  }
};
