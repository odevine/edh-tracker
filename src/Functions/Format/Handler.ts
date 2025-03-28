import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyHandlerV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { createResponse, getAuthContext } from "@/Functions/Common";
import { CreateFormatInput, UpdateFormatInput } from "@/Types";
import {
  createFormat,
  deleteFormat,
  getFormat,
  listFormats,
  updateFormat,
} from "./Service";

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyResultV2> => {
  console.log("event received:", JSON.stringify(event));

  const { routeKey, pathParameters, body } = event;
  const id = pathParameters?.id ?? "";

  try {
    switch (routeKey) {
      case "GET /formats":
        const formats = await listFormats();
        return createResponse(200, formats);

      case "GET /formats/{id}":
        if (!id) {
          return createResponse(400, { message: "missing format id" });
        }

        const format = await getFormat(id);
        return format
          ? createResponse(200, format)
          : createResponse(404, { message: "format not found" });

      case "POST /formats":
        if (!body) {
          return createResponse(400, { message: "missing request body" });
        }

        const newformat: CreateFormatInput = JSON.parse(body);
        const created = await createFormat(newformat);
        return createResponse(201, created);

      case "PUT /formats/{id}":
        if (!id || !body) {
          return createResponse(400, { message: "missing format id or body" });
        }

        const putContext = getAuthContext(event);
        if (!putContext.isAdmin) {
          return createResponse(403, { message: "forbidden" });
        }

        const formatToUpdate = await getFormat(id);
        if (!formatToUpdate) {
          return createResponse(404, { message: "match not found" });
        }

        const updates: UpdateFormatInput = JSON.parse(body);
        return createResponse(200, await updateFormat(id, updates));

      case "DELETE /formats/{id}":
        if (!id) {
          return createResponse(400, { message: "missing format id" });
        }

        const deleteContext = getAuthContext(event);
        if (!deleteContext.isAdmin) {
          return createResponse(403, { message: "forbidden" });
        }

        const formatToDelete = await getFormat(id);
        if (!formatToDelete) {
          return createResponse(404, { message: "match not found" });
        }

        await deleteFormat(id);
        return createResponse(204, null);

      default:
        return createResponse(400, { message: "unsupported route or method" });
    }
  } catch (error: any) {
    console.error("format handler error:", error);
    return createResponse(500, {
      message: error.message || "internal server error",
    });
  }
};
