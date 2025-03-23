import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { User } from "@/Types";
import { createResponse } from "../Common/Response";
import {
  createUser,
  deleteUser,
  getUser,
  listUsers,
  updateUser,
} from "./Service";

export const handler: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  const { routeKey, pathParameters, body } = event;
  const id = pathParameters?.id ?? "";

  try {
    switch (routeKey) {
      case "GET /users":
        // list all users
        const users = await listUsers();
        return createResponse(200, users);

      case "GET /users/{id}":
        // get user by id
        if (!id) {
          return createResponse(400, { message: "missing user id" });
        }

        const user = await getUser(id);
        return user
          ? createResponse(200, user)
          : createResponse(404, { message: "user not found" });

      case "POST /users":
        // create a new user
        if (!body) {
          return createResponse(400, { message: "missing request body" });
        }

        const newUser: User = JSON.parse(body);
        await createUser(newUser);
        return createResponse(201, newUser);

      case "PUT /users/{id}":
        // update user
        if (!id || !body) {
          return createResponse(400, { message: "missing user id or body" });
        }

        const updates = JSON.parse(body);
        const updatedUser = await updateUser(id, updates);
        return createResponse(200, updatedUser);

      case "DELETE /users/{id}":
        // delete user
        if (!id) {
          return createResponse(400, { message: "missing user id" });
        }

        await deleteUser(id);
        return createResponse(204, null);

      default:
        return createResponse(400, { message: "unsupported route or method" });
    }
  } catch (error: any) {
    console.error("user handler error:", error);
    return createResponse(500, {
      message: error.message || "internal server error",
    });
  }
};
