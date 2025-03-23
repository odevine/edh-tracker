import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { CreateMatchInput, UpdateMatchInput } from "@/Types/Match";
import { createResponse } from "../Common/Response";
import { createMatch, getMatch, listMatches, updateMatch } from "./Service";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2,
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
        const updates: UpdateMatchInput = JSON.parse(body);
        return createResponse(200, await updateMatch(id, updates));

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
