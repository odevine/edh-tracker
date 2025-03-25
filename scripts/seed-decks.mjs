import {
  BatchWriteItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import csv from "csv-parser";
import fs from "fs";

const TABLE_NAME = process.env.DECKS_TABLE || "EDH-Deck-dev";
const REGION = process.env.AWS_REGION || "us-east-1";

const client = new DynamoDBClient({ region: REGION });

function parseColorArray(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    return parsed.map((colorObj) => colorObj.S);
  } catch {
    return [];
  }
}

async function deleteAllDecks() {
  console.log("🧹 Deleting all existing decks...");

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
        console.log(`🗑️  Deleted ${deleted} decks...`);
      }
    }

    lastKey = result.LastEvaluatedKey;
  } while (lastKey);

  console.log(`✅ Deleted a total of ${deleted} decks`);
}

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const items = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const item = {
          id: row.id,
          userId: row.userId,
          formatId: row.formatId,
          deckName: row.deckName,
          commanderName: row.commanderName,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        };

        if (row.commanderColors) {
          item.commanderColors = parseColorArray(row.commanderColors);
        }

        if (row.secondCommanderName)
          item.secondCommanderName = row.secondCommanderName;

        if (row.secondCommanderColors) {
          item.secondCommanderColors = parseColorArray(
            row.secondCommanderColors,
          );
        }

        if (row.link) item.link = row.link;
        if (row.cost) item.cost = parseFloat(row.cost);
        if (row.isInactive) item.inactive = row.isInactive === "True"; // renamed

        items.push(item);
      })
      .on("end", () => resolve(items))
      .on("error", reject);
  });
}

async function batchWrite(items) {
  const chunks = [];
  while (items.length) chunks.push(items.splice(0, 25));

  for (const chunk of chunks) {
    const params = {
      RequestItems: {
        [TABLE_NAME]: chunk.map((item) => ({
          PutRequest: {
            Item: marshall(item, { removeUndefinedValues: true }),
          },
        })),
      },
    };

    try {
      await client.send(new BatchWriteItemCommand(params));
      console.log(`✅ Inserted ${chunk.length} decks into ${TABLE_NAME}`);
    } catch (err) {
      console.error("❌ Error writing batch:", err);
    }
  }
}

(async () => {
  try {
    await deleteAllDecks();
    const decks = await parseCSV("./scripts/seed-data/decks.csv");
    await batchWrite(decks);
    console.log("🎉 Deck table seeded successfully.");
  } catch (err) {
    console.error("🚨 Failed to seed decks:", err);
  }
})();
