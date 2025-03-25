export interface UpdateExpression {
  UpdateExpression: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, any>;
}

// builds a DynamoDB update expression from an input object
export const buildUpdateExpression = <T extends object>(updates: Partial<T>) => {
  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, any> = {};
  const sets = new Set<string>();

  for (const key of Object.keys(updates)) {
    const name = `#${key}`;
    const value = `:${key}`;

    // avoid duplicate keys in UpdateExpression
    if (!sets.has(name)) {
      ExpressionAttributeNames[name] = key;
      ExpressionAttributeValues[value] = (updates as any)[key];
      sets.add(`${name} = ${value}`);
    }
  }

  return {
    UpdateExpression: `SET ${Array.from(sets).join(", ")}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};
