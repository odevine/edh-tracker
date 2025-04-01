import { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

import { AuthContext } from "@/types";

const parseGroups = (raw: string | string[] | undefined): string[] => {
  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    return raw;
  }

  if (typeof raw === "string") {
    try {
      // first attempt proper JSON parse
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // handle single-quoted or malformed arrays like "['admin','another']"
      const cleaned = raw
        // strip outer brackets
        .replace(/^\[|\]$/g, "")
        // split on commas
        .split(",")
        // strip quotes
        .map((g) => g.trim().replace(/^['"]|['"]$/g, ""))
        // remove empty strings
        .filter(Boolean);
      return cleaned;
    }
  }

  return [];
};

export function getAuthContext(
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): AuthContext {
  const claims = event.requestContext.authorizer.jwt.claims;

  const userId = String(claims?.sub ?? "");

  if (!userId) {
    throw new Error("unauthorized: missing user id");
  }

  const rawGroups = claims["cognito:groups"];
  const groups = parseGroups(rawGroups as string[]);
  console.log("  ~ groups:", groups);

  return { userId, isAdmin: groups.includes("admin") };
}
