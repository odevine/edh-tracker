import { APIGatewayProxyResultV2 } from "aws-lambda";

export const createResponse = (
  statusCode: number,
  body: unknown = null,
): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: body === null ? "" : JSON.stringify(body),
  isBase64Encoded: false,
});
