export type UUID = string;

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiResponse<T> {
  statusCode: number;
  body: T;
}

export interface ErrorResponse {
  message: string;
}
