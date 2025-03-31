import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyHandlerV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import {
  createMatch,
  deleteMatch,
  getMatch,
  listMatches,
  updateMatch,
} from "@/api/match/matchService";
import { getAuthContext } from "@/api/utils/auth";
import { parseJsonBody } from "@/api/utils/parseJson";
import { createResponse } from "@/api/utils/response";
import { CreateMatchInput, UpdateMatchInput } from "@/types";

export const matchHandler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyResultV2> => {
  const { routeKey, body, pathParameters } = event;
  const id = pathParameters?.id ?? "";

  try {
    switch (routeKey) {
      // returns a list of all matches
      case "GET /matches": {
        return createResponse(200, await listMatches());
      }

      // returns a match by id
      case "GET /matches/{id}": {
        if (!id) {
          return createResponse(400, { message: "missing match id" });
        }

        const match = await getMatch(id);
        return match
          ? createResponse(200, match)
          : createResponse(404, { message: "match not found" });
      }

      // creates and returns a new match
      case "POST /matches": {
        const createInput = parseJsonBody<CreateMatchInput>(body ?? null);
        if (!createInput) {
          return createResponse(400, {
            message: "missing or invalid request body",
          });
        }

        const createdMatch = await createMatch(createInput);
        return createResponse(201, createdMatch);
      }

      // updates a match by id
      // requires admin privileges
      case "PUT /matches/{id}": {
        if (!id) {
          return createResponse(400, { message: "missing match id" });
        }

        const updateInput = parseJsonBody<UpdateMatchInput>(body ?? null);
        if (!updateInput) {
          return createResponse(400, {
            message: "missing or invalid request body",
          });
        }

        const putContext = getAuthContext(event);
        if (!putContext.isAdmin) {
          return createResponse(403, { message: "forbidden" });
        }

        const matchToUpdate = await getMatch(id);
        if (!matchToUpdate) {
          return createResponse(404, { message: "match not found" });
        }

        const updatedMatch = await updateMatch(id, updateInput);
        return createResponse(200, updatedMatch);
      }

      // deletes a match by id
      // requires admin privileges
      case "DELETE /matches/{id}": {
        if (!id) {
          return createResponse(400, { message: "missing match id" });
        }

        const deleteContext = getAuthContext(event);
        if (!deleteContext.isAdmin) {
          return createResponse(403, { message: "forbidden" });
        }

        const matchToDelete = await getMatch(id);
        if (!matchToDelete) {
          return createResponse(404, { message: "match not found" });
        }

        await deleteMatch(id);
        return createResponse(204, null);
      }

      // any unsupported route/method
      default: {
        return createResponse(400, { message: "unsupported route or method" });
      }
    }
  } catch (err: any) {
    console.error("Match function error:", err);
    return createResponse(500, {
      message: err.message || "internal server error",
    });
  }
};
