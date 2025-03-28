import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyHandlerV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { createResponse, getAuthContext } from "@/Functions/Common";
import { CreateMatchInput, UpdateMatchInput } from "@/Types";
import {
  createMatch,
  deleteMatch,
  getMatch,
  listMatches,
  updateMatch,
} from "./Service";

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyResultV2> => {
  const { routeKey, body, pathParameters } = event;
  const id = pathParameters?.id ?? "";

  try {
    switch (routeKey) {
      case "GET /matches":
        return createResponse(200, await listMatches());

      case "GET /matches/{id}":
        if (!id) {
          return createResponse(400, { message: "missing match id" });
        }

        const match = await getMatch(id);
        return match
          ? createResponse(200, match)
          : createResponse(404, { message: "match not found" });

      case "POST /matches":
        if (!body) {
          return createResponse(400, { message: "missing body" });
        }

        const input: CreateMatchInput = JSON.parse(body);
        return createResponse(201, await createMatch(input));

      case "PUT /matches/{id}":
        if (!id || !body) {
          return createResponse(400, { message: "missing match id or body" });
        }

        const putContext = getAuthContext(event);
        if (!putContext.isAdmin) {
          return createResponse(403, { message: "forbidden" });
        }

        const matchToUpdate = await getMatch(id);
        if (!matchToUpdate) {
          return createResponse(404, { message: "match not found" });
        }

        const updates: UpdateMatchInput = JSON.parse(body);
        return createResponse(200, await updateMatch(id, updates));

      case "DELETE /matches/{id}":
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

      default:
        return createResponse(400, { message: "unsupported route or method" });
    }
  } catch (err: any) {
    console.error("Match function error:", err);
    return createResponse(500, {
      message: err.message || "internal server error",
    });
  }
};
