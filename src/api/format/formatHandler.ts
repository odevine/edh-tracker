import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyHandlerV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import {
  createFormat,
  deleteFormat,
  getFormat,
  listFormats,
  updateFormat,
} from "@/api/format/formatService";
import { getAuthContext } from "@/api/utils/auth";
import { parseJsonBody } from "@/api/utils/parseJson";
import { createResponse } from "@/api/utils/response";
import { CreateFormatInput, UpdateFormatInput } from "@/types";

export const formatHandler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyResultV2> => {
  console.log("event received:", JSON.stringify(event));

  const { routeKey, pathParameters, body } = event;
  const id = pathParameters?.id ?? "";

  try {
    switch (routeKey) {
      // returns a list of all formats
      case "GET /formats": {
        const formats = await listFormats();
        return createResponse(200, formats);
      }

      // returns a format by id
      // probably won't ever be needed, but figured it should exist for completeness
      case "GET /formats/{id}": {
        if (!id) {
          return createResponse(400, { message: "missing format id" });
        }

        const format = await getFormat(id);
        return format
          ? createResponse(200, format)
          : createResponse(404, { message: "format not found" });
      }

      // creates and returns a new format
      // requires admin privileges
      case "POST /formats": {
        const postContext = getAuthContext(event);
        if (!postContext.isAdmin) {
          return createResponse(403, { message: "forbidden" });
        }

        const createInput = parseJsonBody<CreateFormatInput>(body ?? null);
        if (!createInput) {
          return createResponse(400, {
            message: "missing or invalid request body",
          });
        }

        const createdFormat = await createFormat(createInput);
        return createResponse(201, createdFormat);
      }

      // updates a format by id
      // requires admin privileges
      case "PUT /formats/{id}": {
        if (!id) {
          return createResponse(400, { message: "missing format id" });
        }

        const putContext = getAuthContext(event);
        if (!putContext.isAdmin) {
          return createResponse(403, { message: "forbidden" });
        }

        const updateInput = parseJsonBody<UpdateFormatInput>(body ?? null);
        if (!updateInput) {
          return createResponse(400, {
            message: "missing or invalid request body",
          });
        }

        const formatToUpdate = await getFormat(id);
        if (!formatToUpdate) {
          return createResponse(404, { message: "format not found" });
        }

        const updatedFormat = await updateFormat(id, updateInput);
        return createResponse(200, updatedFormat);
      }

      // deletes a format by id
      // not accessible through gateway, just for testing api
      case "DELETE /formats/{id}": {
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
      }

      // any unsupported route/method
      default: {
        return createResponse(400, { message: "unsupported route or method" });
      }
    }
  } catch (error: any) {
    console.error("format handler error:", error);
    return createResponse(500, {
      message: error.message || "internal server error",
    });
  }
};
