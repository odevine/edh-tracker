import { randomUUID } from "crypto";

import { dynamo } from "@/api/utils/db";
import { requireEnv } from "@/api/utils/env";
import { buildUpdateExpression } from "@/api/utils/update";
import { CreateFormatInput, Format } from "@/types";

const FORMAT_TABLE = requireEnv("FORMAT_TABLE");

// fetches all formats from the database
export const listFormats = async (): Promise<Format[]> => {
  const result = await dynamo.scan({ TableName: FORMAT_TABLE });
  return (result.Items as Format[]) || [];
};

// fetches a single format by its id
export const getFormat = async (id: string): Promise<Format | null> => {
  const result = await dynamo.get({
    TableName: FORMAT_TABLE,
    Key: { id },
  });

  if (!result.Item) {
    return null;
  }

  return result.Item as Format;
};

// creates a new format in the database
export const createFormat = async (
  input: CreateFormatInput,
): Promise<Format> => {
  if (input.id) {
    const existing = await getFormat(input.id);
    if (existing) {
      throw new Error(`format with id "${input.id}" already exists`);
    }
  }

  const format: Format = {
    ...input,
    id: input.id || randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await dynamo.put({ TableName: FORMAT_TABLE, Item: format });
  return format;
};

// updates an existing format
export const updateFormat = async (
  id: string,
  updates: Partial<Format>,
): Promise<Format> => {
  const existing = await getFormat(id);
  if (!existing) {
    throw new Error(`format with id "${id}" does not exist`);
  }

  const {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  } = buildUpdateExpression<Partial<Format>>(updates);

  const result = await dynamo.update({
    TableName: FORMAT_TABLE,
    Key: { id },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  return result.Attributes as Format;
};

// deletes a format by its id
export const deleteFormat = async (id: string): Promise<void> => {
  await dynamo.delete({ TableName: FORMAT_TABLE, Key: { id } });
};
