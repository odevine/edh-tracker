import { User } from "@/Types";
import { dynamo } from "../Common/Db";
import { requireEnv } from "../Common/Env";
import { buildUpdateExpression } from "../Common/Update";

const USER_TABLE = requireEnv("USER_TABLE");

// fetches all users from the database
export const listUsers = async (): Promise<User[]> => {
  const result = await dynamo.scan({ TableName: USER_TABLE });
  return (result.Items as User[]) || [];
};

// fetches a single user by their id
export const getUser = async (id: string): Promise<User | null> => {
  const result = await dynamo.get({
    TableName: USER_TABLE,
    Key: { id },
  });
  return (result.Item as User) || null;
};

// creates a new user in the database
export const createUser = async (user: User): Promise<void> => {
  await dynamo.put({
    TableName: USER_TABLE,
    Item: user,
  });
};

// updates an existing user with partial input fields
export const updateUser = async (
  id: string,
  updates: Partial<User>,
): Promise<User> => {
  const {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  } = buildUpdateExpression<User>(updates);

  const result = await dynamo.update({
    TableName: USER_TABLE,
    Key: { id },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  return result.Attributes as User;
};

// deletes a user by their id
export const deleteUser = async (id: string): Promise<void> => {
  await dynamo.delete({
    TableName: USER_TABLE,
    Key: { id },
  });
};
