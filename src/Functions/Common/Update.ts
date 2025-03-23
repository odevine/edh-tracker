export interface UpdateExpression {
  UpdateExpression: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, any>;
}

// builds a DynamoDB update expression from an input object
export const buildUpdateExpression = <T extends Record<string, any>>(
  updates: Partial<T>,
): UpdateExpression => {
  let UpdateExpression = "set";
  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, any> = {};

  for (const key of Object.keys(updates)) {
    UpdateExpression += ` #${key} = :${key},`;
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = updates[key];
  }

  // always update updatedAt
  UpdateExpression += " #updatedAt = :updatedAt";
  ExpressionAttributeNames["#updatedAt"] = "updatedAt";
  ExpressionAttributeValues[":updatedAt"] = new Date().toISOString();

  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};
