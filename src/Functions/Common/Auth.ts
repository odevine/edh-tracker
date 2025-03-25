import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

import { AuthContext } from "@/Types";

export function getAuthContext(
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): AuthContext {
  const claims = event.requestContext.authorizer.jwt.claims;

  const userId = String(claims?.sub ?? "");
  const groups = claims["cognito:groups"];

  const isAdmin = Array.isArray(groups)
    ? groups.includes("admin")
    : groups === "admin";

  if (!userId) {
    throw new Error("unauthorized: missing user id");
  }

  return { userId, isAdmin };
}
