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
        if (row.profilePictureURL) {
          item.profilePictureURL = row.profilePictureURL;
        }
        if (row.lastOnline) {
          item.lastOnline = row.lastOnline;
        }
        if (row.lightThemeColor) {
          item.lightThemeColor = row.lightThemeColor;
        }
        if (row.darkThemeColor) {
          item.darkThemeColor = row.darkThemeColor;
        }

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
    let requestItems = {
      [TABLE_NAME]: chunk.map((item) => ({
        PutRequest: { Item: marshall(item) },
      })),
    };

    let retryCount = 0;
    do {
      const response = await client.send(
        new BatchWriteItemCommand({
          RequestItems: requestItems,
        }),
      );

      const unprocessed = response.UnprocessedItems?.[TABLE_NAME] || [];

      if (unprocessed.length > 0) {
        console.warn(`⚠️ Retrying ${unprocessed.length} unprocessed items...`);
        requestItems = { [TABLE_NAME]: unprocessed };
        await new Promise((r) => setTimeout(r, 500 * (retryCount + 1))); // simple backoff
        retryCount++;
      } else {
        console.log(`✅ Inserted ${chunk.length} users into ${TABLE_NAME}`);
        break;
      }
    } while (retryCount < 5);

    if (retryCount === 5) {
      console.error("❌ Gave up on some unprocessed items after 5 retries.");
    }
  }
}

(async () => {
  try {
    await deleteAllUsers();
    const users = await parseCSV("./scripts/seed-data/users.csv");
    console.log(`Parsed ${users.length} users`);
    console.log(users.map((u) => u.displayName));
    await batchWrite(users);
    console.log("🎉 User table seeded successfully.");
  } catch (err) {
    console.error("🚨 Failed to seed users:", err);
  }
})();
