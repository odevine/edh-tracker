import {
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyHandlerV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import {
  createResponse,
  getAuthContext,
  parseJsonBody,
} from "@/Functions/Common";
import { CreateUserInput, UpdateUserInput } from "@/Types";
import { createUser, getUser, listUsers, updateUser } from "./Service";

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyResultV2> => {
  const { routeKey, pathParameters, body } = event;
  const id = pathParameters?.id ?? "";

  try {
    switch (routeKey) {
      // returns a list of all users
      case "GET /users": {
        const users = await listUsers();
        return createResponse(200, users);
      }

      // returns a user by id
      case "GET /users/{id}": {
        if (!id) {
          return createResponse(400, { message: "missing user id" });
        }

        const user = await getUser(id);
        return user
          ? createResponse(200, user)
          : createResponse(404, { message: "user not found" });
      }

      // creates and returns a new user
      // should be handled by postauth trigger
      // requires admin privileges
      case "POST /users": {
        const postContext = getAuthContext(event);
        if (!postContext.isAdmin) {
          return createResponse(403, { message: "forbidden" });
        }

        const createInput = parseJsonBody<CreateUserInput>(body ?? null);
        if (!createInput) {
          return createResponse(400, {
            message: "missing or invalid request body",
          });
        }

        const createdUser = await createUser(createInput);
        return createResponse(201, createdUser);
      }

      // updates a user by id
      // requires admin or self
      case "PUT /users/{id}": {
        if (!id) {
          return createResponse(400, { message: "missing user id" });
        }

        const updateInput = parseJsonBody<UpdateUserInput>(body ?? null);
        if (!updateInput) {
          return createResponse(400, {
            message: "missing or invalid request body",
          });
        }

        const putContext = getAuthContext(event);
        const userToUpdate = await getUser(id);

        if (!putContext.isAdmin && userToUpdate?.id !== putContext.userId) {
          return createResponse(403, { message: "forbidden" });
        }

        if (!userToUpdate) {
          return createResponse(404, { message: "user not found" });
        }

        const updatedUser = await updateUser(id, updateInput);
        return createResponse(200, updatedUser);
      }

      // any unsupported route/method
      default: {
        return createResponse(400, { message: "unsupported route or method" });
      }
    }
  } catch (error: any) {
    console.error("user handler error:", error);
    return createResponse(500, {
      message: error.message || "internal server error",
    });
  }
};
