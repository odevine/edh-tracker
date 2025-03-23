import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { CreateFormatInput, UpdateFormatInput } from "@/Types/Format";
import { createResponse } from "../Common/Response";
import {
  createFormat,
  deleteFormat,
  getFormat,
  listFormats,
  updateFormat,
} from "./Service";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2,
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
          return createResponse(400, {
            message: "missing format id or body",
          });
        }
        const updates: UpdateFormatInput = JSON.parse(body);
        const updated = await updateFormat(id, updates);
        return createResponse(200, updated);

      case "DELETE /formats/{id}":
        if (!id) {
          return createResponse(400, { message: "missing format id" });
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
