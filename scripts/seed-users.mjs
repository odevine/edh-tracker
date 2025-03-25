import {
  BatchWriteItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import csv from "csv-parser";
import fs from "fs";

const TABLE_NAME = process.env.USERS_TABLE || "EDH-User-dev";
const REGION = process.env.AWS_REGION || "us-east-1";

const client = new DynamoDBClient({ region: REGION });

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const items = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const item = {
          id: row.id,
          displayName: row.displayName,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        };

        if (row.description) item.description = row.description;
        if (row.profilePictureURL)
          item.profilePictureURL = row.profilePictureURL;
        if (row.lastOnline) item.lastOnline = row.lastOnline;
        if (row.lightThemeColor) item.lightThemeColor = row.lightThemeColor;
        if (row.darkThemeColor) item.darkThemeColor = row.darkThemeColor;

        items.push(item);
      })
      .on("end", () => resolve(items))
      .on("error", reject);
  });
}

async function deleteAllUsers() {
  console.log("🧹 Deleting all existing users...");

  let lastKey;
  let deleted = 0;

  do {
    const result = await client.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        ExclusiveStartKey: lastKey,
        ProjectionExpression: "id",
      }),
    );

    for (const item of result.Items || []) {
      await client.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { id: item.id },
        }),
      );
      deleted++;
      if (deleted % 50 === 0) {
        console.log(`🗑️  Deleted ${deleted} users...`);
      }
    }

    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  console.log(`✅ Deleted a total of ${deleted} users`);
}

async function batchWrite(items) {
  const chunks = [];
  while (items.length) chunks.push(items.splice(0, 25));

  for (const chunk of chunks) {
    const params = {
      RequestItems: {
        [TABLE_NAME]: chunk.map((item) => ({
          PutRequest: {
            Item: marshall(item),
          },
        })),
      },
    };

    try {
      await client.send(new BatchWriteItemCommand(params));
      console.log(`✅ Inserted ${chunk.length} users into ${TABLE_NAME}`);
    } catch (err) {
      console.error("❌ Error writing batch:", err);
    }
  }
}

(async () => {
  try {
    await deleteAllUsers();
    const users = await parseCSV("./scripts/seed-data/users.csv");
    await batchWrite(users);
    console.log("🎉 User table seeded successfully.");
  } catch (err) {
    console.error("🚨 Failed to seed users:", err);
  }
})();
